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
import { isValidJSON } from "@/utils/app/misc";

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

  // Close sidebar when a conversation is selected/created on mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  const handleSend = async (message: Message, isResend: boolean) => {
    if (selectedConversation) {
      setMessageIsStreaming(true);
      let updatedConversation: Conversation;

      updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, message],
      };

      setSelectedConversation(updatedConversation);

      const lastMessage =
        updatedConversation.messages[updatedConversation.messages.length - 1];

      const ws = new WebSocket("wss://test.api.earth.guide:8766");
      ws.onopen = () => {
        let text = "";
        let isWsFirst = true;
        ws.onmessage = (event) => {
          const json = event.data;
          if (isValidJSON(json)) {
            let data: EarthGuideQuestionResponse = JSON.parse(json);
            text += data.formatted_text;
            console.log(text);

            if (isWsFirst) {
              isWsFirst = false;
              const updatedMessages: Message[] = [
                ...updatedConversation.messages,
                {
                  role: "earth.guide",
                  content: data.formatted_text,
                  id: data.id_answer,
                },
              ];

              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };

              setSelectedConversation(updatedConversation);
            } else {
              const updatedMessages: Message[] =
                updatedConversation.messages.map((message, index) => {
                  if (index === updatedConversation.messages.length - 1) {
                    return {
                      ...message,
                      content: text,
                    };
                  }

                  return message;
                });

              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };

              setSelectedConversation(updatedConversation);
            }
          } else {
            setMessageIsStreaming(false);
          }
        };

        ws.send(
          JSON.stringify({
            type_of_prompt:
              lastMessage.typeOfPrompt || TypeOfPrompt.TEXT_PROMPT,
            text:
              lastMessage.typeOfPrompt === TypeOfPrompt.TEXT_PROMPT ||
              !lastMessage.typeOfPrompt
                ? lastMessage.content
                : lastMessage.id,
            user_identification: machineId,
            language_of_browser: language,
            city_of_user: ipData?.city || "",
            gps: ipData?.gps || "",
            type_of_device: deviceType,
          })
        );
      };

      ws.onclose = (e) => {
        console.log(e);
        console.log("WebSocket closed");
      };
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
    if (
      typeOfPrompt === TypeOfPrompt.CLICK_ON_LOCATION ||
      typeOfPrompt === TypeOfPrompt.CLICK_ON_PRICE
    ) {
      setPanelDataLoading(true);
      setPanelData(null);
    }

    if (selectedConversation) {
      const ws = new WebSocket("wss://test.api.earth.guide:8766");
      ws.onopen = () => {
        let text = "";
        ws.onmessage = (event) => {
          const json = event.data;
          if (isValidJSON(json)) {
            const data: EarthGuideQuestionResponse = JSON.parse(json);
            console.log("valid json", data);

            if (
              data.where_to_display === WhereToDisplay.PANEL_DESTINATION ||
              data.where_to_display === WhereToDisplay.PANEL_FLIGHTS
            ) {
              text += data.formatted_text;
              setPanelData({
                content: text,
                type: data.where_to_display,
                id: +data.id_answer,
              });
              setShowPanelData(true);
            } else {
              let updatedConversation: Conversation;

              updatedConversation = {
                ...selectedConversation,
              };
            }
          } else {
            setPanelDataLoading(false);
          }
        };

        ws.send(
          JSON.stringify({
            type_of_prompt: typeOfPrompt,
            text: `${id}`,
            user_identification: machineId,
            language_of_browser: language,
            city_of_user: ipData?.city || "",
            gps: ipData?.gps || "",
            type_of_device: deviceType,
          })
        );
      };
      ws.onclose = (e) => {
        console.log(e);
        console.log("WebSocket closed");
      };
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
