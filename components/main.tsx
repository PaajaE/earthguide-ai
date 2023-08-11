import { jsonrepair } from 'jsonrepair';
import removeMarkdown from 'markdown-to-text';
import { Chat } from '@/components/EG_Chat/Chat';
import {
  Conversation,
  DeviceTypes,
  EarthGuideQuestionResponse,
  IFlightParamsConverted,
  IFlightParamsObtained,
  IMapDataConverted,
  IMapDataObtained,
  IRateAnswer,
  IpData,
  KeyValuePair,
  Message,
  OpenAIModel,
  OpenAIModelID,
  OpenAIModels,
  PanelData,
  TypeOfPrompt,
  WhereToDisplay,
} from '@/types';
import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/utils/app/clean';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { updateConversation } from '@/utils/app/conversation';
import getMachineId from '@/utils/app/machineId';
import { getLanguage, getDeviceType } from '@/utils/app/browserInfo';
import { fetchIpData } from '@/utils/server/requests';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { RightSidebar } from '@/components/EG_Chat/RightSidebar';
import { LeftSidebar } from '@/components/EG_Chat/LeftSidebar';
import {
  isValidJSON,
  extractSrcAttributesFromHTML,
  extractGpsCoordinates,
} from '@/utils/app/misc';
import { Gallery } from '@/components/EG_Chat/Gallery';
import { RightSidebarMobile } from '@/components/EG_Chat/RightSidebarMobile';
import { IAirlineDataItem } from '@/utils/data/airlines';

