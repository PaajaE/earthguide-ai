import { Chat } from "@/components/EG_Chat/Chat";
import { Navbar } from "@/components/Mobile/Navbar";
import {
  ChatBody,
  Conversation,
  DeviceTypes,
  EarthGuideQuestionResponse,
  IpData,
  KeyValuePair,
  Message,
  OpenAIModel,
  OpenAIModelID,
  OpenAIModels,
  PanelData,
  TypeOfPrompt,
  WhereToDisplay,
} from "@/types";
import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from "@/utils/app/clean";
import { DEFAULT_SYSTEM_PROMPT } from "@/utils/app/const";
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from "@/utils/app/conversation";
import getMachineId from "@/utils/app/machineId";
import { getLanguage, getDeviceType } from "@/utils/app/browserInfo";
import { fetchEGQuestion, fetchIpData } from "@/utils/server/requests";
import { IconArrowBarLeft, IconArrowBarRight } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RightSidebar } from "@/components/EG_Chat/RightSidebar";
import { LeftSidebar } from "@/components/EG_Chat/LeftSidebar";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [lightMode, setLightMode] = useState<"dark" | "light">("dark");
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [messageError, setMessageError] = useState<boolean>(false);
  const [modelError, setModelError] = useState<boolean>(false);
  const [machineId, setMachineId] = useState<string>("");
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [language, setLanguage] = useState<string>("en");
  const [deviceType, setDeviceType] = useState<DeviceTypes>(
    DeviceTypes.COMPUTER
  );
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [panelDataLoading, setPanelDataLoading] = useState<boolean>(false);
  const [showPanelData, setShowPanelData] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Close sidebar when a conversation is selected/created on mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const ws = new WebSocket("ws://test.api.earth.guide:8765");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  const handleSend = async (message: Message, isResend: boolean) => {
    sendMessage(message.content);

    if (selectedConversation) {
      let updatedConversation: Conversation;

      if (isResend) {
        const updatedMessages = [...selectedConversation.messages];
        updatedMessages.pop();

        updatedConversation = {
          ...selectedConversation,
          messages: [...updatedMessages, message],
        };
      } else {
        updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, message],
        };
      }

      setSelectedConversation(updatedConversation);
      setLoading(true);
      setMessageIsStreaming(true);
      setMessageError(false);

      const chatBody: ChatBody = {
        model: updatedConversation.model,
        messages: updatedConversation.messages,
        key: apiKey,
        prompt: updatedConversation.prompt,
      };

      const lastUserInput =
        updatedConversation.messages[updatedConversation.messages.length - 1]
          .content;

      const earthGuideResponse: Promise<EarthGuideQuestionResponse> =
        fetchEGQuestion({
          type_of_prompt: TypeOfPrompt.TEXT_PROMPT,
          text: lastUserInput,
          user_identification: machineId,
          language_of_browser: language,
          city_of_user: ipData?.city || "",
          gps: ipData?.gps || "",
          type_of_device: deviceType,
        });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatBody),
      });

      if (!response.ok) {
        setLoading(false);
        setMessageIsStreaming(false);
        setMessageError(true);
        return;
      }

      const data = response.body;

      if (!data) {
        setLoading(false);
        setMessageIsStreaming(false);
        setMessageError(true);

        return;
      }

      setLoading(false);

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirst = true;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        text += chunkValue;

        if (isFirst) {
          isFirst = false;
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: "assistant", content: chunkValue },
          ];

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };

          setSelectedConversation(updatedConversation);
        } else {
          const updatedMessages: Message[] = updatedConversation.messages.map(
            (message, index) => {
              if (index === updatedConversation.messages.length - 1) {
                return {
                  ...message,
                  content: text,
                };
              }

              return message;
            }
          );

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };

          setSelectedConversation(updatedConversation);
        }
      }

      earthGuideResponse
        .then((data: EarthGuideQuestionResponse) => {
          console.log("Question submitted successfully!");
          console.log(data);

          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            {
              role: "earth.guide",
              content: data.formatted_text,
              id: data.id_answer,
            },
          ];

          const enrichedConversation: Conversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };

          saveConversation(enrichedConversation);
          setSelectedConversation(enrichedConversation);

          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return enrichedConversation;
              }

              return conversation;
            }
          );

          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }

          setConversations(updatedConversations);

          saveConversations(updatedConversations);
        })
        .catch(() => {
          console.log("There was an error submitting the question.");
        });

      setMessageIsStreaming(false);
    }
  };

  const fetchModels = async (key: string) => {
    const response = await fetch("/api/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
      }),
    });

    if (!response.ok) {
      setModelError(true);
      return;
    }

    const data = await response.json();

    if (!data) {
      setModelError(true);
      return;
    }

    setModels(data);
  };

  const handleLightMode = (mode: "dark" | "light") => {
    setLightMode(mode);
    localStorage.setItem("theme", mode);
  };

  const handleApiKeyChange = (apiKey: string) => {
    setApiKey(apiKey);
    localStorage.setItem("apiKey", apiKey);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    saveConversation(conversation);
  };

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: lastConversation ? lastConversation.id + 1 : 1,
      name: `Conversation ${lastConversation ? lastConversation.id + 1 : 1}`,
      messages: [],
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      prompt: DEFAULT_SYSTEM_PROMPT,
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    setLoading(false);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id
    );
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(
        updatedConversations[updatedConversations.length - 1]
      );
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT,
      });
      localStorage.removeItem("selectedConversation");
    }
  };

  const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const { single, all } = updateConversation(
      updatedConversation,
      conversations
    );

    setSelectedConversation(single);
    setConversations(all);
  };

  const handleAnotherPromptClick = (typeOfPrompt: TypeOfPrompt, id: string) => {
    console.log(typeOfPrompt);
    if (
      typeOfPrompt === TypeOfPrompt.CLICK_ON_LOCATION ||
      typeOfPrompt === TypeOfPrompt.CLICK_ON_PRICE
    ) {
      setPanelDataLoading(true);
      setPanelData(null);
    }
    const earthGuideResponse: Promise<EarthGuideQuestionResponse> =
      fetchEGQuestion({
        type_of_prompt: typeOfPrompt,
        text: `${id}`,
        user_identification: machineId,
        language_of_browser: language,
        city_of_user: ipData?.city || "",
        gps: ipData?.gps || "",
        type_of_device: deviceType,
      });

    if (selectedConversation) {
      earthGuideResponse
        .then((data: EarthGuideQuestionResponse) => {
          if (
            data.where_to_display === WhereToDisplay.PANEL_DESTINATION ||
            data.where_to_display === WhereToDisplay.PANEL_FLIGHTS
          ) {
            setPanelData({
              content: data.formatted_text,
              type: data.where_to_display,
              id: +data.id_answer,
            });
            setShowPanelData(true);
            setPanelDataLoading(false);
          } else {
            let updatedConversation: Conversation;

            updatedConversation = {
              ...selectedConversation,
            };

            console.log("Question submitted successfully!");
            console.log(data);

            const updatedMessages: Message[] = [
              ...updatedConversation.messages,
              {
                role: "earth.guide",
                content: data.formatted_text,
                id: data.id_answer,
              },
            ];

            const enrichedConversation: Conversation = {
              ...updatedConversation,
              messages: updatedMessages,
            };

            saveConversation(enrichedConversation);
            setSelectedConversation(enrichedConversation);

            const updatedConversations: Conversation[] = conversations.map(
              (conversation) => {
                if (conversation.id === selectedConversation.id) {
                  return enrichedConversation;
                }

                return conversation;
              }
            );

            if (updatedConversations.length === 0) {
              updatedConversations.push(updatedConversation);
            }

            setConversations(updatedConversations);

            saveConversations(updatedConversations);
          }
        })
        .catch(() => {
          console.log("There was an error submitting the question.");
        });
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setLightMode(theme as "dark" | "light");
    }

    const apiKey = localStorage.getItem("apiKey") || "";
    if (apiKey) {
      setApiKey(apiKey);
    }

    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const conversationHistory = localStorage.getItem("conversationHistory");
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] =
        JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(
        parsedConversationHistory
      );
      setConversations(cleanedConversationHistory);
    }

    const selectedConversation = localStorage.getItem("selectedConversation");
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation =
        JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(
        parsedSelectedConversation
      );
      setSelectedConversation(cleanedSelectedConversation);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT,
      });
    }

    fetchModels(apiKey);
  }, []);

  useEffect(() => {
    const machId = getMachineId();
    setMachineId(machId);
    const ipData = fetchIpData();
    ipData.then((data) => {
      console.log(data);
      setIpData({
        city: data.city.name,
        ip: data.ip,
        gps: `${data.location.latitude},${data.location.longitude}`,
      });
    });
    const language = getLanguage();
    setLanguage(language);

    const deviceType = getDeviceType();
    setDeviceType(deviceType);
  }, []);

  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta name="description" content="ChatGPT but better." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectedConversation && (
        <div className={`flex flex-col h-100 w-100 text-white ${lightMode}`}>
          <div className="sm:hidden w-full fixed top-0">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          <div className="h-100 w-100 p-2">
            <div className="flex bg-[#FAFAFA] pl-6 py-10 rounded-md">
              {/* <> */}
              <LeftSidebar lightMode="light" />

              {/* <IconArrowBarLeft
                className="fixed top-2.5 left-4 sm:top-1 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8 sm:hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              /> */}
              {/* </> */}
              {/* {!showSidebar && !showPanelData ? (
              <IconArrowBarRight
                className="fixed top-2.5 left-4 sm:top-1.5 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => {
                  setShowSidebar(!showSidebar);
                  setShowPanelData(false);
                }}
              />
            ) : (
              <></>
            )} */}

              <Chat
                conversation={selectedConversation}
                messageIsStreaming={messageIsStreaming}
                modelError={modelError}
                messageError={messageError}
                models={models}
                loading={loading}
                lightMode={lightMode}
                onSend={handleSend}
                onUpdateConversation={handleUpdateConversation}
                onAnotherPromptClick={handleAnotherPromptClick}
              />
              {showPanelData && (
                <>
                  <RightSidebar
                    loading={panelDataLoading}
                    showSample={selectedConversation.messages.length === 0}
                    data={panelData}
                    lightMode="light"
                    onAnotherPromptClick={handleAnotherPromptClick}
                    onSend={handleSend}
                  />
                  {/* <IconArrowBarLeft
                  className="fixed top-2.5 left-4 sm:top-1 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8 sm:hidden"
                  onClick={() => setShowPanelData(true)}
                /> */}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
