import { Message, TypeOfPrompt } from '@/types';
import { FC, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../Markdown/CodeBlock';
import { Button } from '../Shared/Button';
import { EarthGuideReactMarkdown } from './EarthGuideReactMarkdown';
import { ChatLoader } from './ChatLoader';
import MapboxMap from '../Map/MapboxMap';

interface Props {
  message: Message;
  messageIsStreaming?: boolean;
  streamingFinished?: boolean;
  lightMode: 'light' | 'dark';
  pathExists?: boolean;
  onAnotherPromptClick?: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onSend?: (message: Message) => void;
  onSampleClick?: (content: string) => void;
  onDisplayGallery?: (imgSrcs: string[], curIndex: number) => void;
}

export const ChatMessage: FC<Props> = ({
  message,
  lightMode,
  messageIsStreaming = false,
  streamingFinished = false,
  pathExists = false,
  onSend,
  onAnotherPromptClick,
  onSampleClick,
  onDisplayGallery,
}) => {
  return (
    <>
      <div
        className={`flex flex-row justify-start items-start gap-2.5 mb-5 pb-5 w-100 box-border ${
          message.role === 'starter'
            ? 'bg-[rgba(236,236,236,1)] rounded-t-[10px] rounded-r-[10px] lg:mr-8 px-[17px] py-3 mb-3'
            : ''
        }
        ${
          message.role === 'user'
            ? 'bg-[var(--primary)] rounded-t-[10px] rounded-bl-[10px] lg:ml-8 px-[17px] py-5 mb-3'
            : ''
        }
        ${
          message.role === 'earth.guide'
            ? 'bg-[var(--secondary)] rounded-t-[10px] rounded-r-[10px] lg:mr-8'
            : ''
        }
        ${
          message.role === 'earth.guide' && streamingFinished
            ? "after:content-['✓'] after:absolute after:bottom-1 after:right-2 after:text-slate-200"
            : ''
        }
        ${
          message.role === 'sample'
            ? 'bg-white rounded-t-[10px] rounded-r-[10px] px-[17px] py-3 mb-3'
            : ''
        }
        `}
        style={{
          cursor:
            message.role === 'sample' && onSampleClick
              ? 'pointer'
              : 'default',
        }}
        onClick={() => {
          if (message.role === 'sample') {
            onSampleClick && onSampleClick(message.content);
          }
        }}
      >
        <div
          className={`border-[#000000ff] leading-6 flex flex-col w-full  font-plus jakarta sans  font-[400]
      ${
        message.role === 'earth.guide'
          ? 'text-[var(--secondary-text)]'
          : 'text-[var(--primary-text)]'
      }
      ${
        (message.role === 'sample' || message.role === 'starter') &&
        'text-[var(--tertiary-text)]'
      }`}
        >
          {message.role === 'user' && <>{message.content}</>}
          {message.role === 'sample' && <>{message.content}</>}
          {message.role === 'starter' && <>{message.content}</>}
          {message.role === 'earth.guide' && (
            <>
              <EarthGuideReactMarkdown
                content={message.content}
                lightMode={lightMode}
                onAnotherPromptClick={onAnotherPromptClick}
                onDisplayGallery={
                  onDisplayGallery && onDisplayGallery
                }
              />
              {messageIsStreaming && <ChatLoader />}
            </>
          )}
        </div>
      </div>
      {message.role === 'earth.guide' && streamingFinished && (
        <>
          <div
            className={`flex flex-row justify-start items-start gap-2.5 mb-5 w-100 box-border rounded-[10px]`}
          >
            <div
              className={`border-[#000000ff] leading-6 flex flex-col w-full  font-plus jakarta sans  font-[400] text-[var(--secondary-text)] rounded-[10px]`}
            >
              <MapboxMap />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row mt-3 mb-6">
            <Button
              text="More places like these"
              iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
              bgColor="var(--tertiary)"
              typeOfPrompt={TypeOfPrompt.MORE_PLACES}
              onClick={(typeOfPrompt: TypeOfPrompt) => {
                onSend &&
                  onSend({
                    role: 'user',
                    content: 'More places like these',
                    typeOfPrompt,
                    id: message.id ?? '',
                  });
              }}
            />
            {!pathExists && (
              <Button
                text="Show me lesser-known places"
                iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
                bgColor="var(--tertiary)"
                typeOfPrompt={TypeOfPrompt.LESSER_KNOWN}
                onClick={(typeOfPrompt: TypeOfPrompt) => {
                  onSend &&
                    onSend({
                      role: 'user',
                      content: 'Show me lesser-known places',
                      typeOfPrompt,
                      id: message.id ?? '',
                    });
                }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
