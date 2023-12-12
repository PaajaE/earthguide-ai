/* eslint-disable @next/next/no-img-element */
import {
  Message,
  PanelData,
  TranslateResponseBody,
  TypeOfMessage,
  TypeOfPrompt,
} from '@/types';
import { EarthGuideReactMarkdown } from './EarthGuideReactMarkdown';
import { FC } from 'react';
import { Button } from '../Shared/Button';
import { ChatLoader } from './ChatLoader';

interface Props {
  data: PanelData | null;
  loading: boolean;
  lightMode: 'light' | 'dark';
  texts?: TranslateResponseBody<string>;
  onAnotherPromptClick: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onSend: (message: Message, isResend: boolean) => void;
  onDisplayGallery: (imgSrcs: string[], curIndex: number) => void;
}

export const RightSidebarMobile: FC<Props> = ({
  data,
  loading,
  lightMode,
  texts,
  onAnotherPromptClick,
  onSend,
  onDisplayGallery,
}) => {
  return (
    <div
      className={`relative flex flex-col w-full h-full z-10 bg-[#F4F4F4]`}
    >
      <div className="w-auto flex flex-col h-full justify-between overflow-y-auto">
        <div className="text-[var(--secondary-text)]">
          {(data || loading) && (
            <>
              <div
                className={`border-[#000000ff] p-4 leading-6  font-plus jakarta sans  font-[400] overflow-y-auto overflow-x-hidden max-h-[calc(var(--window-height)_-_6rem)]`}
              >
                {data && (
                  <EarthGuideReactMarkdown
                    content={data.content}
                    lightMode={lightMode}
                    onAnotherPromptClick={onAnotherPromptClick}
                    onDisplayGallery={onDisplayGallery}
                  />
                )}
                {loading && <ChatLoader dark />}
              </div>
            </>
          )}
        </div>
        {data && !loading && (
          <div className="flex my-4 px-4">
            <Button
              text={texts?.button_3.translation ?? 'Similar places'}
              iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
              bgColor="var(--tertiary)"
              typeOfPrompt={TypeOfPrompt.MORE_LIKE}
              onClick={(typeOfPrompt: TypeOfPrompt) => {
                onSend &&
                  onSend(
                    {
                      role: 'user',
                      content: `${
                        texts?.answer_button3.translation ??
                        'Similar places like this'
                      }`,
                      typeOfMessage: TypeOfMessage.TEXT,
                      typeOfPrompt,
                      id: `${data?.id ?? ''}`,
                    },
                    false
                  );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
