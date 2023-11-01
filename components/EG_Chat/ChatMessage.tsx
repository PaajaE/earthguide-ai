import {
  FeedbackEnum,
  IFlightParamsConverted,
  IMapDataConverted,
  IRateAnswer,
  Message,
  TranslateResponseBody,
  TypeOfMessage,
  TypeOfPrompt,
} from '@/types';
import { FC, useState } from 'react';
import { Button } from '../Shared/Button';
import { EarthGuideReactMarkdown } from './EarthGuideReactMarkdown';
import { ChatLoader } from './ChatLoader';
import MapboxMap from '../Map/MapboxMap';

interface Props {
  message: Message;
  messageIsStreaming?: boolean;
  streamingFinished?: boolean;
  mapData?: IMapDataConverted[];
  flightParameters?: IFlightParamsConverted;
  lightMode: 'light' | 'dark';
  pathExists?: boolean;
  texts?: TranslateResponseBody<string>;
  fullWidthMessage?: boolean;
  showShadows?: boolean;
  withPadding?: boolean;
  onAnotherPromptClick?: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onSend?: (message: Message) => void;
  onRateAnswer?: (feedback: IRateAnswer) => void;
  onSampleClick?: (content: string) => void;
  onDisplayGallery?: (imgSrcs: string[], curIndex: number) => void;
}

