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
  shouldScrollToBottom: boolean;
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
  onDisallowScrollToBottom: () => void;
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
  shouldScrollToBottom,
  onSend,
  onRateAnswer,
  onAnotherPromptClick,
  onDisplayGallery,
  onFormSubmit,
  onDisallowScrollToBottom,
}) => {
  const path = usePathname()?.substring(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    console.log('scroll to bottom');
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

  const handleFormSubmit = (
    data: IFlightParamsConverted,
    messageId: string,
    prevParams: IFlightParamsConverted
  ) => {
    onFormSubmit(data, messageId, prevParams);
  };

  return (
    <div className="relative flex flex-col justify-between w-auto h-full lg:h-auto lg:min-h-[calc(100vh_-_100px)] max-w-full lg:max-w-[60%] bg-[#FAFAFA]">
      <>
        <div
          className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_8rem)] lg:max-h-[calc(100vh_-_10rem)] p-4 lg:py-0 lg:px-4"
          ref={chatContainerRef}
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
            onFormSubmit={handleFormSubmit}
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
              onFormSubmit={handleFormSubmit}
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
              onFormSubmit={handleFormSubmit}
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
              onFormSubmit={handleFormSubmit}
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
                    onSend(message);
                  }}
                  onRateAnswer={onRateAnswer}
                  onDisplayGallery={onDisplayGallery}
                  onFormSubmit={handleFormSubmit}
                />
              ))}

              <div
                className="bg-[#FAFAFA] h-[20vh]"
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
