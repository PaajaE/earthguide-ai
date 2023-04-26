import { Message, OpenAIModel, OpenAIModelID } from "@/types";
import { IconSend } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

interface Props {
  messageIsStreaming: boolean;
  onSend: (message: Message) => void;
  model: OpenAIModel;
}

export const ChatInput: FC<Props> = ({ onSend, messageIsStreaming, model }) => {
  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = model.id === OpenAIModelID.GPT_3_5 ? 12000 : 24000;

    if (value.length > maxLength) {
      alert(`Message limit is ${maxLength} characters`);
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    if (!content) {
      alert("Please enter a message");
      return;
    }

    onSend({ role: "user", content });
    setContent("");

    if (textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      if (e.key === "Enter" && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="pb-4 bg-[#FAFAFA]">
      <textarea
        ref={textareaRef}
        className="pl-4 pr-8 py-3 w-full border-[#979797ff] border-solid rounded-[10px]  bg-[rgba(255,255,255,1)] text-black drop-shadow-md"
        style={{
          resize: "none",
          bottom: `${textareaRef?.current?.scrollHeight}px`,
          maxHeight: "400px",
          overflow: "auto",
        }}
        placeholder="Type a message..."
        value={content}
        rows={1}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <button
        className="absolute right-10 bottom-[32px] focus:outline-none text-neutral-800 hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-neutral-200 dark:bg-opacity-50 hover:bg-neutral-200 p-1 rounded-sm"
        onClick={handleSend}
      >
        <IconSend size={18} color={"#999"} />
      </button>
    </div>
  );
};
