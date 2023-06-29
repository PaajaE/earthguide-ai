import {
  Conversation,
  KeyValuePair,
  Message,
  OpenAIModel,
  TypeOfPrompt,
} from "@/types";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Regenerate } from "./Regenerate";
import { throttle } from "@/utils/data/throttle";
import { LeftSidebar } from "./LeftSidebar";

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  messageIsStreaming: boolean;
  modelError: boolean;
  messageError: boolean;
  loading: boolean;
  lightMode: "light" | "dark";
  isMobile: boolean;
  onSend: (message: Message, isResend: boolean) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair
  ) => void;
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
  onDisplayGallery: (imgSrcs: string[], curIndex: number) => void;
}

export const Chat: FC<Props> = ({
  conversation,
  models,
  messageIsStreaming,
  modelError,
  messageError,
  loading,
  lightMode,
  isMobile,
  onSend,
  onUpdateConversation,
  onAnotherPromptClick,
  onDisplayGallery,
}) => {
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      behavior: "smooth",
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
    <div className="relative flex flex-col justify-between w-auto h-full lg:h-auto lg:min-h-[calc(100vh_-_100px)] max-w-full lg:max-w-[70%] bg-[#FAFAFA] lg:px-4">
      {modelError ? (
        <div className="flex flex-col justify-center mx-auto h-full w-full space-y-6">
          <div className="text-center text-red-500">Error fetching models.</div>
          <div className="text-center text-red-500">
            Make sure your OpenAI API key is set in the bottom left of the
            sidebar or in a .env.local file and refresh.
          </div>
          <div className="text-center text-red-500">
            If you completed this step, OpenAI may be experiencing issues.
          </div>
        </div>
      ) : (
        <>
          <div
            className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_8rem)] lg:max-h-[calc(100vh_-_10rem)] p-4 lg:p-0"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {isMobile && (
              <LeftSidebar lightMode="light"/>
            )}
            <ChatMessage
              key="starter-message"
              message={{
                role: "starter",
                content:
                  "Hello, I am your AI travel advisor. With my help, you can quickly discover the perfect flight tickets to your dream destinations.",
              }}
              lightMode={lightMode}
            />

            <div className="flex lg:hidden flex-col mt-6">
              <h2 className="text-black font-bold mb-4">Examples</h2>
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "What are some affordable beach destinations in Europe with direct flights from Vienna? We want to fly in September. From 7 to 11 days.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: "user", content }, false);
                }}
              />
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "I'm looking for super cheap flights next weekend to destinations with good weather and accessible hiking trails.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: "user", content }, false);
                }}
              />
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "In November I'm planning a 14-day trip to Asia and looking for recommendations for hidden gem destinations with astonishing Buddhist monuments and opportunities for surfing.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: "user", content }, false);
                }}
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
                    onAnotherPromptClick={onAnotherPromptClick}
                    messageIsStreaming={messageIsStreaming}
                    onSend={(message) => {
                      setCurrentMessage(message);
                      onSend(message, false);
                    }}
                    onDisplayGallery={onDisplayGallery}
                  />
                ))}

                <div className="bg-[#FAFAFA] h-8" ref={messagesEndRef} />
              </>
            )}
          </div>

          {messageError ? (
            <Regenerate
              onRegenerate={() => {
                if (currentMessage) {
                  onSend(currentMessage, true);
                }
              }}
            />
          ) : (
            <ChatInput
              messageIsStreaming={messageIsStreaming}
              onSend={(message) => {
                setCurrentMessage(message);
                onSend(message, false);
              }}
              textareaRef={textareaRef}
              model={conversation.model}
            />
          )}
        </>
      )}
    </div>
  );
};
