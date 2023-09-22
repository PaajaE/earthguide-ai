import { usePathname } from 'next/navigation';
import {
  Conversation,
  IFlightParamsConverted,
  IMapDataConverted,
  IRateAnswer,
  KeyValuePair,
  Message,
  TranslateResponseBody,
  TypeOfMessage,
  TypeOfPrompt,
} from '@/types';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { throttle } from '@/utils/data/throttle';
import { LeftSidebar } from './LeftSidebar';

interface Props {
  conversation: Conversation;
  messageIsStreaming: boolean;
  messageError: boolean;
  loading: boolean;
  lightMode: 'light' | 'dark';
  isMobile: boolean;
  logoPath: string;
  starterMessage: string;
  texts?: TranslateResponseBody<string>;
  onSend: (message: Message) => void;
  onRateAnswer: (feedback: IRateAnswer) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair
  ) => void;
  onAnotherPromptClick: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onDisplayGallery: (imgSrcs: string[], curIndex: number) => void;
  onFormSubmit: (
    data: IFlightParamsConverted,
    messageId: string,
    prevParams: IFlightParamsConverted
  ) => void;
}

export const Chat: FC<Props> = ({
  conversation,
  messageIsStreaming,
  messageError,
  loading,
  lightMode,
  isMobile,
  logoPath,
  starterMessage,
  texts,
  onSend,
  onRateAnswer,
  onAnotherPromptClick,
  onDisplayGallery,
  onFormSubmit,
}) => {
  const path = usePathname()?.substring(1);

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] =
    useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
      } else {
        setAutoScrollEnabled(true);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  // useEffect(() => {
  //   console.log('currentMessage', currentMessage);
  //   if (currentMessage) {
  //     handleSend(currentMessage);
  //     homeDispatch({ field: 'currentMessage', value: undefined });
  //   }
  // }, [currentMessage]);

  useEffect(() => {
    throttledScrollDown();
    conversation &&
      setCurrentMessage(
        conversation.messages[conversation.messages.length - 2]
      );
  }, [conversation, throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  return (
    <div className="relative flex flex-col justify-between w-auto h-full lg:h-auto lg:min-h-[calc(100vh_-_100px)] max-w-full lg:max-w-[60%] bg-[#FAFAFA]">
      <>
        <div
          className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_8rem)] lg:max-h-[calc(100vh_-_10rem)] p-4 lg:py-0 lg:px-4"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {isMobile && (
            <LeftSidebar lightMode="light" logoPath={logoPath} />
          )}
          <ChatMessage
            key="starter-message"
            message={{
              role: 'starter',
              typeOfMessage: TypeOfMessage.TEXT,
              content: `${
                texts?.intro.translation ?? starterMessage
              }`,
            }}
            lightMode={lightMode}
            onFormSubmit={onFormSubmit}
          />

          <div className="flex lg:hidden flex-col mt-6">
            <h2 className="text-[var(--tertiary-text)] font-bold mb-4">
              {texts?.examples
                ? `${texts.examples.translation}`
                : 'Examples'}
            </h2>
            <ChatMessage
              message={{
                role: 'sample',
                typeOfMessage: TypeOfMessage.TEXT,
                content: `${
                  texts?.example1.translation ??
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
              onFormSubmit={onFormSubmit}
            />
            <ChatMessage
              message={{
                role: 'sample',
                typeOfMessage: TypeOfMessage.TEXT,
                content: `${
                  texts?.example2.translation ??
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
              onFormSubmit={onFormSubmit}
            />
            <ChatMessage
              message={{
                role: 'sample',
                typeOfMessage: TypeOfMessage.TEXT,
                content: `${
                  texts?.example3.translation ??
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
              onFormSubmit={onFormSubmit}
            />
          </div>

          {conversation.messages.length === 0 ? (
            <></>
          ) : (
            <>
              {conversation.messages.map((message, index) => (
                <ChatMessage
                  key={index}
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
                  onSend={(message) => {
                    setCurrentMessage(message);
                    onSend(message);
                  }}
                  onRateAnswer={onRateAnswer}
                  onDisplayGallery={onDisplayGallery}
                  onFormSubmit={onFormSubmit}
                />
              ))}

              <div
                className="bg-[#FAFAFA] h-8"
                ref={messagesEndRef}
              />
            </>
          )}
        </div>

        {messageError ? (
          <></>
        ) : (
          <ChatInput
            messageIsStreaming={messageIsStreaming}
            onSend={(message) => {
              setCurrentMessage(message);
              onSend(message);
            }}
            textareaRef={textareaRef}
            texts={texts}
            model={conversation.model}
          />
        )}
      </>
    </div>
  );
};