export const ChatMessage: FC<Props> = ({
  message,
  lightMode,
  messageIsStreaming = false,
  streamingFinished = false,
  pathExists = false,
  texts,
  fullWidthMessage = false,
  showShadows = false,
  withPadding = false,
  onSend,
  onRateAnswer,
  onAnotherPromptClick,
  onSampleClick,
  onDisplayGallery,
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState<
    FeedbackEnum | undefined
  >(undefined);

  return (
    <>
      {message.typeOfMessage === TypeOfMessage.TEXT && (
        <>
          {message.role === 'earth.guide' ? (
            <div
              className={`flex flex-row justify-start items-start gap-2.5 px-8 py-8 w-auto bg-[var(--secondary)] rounded-t-lg rounded-r-lg mb-1 ${
                fullWidthMessage ? 'max-w-full' : 'max-w-[80%]'
              } box-border ${showShadows ? 'shadow-lg' : ''}${
                streamingFinished
                  ? "after:content-['✓'] after:absolute after:bottom-1 after:right-2 after:text-slate-200"
                  : ''
              }`}
            >
              <div
                className={`border-[#000000ff] leading-6 flex flex-col w-auto  font-plus jakarta sans  font-[400] text-[var(--secondary-text)]`}
              >
                <>
                  <EarthGuideReactMarkdown
                    content={message.content}
                    lightMode={lightMode}
                    withPadding={withPadding}
                    onAnotherPromptClick={onAnotherPromptClick}
                    onDisplayGallery={
                      onDisplayGallery && onDisplayGallery
                    }
                  />
                </>
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-row justify-start items-start gap-2.5 py-4 px-8 ${
                fullWidthMessage ? 'max-w-full' : 'max-w-[80%]'
              } box-border ${showShadows ? 'shadow-lg' : ''} ${
                message.role === 'user'
                  ? 'w-fit ml-auto bg-[var(--primary)] rounded-t-lg rounded-bl-lg mb-5'
                  : ''
              } ${
                message.role === 'sample'
                  ? 'bg-white rounded-t-lg rounded-r-lg py-3 mb-5'
                  : ''
              }`}
              style={{
                cursor:
                  message.role === 'sample' && onSampleClick
                    ? 'pointer'
                    : 'default',
              }}
              onClick={() => {
                if (message.role === 'sample') {
                  onSampleClick && onSampleClick(message.content);
                }
              }}
            >
              <div
                className={`border-[#000000ff] leading-6 flex flex-col w-auto  font-plus jakarta sans  font-[400] ${
                  message.role === 'sample' &&
                  'text-[var(--tertiary-text)]'
                }`}
              >
                {message.content.length > 0
                  ? message.content
                  : '\u00a0'}
              </div>
            </div>
          )}
          {message.role === 'earth.guide' && (
            <div
              className={`flex gap-1 mb-5 mt-2 justify-end ${
                fullWidthMessage ? 'max-w-full' : 'max-w-[80%]'
              }`}
            >
              {(!selectedFeedback ||
                selectedFeedback === FeedbackEnum.OK) && (
                <button
                  className={`p-1 rounded-md ${
                    selectedFeedback === FeedbackEnum.OK
                      ? 'dark:text-[var(--primary)]'
                      : 'dark:text-gray-400'
                  } ${
                    !selectedFeedback
                      ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-400 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400'
                      : 'cursor-auto'
                  }`}
                  onClick={() => {
                    if (
                      !selectedFeedback &&
                      onRateAnswer &&
                      message.id
                    ) {
                      setSelectedFeedback(FeedbackEnum.OK);
                      onRateAnswer({
                        id_answer: message.id,
                        part_id: message.part_id,
                        feedback: FeedbackEnum.OK,
                      });
                    }
                  }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </button>
              )}
              {(!selectedFeedback ||
                selectedFeedback === FeedbackEnum.NOT_OK) && (
                <button
                  className={`p-1 rounded-md ${
                    selectedFeedback === FeedbackEnum.NOT_OK
                      ? 'dark:text-[var(--primary)]'
                      : 'dark:text-gray-400'
                  } ${
                    !selectedFeedback
                      ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-400 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400'
                      : 'cursor-auto'
                  }`}
                  onClick={() => {
                    if (
                      !selectedFeedback &&
                      onRateAnswer &&
                      message.id
                    ) {
                      setSelectedFeedback(FeedbackEnum.NOT_OK);
                      onRateAnswer({
                        id_answer: message.id,
                        part_id: message.part_id,
                        feedback: FeedbackEnum.NOT_OK,
                      });
                    }
                  }}
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                  </svg>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* {message.role === 'earth.guide' &&
        message.typeOfMessage === TypeOfMessage.FLIGHT_PARAMS &&
        message.flightParams && (
          <div
            className={`flex flex-row justify-start items-start gap-2.5 pb-3 w-100 box-border bg-[var(--secondary)] rounded-t-lg rounded-r-lg lg:mr-8 mb-5`}
          >
            <div
              className={`border-[#000000ff] leading-6 flex flex-col relative w-full font-plus jakarta sans px-4 mt-4 mb-2 font-[400] text-[var(--secondary-text)]`}
            >
              <FlightForm
                flightParameters={message.flightParams}
                messageId={message.id ?? ''}
                texts={texts}
                onFormSubmit={onFormSubmit}
              />
            </div>
          </div>
        )} */}
      {message.role === 'earth.guide' &&
        message.typeOfMessage === TypeOfMessage.MAP &&
        message.mapData && (
          <>
            {message.mapData && message.mapData.length > 0 && (
              <div
                className={`flex flex-row justify-start items-start gap-2.5 mb-5 w-100 box-border rounded-lg ${
                  showShadows ? 'shadow-lg' : ''
                }`}
              >
                <div
                  className={`border-[#000000ff] leading-6 flex flex-col relative w-full h-[50vh] font-plus jakarta sans  font-[400] text-[var(--secondary-text)] rounded-lg`}
                >
                  <MapboxMap mapData={message.mapData} />
                </div>
              </div>
            )}
            <div className="flex flex-col lg:flex-row mt-3 mb-6">
              <Button
                text={
                  texts?.button_1.translation ??
                  'More places like these'
                }
                iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
                bgColor="var(--tertiary)"
                typeOfPrompt={TypeOfPrompt.MORE_PLACES}
                onClick={(typeOfPrompt: TypeOfPrompt) => {
                  onSend &&
                    onSend({
                      role: 'user',
                      typeOfMessage: TypeOfMessage.TEXT,
                      content: `${
                        texts?.answer_button1.translation ??
                        'More places like these'
                      }`,
                      typeOfPrompt,
                      id: message.id ?? '',
                    });
                }}
              />
              {!pathExists && (
                <Button
                  text={
                    texts?.button_2.translation ??
                    'Show me lesser-known places'
                  }
                  iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
                  bgColor="var(--tertiary)"
                  typeOfPrompt={TypeOfPrompt.LESSER_KNOWN}
                  onClick={(typeOfPrompt: TypeOfPrompt) => {
                    onSend &&
                      onSend({
                        role: 'user',
                        typeOfMessage: TypeOfMessage.TEXT,
                        content: `${
                          texts?.answer_button2.translation ??
                          'Show me lesser-known places'
                        }`,
                        typeOfPrompt,
                        id: message.id ?? '',
                      });
                  }}
                />
              )}
            </div>
          </>
        )}
    </>
  );
};
