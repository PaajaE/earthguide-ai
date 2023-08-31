/* eslint-disable @next/next/no-img-element */
import {
  Message,
  PanelData,
  TypeOfMessage,
  TypeOfPrompt,
  WhereToDisplay,
} from '@/types';
import { EarthGuideReactMarkdown } from './EarthGuideReactMarkdown';
import { Toggle } from '../Shared/Toggle';
import { IconArrowBarLeft } from '@tabler/icons-react';
import { FC } from 'react';
import { ChatMessage } from './ChatMessage';
import { Button } from '../Shared/Button';
import { ChatLoader } from './ChatLoader';

interface Props {
  data: PanelData | null;
  loading: boolean;
  lightMode: 'light' | 'dark';
  showSample: boolean;
  onAnotherPromptClick: (
    typeOfPrompt: TypeOfPrompt,
    id: string
  ) => void;
  onSend: (message: Message) => void;
  onDisplayGallery: (imgSrcs: string[], curIndex: number) => void;
}

export const RightSidebar: FC<Props> = ({
  data,
  loading,
  lightMode,
  showSample,
  onAnotherPromptClick,
  onSend,
  onDisplayGallery,
}) => {
  return (
    <div
      className={`relative flex flex-col w-[30%] shrink-1 z-10 rounded-md bg-[#F4F4F4]`}
      style={{
        width:
          '-webkit-fill-available, fill-available, -moz-fill-available',
      }}
    >
      <div className="w-auto rounded-md overflow-y-auto">
        <div className="text-[var(--tertiary-text)] mt-4 mb-2 pt-0">
          {showSample && (
            <div className="flex flex-col mt-2 px-4">
              <h2 className="font-bold mb-4">Examples</h2>
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content:
                    'Affordable beach destinations in Europe. We want to fly in October. For 7 days.',
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({
                    role: 'user',
                    typeOfMessage: TypeOfMessage.TEXT,
                    content,
                  });
                }}
                onFormSubmit={() => {}}
              />
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content:
                    'Flight to UNESCO site. City break for 4 days, November, warm weather',
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({
                    role: 'user',
                    typeOfMessage: TypeOfMessage.TEXT,
                    content,
                  });
                }}
                onFormSubmit={() => {}}
              />
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content:
                    'Flight next weekend to destination with good weather and hiking trails with elevation at least 1000 m.',
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({
                    role: 'user',
                    typeOfMessage: TypeOfMessage.TEXT,
                    content,
                  });
                }}
                onFormSubmit={() => {}}
              />
              <h2 className="font-bold mb-4 mt-2">Capabilities</h2>
              <ChatMessage
                message={{
                  role: 'sample',
                  typeOfMessage: TypeOfMessage.TEXT,
                  content:
                    "My superpower is discovering destinations and flight tickets with just one request. Simply tell me your preferences, and I'll provide personalized recommendations.",
                }}
                lightMode={lightMode}
                onFormSubmit={() => {}}
              />
            </div>
          )}
          {(data || loading) && (
            <>
              <div className="flex flex-row justify-center align-center">
                <Toggle
                  items={[
                    {
                      type: WhereToDisplay.PANEL_DESTINATION,
                      label: 'Destination',
                    },
                    {
                      type: WhereToDisplay.PANEL_FLIGHTS,
                      label: 'Flights',
                    },
                  ]}
                />
              </div>
              <div
                className={`border-[#000000ff] px-4 leading-6  font-plus jakarta sans  font-[400] overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_14rem)]`}
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
          <div className="flex mt-4 mb-2 px-4">
            <Button
              text="Similar places"
              iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
              bgColor="var(--tertiary)"
              typeOfPrompt={TypeOfPrompt.MORE_LIKE}
              onClick={(typeOfPrompt: TypeOfPrompt) => {
                onSend &&
                  onSend({
                    role: 'user',
                    content: 'Similar places like this',
                    typeOfMessage: TypeOfMessage.TEXT,
                    typeOfPrompt,
                    id: `${data?.id ?? ''}`,
                  });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
