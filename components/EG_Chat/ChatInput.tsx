import {
  Message,
  OpenAIModel,
  OpenAIModelID,
  TranslateResponseBody,
  TypeOfMessage,
} from '@/types';
import { ButtonPrimitive } from '@kiwicom/orbit-components';
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
  texts: TranslateResponseBody<string>;
  hasReplies: boolean;
  showShadows?: boolean;
}

export const ChatInput: FC<Props> = ({
  onSend,
  messageIsStreaming,
  model,
  textareaRef,
  texts,
  hasReplies,
  showShadows = false,
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

    onSend({
      role: 'user',
      typeOfMessage: TypeOfMessage.TEXT,
      content: content ?? '',
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
      <div className="sticky lg:w-[calc(50vw_-_2rem)] lg:p-4 ">
        <div
          className={`bg-[var(--secondary)] p-8 rounded-lg ${
            showShadows ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              className="pl-4 pr-8 pt-[0.8rem] pb-[0.7rem] pb w-full border-[#979797ff] border-solid rounded-lg  bg-[rgba(255,255,255,1)] text-[var(--tertiary-text)] drop-shadow-md"
              style={{
                resize: 'none',
                bottom: `${textareaRef?.current?.scrollHeight}px`,
                maxHeight: '400px',
                overflow: 'auto',
              }}
              placeholder={`${
                hasReplies
                  ? texts.prompt2.translation
                  : texts.prompt.translation
              }`}
              value={content}
              rows={1}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <ButtonPrimitive
              className="bg-[var(--primary)] text-white hover:bg-white hover:text-[var(--primary)] border-[1px] border-[var(--primary)] font-semibold py-3 px-6 rounded-lg"
              onClick={handleSend}
            >
              Odeslat
            </ButtonPrimitive>
          </div>

          <p className="relative mt-2 text-[var(--secondary-text)] text-[0.65rem] w-full flex-col justify-center text-center">
            {texts.text_under_prompt.translation}

            <a
              className="underline pl-1"
              href="https://earth.guide"
              title="Earth.Guide"
              target="_blank"
            >
              {texts.text_of_link_under_prompt.translation}
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
