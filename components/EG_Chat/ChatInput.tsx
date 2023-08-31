import {
  Message,
  OpenAIModel,
  OpenAIModelID,
  TypeOfMessage,
} from '@/types';
import { IconSend } from '@tabler/icons-react';
import {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  messageIsStreaming: boolean;
  onSend: (message: Message) => void;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  model: OpenAIModel;
}

export const ChatInput: FC<Props> = ({
  onSend,
  messageIsStreaming,
  model,
  textareaRef,
}) => {
  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const maxLength =
      model.id === OpenAIModelID.GPT_3_5 ? 12000 : 24000;

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
      alert('Please enter a message');
      return;
    }

    onSend({
      role: 'user',
      typeOfMessage: TypeOfMessage.TEXT,
      content,
    });
    setContent('');

    if (textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined'
        ? ''
        : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${
        textareaRef.current?.scrollHeight + 4
      }px`;
    }
  }, [content]);

  return (
    <>
      <div className="sticky lg:w-[calc(60vw_-_2rem)] px-4 pb-12 lg:pb-8 bg-[#FAFAFA]">
        <textarea
          ref={textareaRef}
          className="pl-4 pr-8 pt-[0.8rem] pb-[0.7rem] pb w-full border-[#979797ff] border-solid rounded-[10px]  bg-[rgba(255,255,255,1)] text-[var(--tertiary-text)] drop-shadow-md"
          style={{
            resize: 'none',
            bottom: `${textareaRef?.current?.scrollHeight}px`,
            maxHeight: '400px',
            overflow: 'auto',
          }}
          placeholder="Discover flights and dream holidays"
          value={content}
          rows={1}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="absolute right-6 lg:right-4 bottom-16 lg:bottom-12 focus:outline-none text-neutral-800 hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-neutral-200 dark:bg-opacity-50 hover:bg-neutral-200 p-1 rounded-sm"
          onClick={handleSend}
        >
          <IconSend size={18} color={'#999'} />
        </button>
        <p className="absolute bottom-4 text-[var(--secondary-text)] text-[0.65rem] w-[90%] flex justify-center text-center">
          All photos are from our community. Want to join, earn to
          train AI and create content and earn dividends?{' '}
          <a
            className="underline"
            href="https://earth.guide"
            title="Earth.Guide"
            target="_blank"
          >
            Join
          </a>
        </p>
      </div>
    </>
  );
};
