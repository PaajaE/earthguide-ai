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
    <div className="relative flex flex-col justify-end flex-1 md:w-full min-h-[calc(100vh_-_100px)] lg:w-3/5 bg-[#FAFAFA] px-4 mr-4">
      {modelError ? (
        <div className="flex flex-col justify-center mx-auto h-full w-[300px] sm:w-[500px] space-y-6">
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
          <div>
            {conversation.messages.length === 0 ? (
              <></>
            ) : (
              <>
                {/* <div className="flex justify-center py-2 text-neutral-500 bg-neutral-100 dark:bg-[#444654] dark:text-neutral-200 text-sm border border-b-neutral-300 dark:border-none">
                  Model: {conversation.model.name}
                </div> */}

                {conversation.messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    lightMode={lightMode}
                    onAnotherPromptClick={onAnotherPromptClick}
                  />
                ))}

                {loading && <ChatLoader />}

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
