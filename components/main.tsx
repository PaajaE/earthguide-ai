import { jsonrepair } from 'jsonrepair';
import removeMarkdown from 'markdown-to-text';
import Chat from '@/components/EG_Chat/Chat';
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
import { useCallback, useEffect, useState } from 'react';
import { RightSidebar } from '@/components/EG_Chat/RightSidebar';
import { LeftSidebar } from '@/components/EG_Chat/LeftSidebar';
import {
  isValidJSON,
  extractSrcAttributesFromHTML,
  extractGpsCoordinates,
} from '@/utils/app/misc';
import { Gallery } from '@/components/EG_Chat/Gallery';
import { IAirlineDataItem } from '@/utils/data/airlines';
import { formatDateToYYYYMMDD } from '@/utils/app/flight';
import { Button } from './Shared/Button';

interface IHandleSendParams {
  message: Message;
  flightParams: IFlightParamsConverted;
}

const today = new Date();

// Tomorrow's date
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 7);

// Date one month later
const oneMonthLater = new Date(today);
oneMonthLater.setMonth(tomorrow.getMonth() + 1);

const initFpData: IFlightParamsConverted = {
  curr: '',
  departure_airport: '',
  flight_type: FLIGHT_TYPES.ROUNDTRIP,
  fly_from_radius: 250,
  nights_in_dst_from: 7,
  nights_in_dst_to: 10,
  date_from: tomorrow,
  return_to: oneMonthLater,
};

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
  const [showPanelData, setShowPanelData] = useState<boolean>(false);
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
  const [showErrorModal, setShowErrorModal] =
    useState<boolean>(false);
  const [fpData, setFpData] =
    useState<IFlightParamsConverted>(initFpData);
  const [defaultFpData, setDefaultFpData] = useState<boolean>(true);
  const [promptPlaceholder, setPromptPlaceholder] =
    useState<string>('prompt');
  const [isMobileDevice, setIsMobileDevice] =
    useState<boolean>(false);

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined'
        ? ''
        : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  // const searchParams = useSearchParams();

  // const showShadows: boolean =
  //   searchParams.get('shadows') === 'true' ? true : false;
  // const fullWidthMessage: boolean =
  //   searchParams.get('full-width') === 'true' ? true : false;
  // const withPadding: boolean =
  //   searchParams.get('gallery-padding') === 'true' ? true : false;

  const showShadows: boolean = true;
  const fullWidthMessage: boolean = false;
  const withPadding: boolean = false;

  // Close sidebar when a conversation is selected/created on mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const isMobileDevice = isMobile();
    setIsMobileDevice(isMobileDevice);
  }, []);

  const handleFlightParamsSubmit = (
    flightParams: IFlightParamsConverted,
    defaultFpData: boolean
  ) => {
    const lastMessageId =
      selectedConversation?.messages[
        selectedConversation.messages.length - 1
      ]?.id ?? undefined;
    if (lastMessageId) {
      handleSend(
        {
          role: 'user',
          content: 'Please change flight preferences',
          id: lastMessageId,
          typeOfMessage: TypeOfMessage.TEXT,
          typeOfPrompt: TypeOfPrompt.FT_BODY,
        },
        flightParams,
        defaultFpData
      );
    }
  };

  const handleChangeFlightParams = (
    newFpData: Partial<IFlightParamsConverted>
  ) => {
    console.log(newFpData);
    setFpData((prevData) => {
      return {
        ...prevData,
        ...newFpData,
      };
    });
    setDefaultFpData(false);
  };

  const convertFpForSend = useCallback(
    (data: IFlightParamsConverted): IFlightParamsObtained => {
      console.log({ data });
      const fp = {
        date_from: formatDateToYYYYMMDD(data.date_from),
        date_to: formatDateToYYYYMMDD(data.date_to),
        departure_airport: data.departure_airport,
        fly_from_lat:
          (data.fly_from_lat
            ? data.fly_from_lat.toString()
            : ipData?.gps.split(',')[0]) ?? undefined,
        fly_from_lon:
          (data.fly_from_lon
            ? data.fly_from_lon.toString()
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

      console.log({ outFp: fp });

      return fp;
    },
    [ipData?.gps]
  );

  const getEmptyMessage = (fpDefault: boolean): string => {
    return fpDefault
      ? texts?.answer_button1.translation ?? ''
      : texts?.change_FP.translation ?? '';
  };

  const handleSend = useCallback(
    async (
      messageIncoming: Message,
      newFpData?: IFlightParamsConverted,
      fpDataDefault?: boolean
    ) => {
      if (selectedConversation) {
        let message: Message;
        if (messageIncoming.content.length === 0) {
          message = {
            ...messageIncoming,
            content: getEmptyMessage(
              fpDataDefault !== undefined
                ? fpDataDefault
                : defaultFpData
            ),
          };
        } else {
          message = messageIncoming;
        }
        const flightParamsData = newFpData
          ? newFpData
          : fpData
          ? fpData
          : initFpData;
        console.log({ flightParamsData });
        const flightParams = convertFpForSend(flightParamsData);
        setShouldScrollToBottom(true);
        setMessageIsStreaming(true);
        setHandleSendParams({
          message,
          flightParams: flightParamsData,
        });
        let updatedConversation: Conversation;

        updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, message],
        };
        setSelectedConversation(updatedConversation);

        const lastMessage = messageIncoming;

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
                let data: EarthGuideQuestionResponse =
                  JSON.parse(json);
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
                        const {
                          id,
                          gps,
                          location,
                          photos,
                          price,
                          flightUrl,
                        } = mapLocation;
                        const locationString =
                          removeMarkdown(location);
                        const photosArr =
                          extractSrcAttributesFromHTML(photos);
                        const gpsObject = extractGpsCoordinates(gps);

                        console.log({ gpsObject });

                        return {
                          id,
                          gps: gpsObject,
                          photos: photosArr,
                          locationTitle: locationString,
                          price,
                          flightUrl,
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

                    setFpData((prevData) => {
                      return {
                        ...prevData,
                        ...flightParametersData,
                      };
                    });
                    setDefaultFpData(true);

                    const updatedMessages: Message[] = [
                      ...updatedConversation.messages,
                      {
                        role: 'earth.guide',
                        content: '',
                        typeOfMessage: TypeOfMessage.FLIGHT_PARAMS,
                        id: data.id_answer,
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
                              part_id:
                                data.end_of_bubble || data.done
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
                if (data.promt_text) {
                  setPromptPlaceholder(data.promt_text);
                }
                if (data.done) {
                  setMessageIsStreaming(false);
                  setShowPanelData(true);
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
                  lastMessage.typeOfPrompt ||
                  TypeOfPrompt.TEXT_PROMPT,
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
                flight_params: flightParams
                  ? flightParams
                  : undefined,
                flight_params_default:
                  fpDataDefault !== undefined
                    ? fpDataDefault
                    : defaultFpData,
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
    },
    [
      convertFpForSend,
      defaultFpData,
      deviceType,
      fpData,
      ipData?.city,
      ipData?.country,
      ipData?.gps,
      ipData?.state,
      language,
      machineId,
      newSession,
      selectedConversation,
      specificAirlines,
    ]
  );

  const sendWithRetry = useCallback(
    (message: Message) => {
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
    },
    [handleSend, ipData?.gps]
  );

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

  const handleRateAnswer = useCallback((message: IRateAnswer) => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_EG_WSS_URL ?? ''
    );
    ws.onopen = () => {
      ws.send(JSON.stringify(message));
      ws.close();
    };
  }, []);

  const handleDisplayGallery = useCallback(
    (imgSrcs: string[], curIndex: number) => {
      setShowModal(true);
      setGalleryItems(imgSrcs);
      setGalleryIndex(curIndex);
    },
    []
  );

  // const handleDisallowScroll = useCallback(() => {
  //   setShouldScrollToBottom(false);
  // }, []);

  const handleAnotherPromptClick = useCallback(
    (typeOfPrompt: TypeOfPrompt, id: string) => {
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
              const data: EarthGuideQuestionResponse =
                JSON.parse(json);

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
    },
    [
      deviceType,
      ipData?.city,
      ipData?.country,
      ipData?.gps,
      ipData?.state,
      language,
      machineId,
      selectedConversation,
    ]
  );

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
      console.log({language})
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

        setFpData((prevProps) => {
          return {
            ...prevProps,
            fly_from_lat: data.latitude,
            fly_from_lon: data.longitude,
            departure_airport: data.city,
          };
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
              {isMobileDevice ? (
                <div
                  className={`relative flex lg:hidden flex-col justify-start h-full w-full text-black`}
                >
                  <div className="sticky w-full max-h-[72px] px-4 py-2">
                    <div className="w-full h-full flex justify-start items-center">
                      <img
                        src={airlineData.logo}
                        alt="Your travel guide"
                        className="h-[48px] object-center"
                      />
                    </div>
                  </div>
                  <div className="w-full h-full flex">
                    <Chat
                      conversation={selectedConversation}
                      messageIsStreaming={messageIsStreaming}
                      messageError={messageError}
                      lightMode={lightMode}
                      logoPath={airlineData.logo}
                      starterMessage={
                        language === 'cs'
                          ? airlineData?.starterMessageCs ??
                            airlineData.starterMessage
                          : airlineData.starterMessage
                      }
                      texts={texts}
                      shouldScrollToBottom={shouldScrollToBottom}
                      fullWidthMessage={fullWidthMessage}
                      withPadding={withPadding}
                      showShadows={showShadows}
                      promptPlaceholder={promptPlaceholder}
                      onSend={sendWithRetry}
                      onRateAnswer={handleRateAnswer}
                      onAnotherPromptClick={handleAnotherPromptClick}
                      onDisplayGallery={handleDisplayGallery}
                      isMobile={isMobileDevice}
                      onDisallowScrollToBottom={() => {
                        setShouldScrollToBottom(false);
                      }}
                    />
                  </div>
                  {/* <div className="h-full w-full flex justify-center items-center">
                    <p className="w-2/3 text-center">
                      Mobile version is not ready yet. Please, use
                      desktop version.
                    </p>
                  </div> */}
                </div>
              ) : (
                <div
                  className={`hidden lg:flex flex-col h-[var(--window-height)] w-100 text-[var(--primary-text)] ${lightMode}`}
                >
                  <div className="h-full w-full p-4">
                    <div className="flex gap-8 w-full h-full bg-[#FAFAFA] py-4 rounded-md">
                      <LeftSidebar
                        lightMode="light"
                        logoPath={airlineData.logo}
                      />

                      <Chat
                        conversation={selectedConversation}
                        messageIsStreaming={messageIsStreaming}
                        messageError={messageError}
                        lightMode={lightMode}
                        logoPath={airlineData.logo}
                        starterMessage={
                          language === 'cs'
                            ? airlineData?.starterMessageCs ??
                              airlineData.starterMessage
                            : airlineData.starterMessage
                        }
                        texts={texts}
                        shouldScrollToBottom={shouldScrollToBottom}
                        fullWidthMessage={fullWidthMessage}
                        withPadding={withPadding}
                        showShadows={showShadows}
                        promptPlaceholder={promptPlaceholder}
                        onSend={sendWithRetry}
                        onRateAnswer={handleRateAnswer}
                        onAnotherPromptClick={
                          handleAnotherPromptClick
                        }
                        onDisplayGallery={handleDisplayGallery}
                        isMobile={isMobileDevice}
                        onDisallowScrollToBottom={() => {
                          setShouldScrollToBottom(false);
                        }}
                      />
                      {showPanelData && (
                        <>
                          <RightSidebar
                            loading={panelDataLoading}
                            data={panelData}
                            texts={texts}
                            flightParams={fpData}
                            showShadows={showShadows}
                            defaultData={defaultFpData}
                            onSend={sendWithRetry}
                            onFormSubmit={handleFlightParamsSubmit}
                            onChangeFlightParams={
                              handleChangeFlightParams
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
