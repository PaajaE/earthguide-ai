import { jsonrepair } from 'jsonrepair';
import removeMarkdown from 'markdown-to-text';
import { Chat } from '@/components/EG_Chat/Chat';
import {
  Conversation,
  DeviceTypes,
  EarthGuideQuestionResponse,
  FLIGHT_TYPES,
  IFlightParamsConverted,
  IFlightParamsObtained,
  IMapDataConverted,
  IMapDataObtained,
  IRateAnswer,
  IpData,
  KeyValuePair,
  Message,
  OpenAIModelID,
  OpenAIModels,
  PanelData,
  TranslateRequestBody,
  TranslateResponseBody,
  TypeOfMessage,
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
import { formatDateToYYYYMMDD } from '@/utils/app/flight';
import { Button } from './Shared/Button';

interface IHandleSendParams {
  message: Message;
  flightParams?: IFlightParamsObtained;
}

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
  const [language, setLanguage] = useState<string | undefined>(
    undefined
  );
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
  const [texts, setTexts] = useState<TranslateResponseBody<string>>();
  const [shouldScrollToBottom, setShouldScrollToBottom] =
    useState<boolean>(false);
  const [handleSendParams, setHandleSendParams] = useState<
    IHandleSendParams | undefined
  >(undefined);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(true);

  // Close sidebar when a conversation is selected/created on mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  const handleFlightParamsSubmit = (
    data: IFlightParamsConverted,
    messageId: string,
    prevParams: IFlightParamsConverted
  ) => {
    console.log({ data });
    const fp = {
      date_from: formatDateToYYYYMMDD(data.date_from),
      date_to: formatDateToYYYYMMDD(data.date_to),
      departure_airport:
        data.departure_airport ?? prevParams.departure_airport,
      fly_from_lat:
        (data.fly_from_lat
          ? data.fly_from_lat.toString()
          : prevParams?.fly_from_lat
          ? prevParams?.fly_from_lat.toString()
          : ipData?.gps.split(',')[0]) ?? undefined,
      fly_from_lon:
        (data.fly_from_lon
          ? data.fly_from_lon.toString()
          : prevParams?.fly_from_lon
          ? prevParams?.fly_from_lon.toString()
          : ipData?.gps.split(',')[1]) ?? undefined,
      fly_from_radius: data.fly_from_radius.toString() ?? undefined,
      nights_in_dst_from:
        data.flight_type === FLIGHT_TYPES.ROUNDTRIP &&
        data.nights_in_dst_from
          ? data.nights_in_dst_from
          : undefined,
      nights_in_dst_to:
        data.flight_type === FLIGHT_TYPES.ROUNDTRIP &&
        data.nights_in_dst_to
          ? data.nights_in_dst_to
          : undefined,
      return_from:
        data.flight_type === FLIGHT_TYPES.ROUNDTRIP
          ? formatDateToYYYYMMDD(data.return_from)
          : undefined,
      return_to:
        data.flight_type === FLIGHT_TYPES.ROUNDTRIP
          ? formatDateToYYYYMMDD(data.return_to)
          : undefined,
      flight_type: data.flight_type,
      curr: data.curr ?? undefined,
    };

    console.log({ flightType: fp.flight_type });

    console.log({ inFp: prevParams });
    console.log({ outFp: fp });

    handleSend(
      {
        role: 'user',
        content: 'Please change flight preferences',
        id: messageId,
        typeOfMessage: TypeOfMessage.TEXT,
        typeOfPrompt: TypeOfPrompt.FT_BODY,
      },
      fp
    );
  };

  const sendWithRetry = (message: Message) => {
    if (ipData?.gps) {
      handleSend(message);
    } else {
      setTimeout(() => {
        console.log('waiting for ipData with GPS');
        if (ipData?.gps) {
          handleSend(message);
        } else {
          setTimeout(() => {
            handleSend(message);
          }, 3000);
        }
      }, 1000);
    }
  };

  const handleSend = async (
    message: Message,
    flightParams?: IFlightParamsObtained
  ) => {
    console.log({ handleSendParams });
    if (selectedConversation) {
      setShouldScrollToBottom(true);
      setMessageIsStreaming(true);
      setHandleSendParams({ message, flightParams });
      let updatedConversation: Conversation;

      if (!flightParams) {
        updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, message],
        };
        setSelectedConversation(updatedConversation);
      } else {
        updatedConversation = {
          ...selectedConversation,
        };
      }

      const lastMessage = message;

      const callWS = () => {
        const ws = new WebSocket(
          process.env.NEXT_PUBLIC_EG_WSS_URL ?? ''
        );
        ws.onopen = () => {
          let text = '';
          let isWsFirst = true;
          let convertedMapData: IMapDataConverted[];
          let flightParametersData: IFlightParamsConverted;
          ws.onmessage = (event) => {
            const json = event.data;
            if (isValidJSON(json)) {
              let data: EarthGuideQuestionResponse = JSON.parse(json);
              text += data.formatted_text;

              if (data.additional_data) {
                const replacedString = data.additional_data
                  .replaceAll('"', '\\"')
                  .replaceAll("'", '"')
                  .replaceAll('\\"', "'");
                const fixedData = jsonrepair(replacedString);
                if (
                  data.json_type === 'all_other_types_all_locations'
                ) {
                  const mapDataObtained: IMapDataObtained[] =
                    JSON.parse(fixedData);
                  convertedMapData = mapDataObtained.map(
                    (mapLocation) => {
                      const { id, gps, location, photos, price } =
                        mapLocation;
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

                  const updatedMessages: Message[] = [
                    ...updatedConversation.messages,
                    {
                      role: 'earth.guide',
                      content: '',
                      typeOfMessage: TypeOfMessage.MAP,
                      id: data.id_answer,
                      mapData: convertedMapData,
                    },
                  ];

                  updatedConversation = {
                    ...updatedConversation,
                    messages: updatedMessages,
                  };

                  setSelectedConversation(updatedConversation);
                  isWsFirst = true;
                } else if (data.json_type === 'Flight_parameters') {
                  console.log({ fixedData });
                  const fp: IFlightParamsObtained =
                    JSON.parse(fixedData);
                  console.log({ fp });
                  flightParametersData = {
                    comment: data.comment,
                    curr: fp.curr ?? '',
                    date_from:
                      fp.date_from && fp.date_from.length > 0
                        ? new Date(fp.date_from)
                        : undefined,
                    date_to:
                      fp.date_to && fp.date_to.length > 0
                        ? new Date(fp.date_to)
                        : undefined,
                    departure_airport: fp.departure_airport,
                    flight_type:
                      fp.flight_type ?? FLIGHT_TYPES.ROUNDTRIP,
                    fly_from_lat:
                      fp.fly_from_lat && fp.fly_from_lat.length > 0
                        ? +fp.fly_from_lat
                        : undefined,
                    fly_from_lon:
                      fp.fly_from_lon && fp.fly_from_lon.length > 0
                        ? +fp.fly_from_lon
                        : undefined,
                    fly_from_radius: +(fp.fly_from_radius ?? 0),
                    nights_in_dst_from:
                      fp.nights_in_dst_from &&
                      typeof +fp.nights_in_dst_from === 'number'
                        ? fp.nights_in_dst_from
                        : undefined,
                    nights_in_dst_to:
                      fp.nights_in_dst_to &&
                      typeof +fp.nights_in_dst_to === 'number'
                        ? fp.nights_in_dst_to
                        : undefined,
                    return_from:
                      fp.return_from && fp.return_from.length > 0
                        ? new Date(fp.return_from)
                        : undefined,
                    return_to:
                      fp.return_to && fp.return_to.length > 0
                        ? new Date(fp.return_to)
                        : undefined,
                  };
                  console.log({ flightParametersData });

                  const updatedMessages: Message[] = [
                    ...updatedConversation.messages,
                    {
                      role: 'earth.guide',
                      content: '',
                      typeOfMessage: TypeOfMessage.FLIGHT_PARAMS,
                      id: data.id_answer,
                      flightParams: flightParametersData,
                    },
                  ];

                  updatedConversation = {
                    ...updatedConversation,
                    messages: updatedMessages,
                  };

                  setSelectedConversation(updatedConversation);
                  isWsFirst = true;
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
                      typeOfMessage: TypeOfMessage.TEXT,
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
              }
            }
          };

          if (!ipData?.gps) {
            alert('no GPS retrieved');
          } else {
            console.log({ gpsIs: ipData.gps });
          }

          ws.onerror = (err) => {
            console.log(err);
            throw err;
          };

          ws.send(
            JSON.stringify({
              type_of_prompt:
                lastMessage.typeOfPrompt || TypeOfPrompt.TEXT_PROMPT,
              text:
                lastMessage.typeOfPrompt ===
                  TypeOfPrompt.TEXT_PROMPT ||
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
              flight_params: flightParams ? flightParams : undefined,
            })
          );

          setNewSession(false);
        };

        ws.onclose = (e) => {
          console.log(e);
          console.log('WebSocket closed');
        };
      };

      try {
        callWS();
      } catch (err) {
        console.log(err);
        setMessageIsStreaming(false);
        setShowErrorModal(true);
      }
    }
  };

  const handleSendAgain = () => {
    console.log('should handle send again');
    if (handleSendParams?.message) {
      setShowErrorModal(false);
      handleSend(
        handleSendParams.message,
        handleSendParams.flightParams
      );
      setHandleSendParams(undefined);
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
    const language = getLanguage();
    setLanguage(language);

    const machId = getMachineId();
    setMachineId(machId);

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

  const fetchTranslation = async (
    requestData: TranslateRequestBody
  ) => {
    try {
      const response = await fetch('/api/eg-translate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        const data = await response.json();
        setTexts(data);
        console.log({ texts: data });
      } else {
        console.error(
          'Error fetching translation:',
          response.statusText
        );
        console.log('Error fetching translation');
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      console.log('Error fetching translation');
    }
  };

  useEffect(() => {
    if (language) {
      fetchTranslation({
        language_of_browser: language,
        specific_airlines: specificAirlines,
      });
    }
  }, [language, specificAirlines]);

  useEffect(() => {
    const ipData = fetchIpData();
    if (!ipData) {
      alert('no ip data');
    } else {
      ipData.then((data) => {
        console.log(data);
        setIpData({
          city: data.city,
          ip: data.ip,
          gps: `${data.latitude},${data.longitude}`,
          country: data.country_name,
          state: data.region,
        });
      });

      const deviceType = getDeviceType();
      setDeviceType(deviceType);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{airlineData.title}</title>
      </Head>
      {texts && (
        <>
          {showModal && (
            <div
              id="defaultModal"
              tabIndex={-1}
              aria-hidden="true"
              className={`fixed top-0 left-0 right-0 bottom-0 z-40 ${
                showModal ? '' : 'hidden'
              } w-full p-0 lg:p-4 overflow-x-hidden overflow-y-hidden lg:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#4d4d4d]`}
            >
              <div className="relative w-full h-full max-h-full">
                <div className="relative h-full bg-black lg:rounded-lg shadow dark:bg-gray-700">
                  <div className="absolute right-0 z-50">
                    <div className="flex justify-end p-2">
                      <button
                        type="button"
                        className="text-[var(--primary-text)] justify-center align-center h-[40px] w-[40px] rounded-full bg-white/30 lg:bg-black/70 hover:bg-white/20 text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-[var(--primary-text)]"
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
          {showErrorModal && (
            <div
              id="errorModal"
              tabIndex={-1}
              aria-hidden="true"
              className={`fixed top-0 left-0 right-0 bottom-0 z-40 ${
                showErrorModal ? '' : 'hidden'
              } w-full p-0 lg:px-[30vw] py-[30vh] overflow-x-hidden overflow-y-hidden lg:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#4d4d4dcf]`}
            >
              <div className="relative w-full h-full max-h-full">
                <div className="relative h-full bg-white lg:rounded-lg shadow ">
                  <div className="absolute right-0 z-50">
                    <div className="flex justify-end p-2">
                      <button
                        type="button"
                        className="text-[var(--primary-text)] justify-center align-center h-[40px] w-[40px] rounded-full bg-white/30 lg:bg-black/70 hover:bg-white/20 text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 hover:text-[var(--primary)]"
                        onClick={() => setShowErrorModal(false)}
                      >
                        x<span className="sr-only">Close modal</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-0 lg:p-6 space-y-6 w-full h-full">
                    <div className="w-full h-full flex flex-col justify-center">
                      <h2 className="text-center">
                        Došlo k chybě při generování odpovědi. Zkuste
                        prosím odeslat znovu
                      </h2>
                      <div className="mx-[30%] mt-10">
                        <Button
                          text={'Odeslat znovu'}
                          iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
                          bgColor="var(--tertiary)"
                          onClick={() => {
                            handleSendAgain();
                          }}
                        />
                      </div>
                    </div>
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
                      messageError={messageError}
                      loading={loading}
                      lightMode={lightMode}
                      logoPath={airlineData.logo}
                      starterMessage={airlineData.starterMessage}
                      texts={texts}
                      shouldScrollToBottom={shouldScrollToBottom}
                      onSend={sendWithRetry}
                      onRateAnswer={handleRateAnswer}
                      onUpdateConversation={handleUpdateConversation}
                      onAnotherPromptClick={handleAnotherPromptClick}
                      onDisplayGallery={handleDisplayGallery}
                      isMobile={false}
                      onFormSubmit={handleFlightParamsSubmit}
                      onDisallowScrollToBottom={() => {
                        setShouldScrollToBottom(false);
                      }}
                    />
                    {showPanelData && (
                      <>
                        <RightSidebar
                          loading={panelDataLoading}
                          showSample={
                            selectedConversation.messages.length === 0
                          }
                          data={panelData}
                          texts={texts}
                          lightMode="light"
                          onAnotherPromptClick={
                            handleAnotherPromptClick
                          }
                          onSend={sendWithRetry}
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
                      messageError={messageError}
                      loading={loading}
                      lightMode={lightMode}
                      logoPath={airlineData.logo}
                      starterMessage={airlineData.starterMessage}
                      texts={texts}
                      shouldScrollToBottom={shouldScrollToBottom}
                      onSend={sendWithRetry}
                      onRateAnswer={handleRateAnswer}
                      onUpdateConversation={handleUpdateConversation}
                      onAnotherPromptClick={handleAnotherPromptClick}
                      onDisplayGallery={handleDisplayGallery}
                      isMobile={true}
                      onFormSubmit={handleFlightParamsSubmit}
                      onDisallowScrollToBottom={() => {
                        setShouldScrollToBottom(false);
                      }}
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
                                  onSend={(message: Message) => {
                                    setShowMobilePanelData(false);
                                    sendWithRetry(message);
                                  }}
                                  onDisplayGallery={
                                    handleDisplayGallery
                                  }
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
      )}
    </>
  );
}
