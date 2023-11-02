import { usePathname } from 'next/navigation';
import {
  Conversation,
  IFlightParamsConverted,
  IRateAnswer,
  KeyValuePair,
  Message,
  TranslateResponseBody,
  TypeOfMessage,
  TypeOfPrompt,
} from '@/types';
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { LeftSidebar } from './LeftSidebar';
import { FlightForm } from './FlightForm';
import { Collapse, Tile } from '@kiwicom/orbit-components';
import { ChatLoader } from './ChatLoader';
import { v4 } from 'uuid';

interface Props {
  conversation: Conversation;
  messageIsStreaming: boolean;
  messageError: boolean;
  lightMode: 'light' | 'dark';
  isMobile: boolean;
  logoPath: string;
  starterMessage: string;
  texts: TranslateResponseBody<string>;
  shouldScrollToBottom: boolean;
  promptPlaceholder: string;
  fullWidthMessage?: boolean;
  showShadows?: boolean;
  withPadding?: boolean;
  onSend: (message: Message) => void;
  onRateAnswer: (feedback: IRateAnswer) => void;
  onAnotherPromptClick: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onDisplayGallery: (imgSrcs: string[], curIndex: number) => void;
  onDisallowScrollToBottom: () => void;
}

function ChatFunction({
  conversation,
  messageIsStreaming,
  messageError,
  lightMode,
  isMobile,
  logoPath,
  starterMessage,
  texts,
  shouldScrollToBottom,
  fullWidthMessage = false,
  showShadows = false,
  withPadding = false,
  promptPlaceholder,
  onSend,
  onRateAnswer,
  onAnotherPromptClick,
  onDisplayGallery,
  onDisallowScrollToBottom,
}: Props): JSX.Element {
  const path = usePathname()?.substring(1);

  const [expanded, setExpanded] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      onDisallowScrollToBottom();
    }
  }, [
    shouldScrollToBottom,
    scrollToBottom,
    onDisallowScrollToBottom,
  ]);

  return (
    <div className="relative flex flex-col justify-between w-auto lg:w-1/2 h-full lg:h-auto lg:min-h-[calc(100vh_-_100px)] max-w-full bg-transparent">
      <>
        <div>
          <div
            className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_8rem)] lg:max-h-[calc(100vh_-_12rem)] p-4 lg:py-0 lg:px-4"
            ref={chatContainerRef}
          >
            {isMobile && (
              <LeftSidebar lightMode="light" logoPath={logoPath} />
            )}

            <div
              className={`flex flex-row justify-start items-start gap-2.5 py-4 px-8 ${
                fullWidthMessage ? 'max-w-full' : 'max-w-[85%]'
              } ${
                showShadows ? 'shadow-lg' : ''
              } box-border bg-[var(--secondary)] rounded-t-lg rounded-r-lg mb-5`}
            >
              <div
                className={`border-[#000000ff] leading-6 flex flex-col w-full  font-plus jakarta sans  font-[400] text-[var(--tertiary-text)]`}
              >
                <div>{texts.intro.translation ?? starterMessage}</div>
                <div className="mt-4 text-[var(--primary)] font-medium cursor-pointer">
                  <Collapse
                    label="Show examples"
                    expanded={expanded}
                    onClick={() => setExpanded(!expanded)}
                  >
                    <div className="flex flex-col gap-4 font-normal">
                      <Tile
                        noHeaderIcon
                        onClick={() => {
                          onSend({
                            role: 'user',
                            typeOfMessage: TypeOfMessage.TEXT,
                            content: texts.example1.translation,
                          });
                          setTimeout(() => {
                            setExpanded(false);
                          }, 1000);
                        }}
                        title={texts.example1.translation}
                      />
                      <Tile
                        noHeaderIcon
                        onClick={() => {
                          onSend({
                            role: 'user',
                            typeOfMessage: TypeOfMessage.TEXT,
                            content: texts.example2.translation,
                          });
                          setTimeout(() => {
                            setExpanded(false);
                          }, 1000);
                        }}
                        title={texts.example2.translation}
                      />
                      <Tile
                        noHeaderIcon
                        onClick={() => {
                          onSend({
                            role: 'user',
                            typeOfMessage: TypeOfMessage.TEXT,
                            content: texts.example3.translation,
                          });
                          setTimeout(() => {
                            setExpanded(false);
                          }, 1000);
                        }}
                        title={texts.example3.translation}
                      />
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden flex-col mt-6">
              <h2 className="text-[var(--tertiary-text)] font-bold mb-4">
                {texts.examples
                  ? `${texts.examples.translation}`
                  : 'Examples'}
              </h2>
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content: `${
                    texts.example1.translation ??
                    'Affordable beach destinations in Europe. We want to fly in October. For 7 days.'
                  }`,
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({
                    role: 'user',
                    typeOfMessage: TypeOfMessage.TEXT,
                    content,
                  });
                }}
              />
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content: `${
                    texts.example2.translation ??
                    'Flight to UNESCO site. City break for 4 days, November, warm weather'
                  }`,
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({
                    role: 'user',
                    typeOfMessage: TypeOfMessage.TEXT,
                    content,
                  });
                }}
              />
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content: `${
                    texts.example3.translation ??
                    'Flight next weekend to destination with good weather and hiking trails with elevation at least 1000 m.'
                  }`,
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({
                    role: 'user',
                    typeOfMessage: TypeOfMessage.TEXT,
                    content,
                  });
                }}
              />
            </div>

            {conversation.messages.length === 0 ? (
              <></>
            ) : (
              <>
                {conversation.messages.map((message, index) => (
                  <ChatMessage
                    key={v4()}
                    message={message}
                    lightMode={lightMode}
                    texts={texts}
                    onAnotherPromptClick={onAnotherPromptClick}
                    messageIsStreaming={
                      messageIsStreaming &&
                      index === conversation.messages.length - 1
                    }
                    streamingFinished={
                      !messageIsStreaming &&
                      index === conversation.messages.length - 1
                    }
                    pathExists={!!path}
                    fullWidthMessage={fullWidthMessage}
                    showShadows={showShadows}
                    withPadding={withPadding}
                    onSend={(message) => {
                      onSend(message);
                    }}
                    onRateAnswer={onRateAnswer}
                    onDisplayGallery={onDisplayGallery}
                  />
                ))}

                {messageIsStreaming && <ChatLoader />}

                <div
                  className="bg-transparent h-[15vh]"
                  ref={messagesEndRef}
                />
              </>
            )}
          </div>
        </div>
        {messageError ? (
          <></>
        ) : (
          <ChatInput
            messageIsStreaming={messageIsStreaming}
            onSend={(message) => {
              onSend(message);
            }}
            isMobile={isMobile}
            textareaRef={textareaRef}
            texts={texts}
            model={conversation.model}
            promptPlaceholder={promptPlaceholder}
            showShadows={showShadows}
          />
        )}
      </>
    </div>
  );
}

export default memo(ChatFunction);
