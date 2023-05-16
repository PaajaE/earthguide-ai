import {
  Conversation,
  KeyValuePair,
  Message,
  OpenAIModel,
  TypeOfPrompt,
} from "@/types";
import { FC, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ModelSelect } from "./ModalSelect";
import { Regenerate } from "./Regenerate";
import { SystemPrompt } from "./SystemPrompt";

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  messageIsStreaming: boolean;
  modelError: boolean;
  messageError: boolean;
  loading: boolean;
  lightMode: "light" | "dark";
  onSend: (message: Message, isResend: boolean) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair
  ) => void;
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
}

export const Chat: FC<Props> = ({
  conversation,
  models,
  messageIsStreaming,
  modelError,
  messageError,
  loading,
  lightMode,
  onSend,
  onUpdateConversation,
  onAnotherPromptClick,
}) => {
  const [currentMessage, setCurrentMessage] = useState<Message>();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  return (
    <div className="relative flex flex-col justify-between flex-1 md:w-[calc(70%_-_290px)] min-h-[calc(100vh_-_100px)] bg-[#FAFAFA] px-4 mr-4">
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
          <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_300px)]">
            <ChatMessage
              key="starter-message"
              message={{
                role: "starter",
                content:
                  "Hello, I am your AI travel advisor. With my help, you can quickly discover the perfect destination for your next adventure and find the best flight tickets to get you there.",
              }}
              lightMode={lightMode}
            />
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
                  />
                ))}

                {/* {loading && <ChatLoader />} */}

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
              model={conversation.model}
            />
          )}
        </>
      )}
    </div>
  );
};
