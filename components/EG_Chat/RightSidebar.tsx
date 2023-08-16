/* eslint-disable @next/next/no-img-element */
import {
  Message,
  PanelData,
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
                  content:
                    'What are some affordable beach destinations in Europe with direct flights from Vienna? We want to fly in September. From 7 to 11 days.',
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: 'user', content });
                }}
                onFormSubmit={() => {}}
              />
              <ChatMessage
                message={{
                  role: 'sample',
                  content:
                    "I'm looking for super cheap flights next weekend to destinations with good weather and accessible hiking trails.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: 'user', content });
                }}
                onFormSubmit={() => {}}
              />
              <ChatMessage
                message={{
                  role: 'sample',
                  content:
                    "In November I'm planning a 14-day trip to Asia and looking for recommendations for hidden gem destinations with astonishing Buddhist monuments and opportunities for surfing.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: 'user', content });
                }}
                onFormSubmit={() => {}}
              />
              <h2 className="font-bold mb-4 mt-2">Capabilities</h2>
              <ChatMessage
                message={{
                  role: 'sample',
                  content:
                    "My superpower is discovering destinations and flight tickets with just one request. Simply tell me your preferences, and I'll provide personalized recommendations.",
                }}
                lightMode={lightMode}
                onFormSubmit={() => {}}
              />
              <h2 className="font-bold mb-4 mt-2">Coming soon</h2>
              <ChatMessage
                message={{
                  role: 'sample',
                  content:
                    "We're expanding our capabilities! Soon, you'll be able to discover and book flights, hotels, and car rentals all in one query.",
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
