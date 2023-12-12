import {
  Message,
  OpenAIModel,
  OpenAIModelID,
  TranslateResponseBody,
  TypeOfMessage,
} from '@/types';
import { ButtonPrimitive } from '@kiwicom/orbit-components';
import { Send } from "@kiwicom/orbit-components/icons"
import {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useState,
} from 'react';

interface Props {
  messageIsStreaming: boolean;
  onSend: (message: Message) => void;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  model: OpenAIModel;
  texts: TranslateResponseBody<string>;
  promptPlaceholder: string;
  showShadows?: boolean;
  isMobile: boolean;
}

export const ChatInput: FC<Props> = ({
  onSend,
  messageIsStreaming,
  model,
  textareaRef,
  texts,
  promptPlaceholder,
  showShadows = false,
  isMobile,
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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
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
  }, [content, textareaRef]);

  return (
    <>
      <div className="sticky w-full lg:w-[calc(50vw_-_2rem)] p-0 lg:p-4 lg:bottom-4 ">
        <div
          className={`bg-[var(--secondary)] p-4 lg:p-8 rounded-lg ${
            showShadows ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              className="pl-2 pr-4 py-[0.35rem] lg:pl-4 lg:pr-8 lg:pt-[0.8rem] lg:pb-[0.7rem] pb w-full border-[#979797ff] border-solid rounded-md lg:rounded-lg  bg-[rgba(255,255,255,1)] text-[var(--tertiary-text)] drop-shadow-md"
              style={{
                resize: 'none',
                bottom: `${textareaRef?.current?.scrollHeight}px`,
                maxHeight: '400px',
                overflow: 'auto',
              }}
              placeholder={texts[promptPlaceholder].translation}
              value={content}
              rows={1}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <ButtonPrimitive
              className="bg-[var(--primary)] text-white hover:bg-white hover:text-[var(--primary)] border-[1px] border-[var(--primary)] font-semibold py-1 px-3 lg:py-3 lg:px-6 rounded-md lg:rounded-lg"
              onClick={handleSend}
              iconLeft={isMobile && <Send/>}
            >
              {!isMobile && texts.prompt_button.translation}
            </ButtonPrimitive>
          </div>

          <p className="hidden lg:flex relative mt-2 text-[var(--secondary-text)] text-[0.65rem] w-full flex-col justify-center text-center">
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