export default function Main({
  specificAirlines = '',
  airlineData,
}: {
  specificAirlines?: string;
  airlineData: IAirlineDataItem;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(
    []
  );
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [loading, setLoading] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<'dark' | 'light'>(
    'dark'
  );
  const [messageIsStreaming, setMessageIsStreaming] =
    useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [messageError, setMessageError] = useState<boolean>(false);
  const [machineId, setMachineId] = useState<string>('');
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [language, setLanguage] = useState<string>('en');
  const [deviceType, setDeviceType] = useState<DeviceTypes>(
    DeviceTypes.COMPUTER
  );
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [panelDataLoading, setPanelDataLoading] =
    useState<boolean>(false);
  const [showPanelData, setShowPanelData] = useState<boolean>(true);
  const [showMobilePanelData, setShowMobilePanelData] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newSession, setNewSession] = useState<boolean>(true);
  const [galleryItems, setGalleryItems] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [mapData, setMapData] = useState<IMapDataConverted[]>([])
  const [flightParams, setFlightParams] = useState<IFlightParamsConverted | undefined>(undefined);

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
        updatedConversation.messages[
          updatedConversation.messages.length - 1
        ];

      const ws = new WebSocket(
        process.env.NEXT_PUBLIC_EG_WSS_URL ?? ''
      );
      ws.onopen = () => {
        let text = '';
        let isWsFirst = true;
        let convertedMapData: IMapDataConverted[]
        let flightParametersData: IFlightParamsConverted
        ws.onmessage = (event) => {
          const json = event.data;
          if (isValidJSON(json)) {
            let data: EarthGuideQuestionResponse = JSON.parse(json);
            text += data.formatted_text;

            if (data.additional_data) {
              const replacedString = data.additional_data.replaceAll('"', '\\"').replaceAll('\'', '"').replaceAll('\\"', '\'')
              const fixedData = jsonrepair(replacedString);
              if (data.json_type === 'all_other_types_all_locations') {
                const mapDataObtained: IMapDataObtained[] = JSON.parse(fixedData);
                convertedMapData = mapDataObtained.map(
                  (mapLocation) => {
                    const { id, gps, location, photos, price } = mapLocation;
                    const locationString = removeMarkdown(location);
                    const photosArr =
                      extractSrcAttributesFromHTML(photos);
                    const gpsObject = extractGpsCoordinates(gps);

                    return {
                      id,
                      gps: gpsObject,
                      photos: photosArr,
                      locationTitle: locationString,
                      price,
                    };
                  }
                );
              } else if (data.json_type === 'Flight_parameters') {
                const fp: IFlightParamsObtained = JSON.parse(fixedData);
                flightParametersData = {
                  curr: fp.curr,
                  date_from:
                    fp.date_from.length > 0
                      ? fp.date_from
                      : undefined,
                  date_to:
                    fp.date_from.length > 0
                      ? fp.date_from
                      : undefined,
                  departure_airport: fp.departure_airport.includes(
                    'Your position:'
                  )
                    ? undefined
                    : fp.departure_airport,
                  departure_airport_set:
                    fp.departure_airport.includes('Your position:')
                      ? false
                      : true,
                  flight_type: fp.flight_type,
                  fly_from_lat: +fp.fly_from_lat,
                  fly_from_lon: +fp.fly_from_lon,
                  fly_from_radius: +fp.fly_from_radius,
                  nights_in_dst_from:
                    fp.nights_in_dst_from.length > 0
                      ? +fp.nights_in_dst_from
                      : undefined,
                  nights_in_dst_to:
                    fp.nights_in_dst_to.length > 0
                      ? +fp.nights_in_dst_to
                      : undefined,
                  return_from:
                    fp.return_from.length > 0
                      ? fp.return_from
                      : undefined,
                  return_to:
                    fp.return_to.length > 0
                      ? fp.return_to
                      : undefined,
                };
                console.log({flightParametersData})

              }
            }

            if (text.length > 0) {
              if (isWsFirst) {
                isWsFirst = false;
                const updatedMessages: Message[] = [
                  ...updatedConversation.messages,
                  {
                    role: 'earth.guide',
                    content: data.formatted_text,
                    id: data.id_answer,
                  },
                ];

                updatedConversation = {
                  ...updatedConversation,
                  messages: updatedMessages,
                };

                setSelectedConversation(updatedConversation);

                if (data.end_of_bubble) {
                  text = '';
                  isWsFirst = true;
                }
              } else {
                const updatedMessages: Message[] =
                  updatedConversation.messages.map(
                    (message, index) => {
                      if (
                        index ===
                        updatedConversation.messages.length - 1
                      ) {
                        return {
                          ...message,
                          content: text,
                          part_id: data.end_of_bubble
                            ? data.part_id
                            : undefined,
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

                if (data.end_of_bubble) {
                  text = '';
                  isWsFirst = true;
                }
              }
            }
            if (data.done) {
              setMessageIsStreaming(false);
              setMapData(convertedMapData);
              setFlightParams(flightParametersData)
            }
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
            city_of_user: ipData?.city || '',
            gps: ipData?.gps || '',
            country: ipData?.country || '',
            state: ipData?.state || '',
            type_of_device: deviceType,
            new_session: newSession,
            specific_airlines: specificAirlines,
          })
        );

        setNewSession(false);
      };

      ws.onclose = (e) => {
        console.log(e);
        console.log('WebSocket closed');
      };
    }
  };

  const handleRateAnswer = (message: IRateAnswer) => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_EG_WSS_URL ?? ''
    );
    ws.onopen = () => {
      ws.send(JSON.stringify(message));
      ws.close();
    };
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

  const handleDisplayGallery = (
    imgSrcs: string[],
    curIndex: number
  ) => {
    setShowModal(true);
    setGalleryItems(imgSrcs);
    setGalleryIndex(curIndex);
  };

  const handleAnotherPromptClick = (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => {
    if (
      typeOfPrompt === TypeOfPrompt.CLICK_ON_LOCATION ||
      typeOfPrompt === TypeOfPrompt.CLICK_ON_PRICE
    ) {
      setPanelDataLoading(true);
      setPanelData(null);
    }

    if (selectedConversation) {
      const ws = new WebSocket(
        process.env.NEXT_PUBLIC_EG_WSS_URL ?? ''
      );
      ws.onopen = () => {
        let text = '';
        ws.onmessage = (event) => {
          const json = event.data;
          if (isValidJSON(json)) {
            const data: EarthGuideQuestionResponse = JSON.parse(json);
            // console.log("valid json", data);

            if (
              data.where_to_display ===
                WhereToDisplay.PANEL_DESTINATION ||
              data.where_to_display === WhereToDisplay.PANEL_FLIGHTS
            ) {
              text += data.formatted_text;
              setPanelData({
                content: text,
                type: data.where_to_display,
                id: +data.id_answer,
              });
              setShowPanelData(true);
              setShowMobilePanelData(true);
            } else {
              let updatedConversation: Conversation;

              updatedConversation = {
                ...selectedConversation,
              };
            }

            if (data.done) {
              setPanelDataLoading(false);
            }
          }
        };

        ws.send(
          JSON.stringify({
            type_of_prompt: typeOfPrompt,
            text: `${id}`,
            user_identification: machineId,
            language_of_browser: language,
            city_of_user: ipData?.city || '',
            gps: ipData?.gps || '',
            country: ipData?.country || '',
            state: ipData?.state || '',
            type_of_device: deviceType,
          })
        );
      };
      ws.onclose = (e) => {
        console.log(e);
        console.log('WebSocket closed');
      };
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setLightMode(theme as 'dark' | 'light');
    }

    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const conversationHistory = localStorage.getItem(
      'conversationHistory'
    );
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] = JSON.parse(
        conversationHistory
      );
      const cleanedConversationHistory = cleanConversationHistory(
        parsedConversationHistory
      );
      setConversations(cleanedConversationHistory);
    }

    const selectedConversation = localStorage.getItem(
      'selectedConversation'
    );
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation = JSON.parse(
        selectedConversation
      );
      const cleanedSelectedConversation = cleanSelectedConversation(
        parsedSelectedConversation
      );
      setSelectedConversation(cleanedSelectedConversation);
    } else {
      setSelectedConversation({
        id: 1,
        name: 'New conversation',
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT,
      });
    }
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
        country: data.country.name,
        state: data.state.name,
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showModal && (
        <div
          id="defaultModal"
          tabIndex={-1}
          aria-hidden="true"
          className={`fixed top-0 left-0 right-0 bottom-0 z-40 ${
            showModal ? '' : 'hidden'
          } w-full h-full p-0 lg:p-4 overflow-x-hidden overflow-y-hidden lg:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#4d4d4d]`}
        >
          <div className="relative w-full h-full max-h-full">
            <div className="relative h-full bg-black lg:rounded-lg shadow dark:bg-gray-700">
              <div className="absolute right-0 z-50">
                <div className="flex justify-end p-2">
                  <button
                    type="button"
                    className="text-[var(--primary-text)] flex justify-center align-center h-[40px] w-[40px] rounded-full bg-white/30 lg:bg-black/70 hover:bg-white/20 text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-[var(--primary-text)]"
                    onClick={() => setShowModal(false)}
                  >
                    x<span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>
              <div className="p-0 lg:p-6 space-y-6 w-full h-full">
                {galleryItems.length > 0 && (
                  <div className="w-full h-full flex">
                    <Gallery
                      galleryItems={galleryItems}
                      curIndex={galleryIndex}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedConversation && (
        <>
          <div
            className={`hidden lg:flex flex-col h-screen w-100 text-[var(--primary-text)] ${lightMode}`}
          >
            <div className="h-full w-100 p-2">
              <div className="flex h-full bg-[#FAFAFA] pl-6 pt-10 rounded-md">
                <LeftSidebar
                  lightMode="light"
                  logoPath={airlineData.logo}
                />

                <Chat
                  conversation={selectedConversation}
                  messageIsStreaming={messageIsStreaming}
                  mapData={mapData}
                  flightParameters={flightParams}
                  messageError={messageError}
                  loading={loading}
                  lightMode={lightMode}
                  logoPath={airlineData.logo}
                  starterMessage={airlineData.starterMessage}
                  onSend={handleSend}
                  onRateAnswer={handleRateAnswer}
                  onUpdateConversation={handleUpdateConversation}
                  onAnotherPromptClick={handleAnotherPromptClick}
                  onDisplayGallery={handleDisplayGallery}
                  isMobile={false}
                />
                {showPanelData && (
                  <>
                    <RightSidebar
                      loading={panelDataLoading}
                      showSample={
                        selectedConversation.messages.length === 0
                      }
                      data={panelData}
                      lightMode="light"
                      onAnotherPromptClick={handleAnotherPromptClick}
                      onSend={handleSend}
                      onDisplayGallery={handleDisplayGallery}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className={`flex lg:hidden flex-col justify-start h-screen w-full text-[var(--primary-text)] ${lightMode}`}
          >
            <div className="h-full w-100">
              <div className="flex flex-col h-screen lg:h-full bg-[#FAFAFA] rounded-md">
                <Chat
                  conversation={selectedConversation}
                  messageIsStreaming={messageIsStreaming}
                  mapData={mapData}
                  flightParameters={flightParams}
                  messageError={messageError}
                  loading={loading}
                  lightMode={lightMode}
                  logoPath={airlineData.logo}
                  starterMessage={airlineData.starterMessage}
                  onSend={handleSend}
                  onRateAnswer={handleRateAnswer}
                  onUpdateConversation={handleUpdateConversation}
                  onAnotherPromptClick={handleAnotherPromptClick}
                  onDisplayGallery={handleDisplayGallery}
                  isMobile={true}
                />
                {showMobilePanelData && (
                  <div
                    id="defaultModal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className={`fixed top-0 left-0 right-0 bottom-0 z-20 ${
                      showMobilePanelData ? '' : 'hidden'
                    } w-full h-full p-0 lg:p-4 overflow-x-hidden overflow-y-hidden lg:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#4d4d4d]`}
                  >
                    <div className="relative w-full h-full max-h-full">
                      <div className="relative h-full bg-black lg:rounded-lg shadow dark:bg-gray-700">
                        <div className="absolute right-0 z-30">
                          <div className="flex justify-end p-2">
                            <button
                              type="button"
                              className="text-[var(--secondary-text)] flex justify-center align-center h-[40px] w-[40px] rounded-full bg-black/30 text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-[var(--primary-text)]"
                              onClick={() =>
                                setShowMobilePanelData(false)
                              }
                            >
                              x
                              <span className="sr-only">
                                Close modal
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="p-0 lg:p-6 space-y-6 w-full h-full">
                          <div className="w-full h-full flex">
                            <RightSidebarMobile
                              loading={panelDataLoading}
                              data={panelData}
                              lightMode="light"
                              onAnotherPromptClick={
                                handleAnotherPromptClick
                              }
                              onSend={(
                                message: Message,
                                isResend: boolean
                              ) => {
                                setShowMobilePanelData(false);
                                handleSend(message, isResend);
                              }}
                              onDisplayGallery={handleDisplayGallery}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
