/* eslint-disable @next/next/no-img-element */
import { Message, PanelData, TypeOfPrompt, WhereToDisplay } from "@/types";
import { EarthGuideReactMarkdown } from "./EarthGuideReactMarkdown";
import { Toggle } from "../Shared/Toggle";
import { IconArrowBarLeft } from "@tabler/icons-react";
import { FC } from "react";
import { ChatMessage } from "./ChatMessage";
import { Button } from "../Shared/Button";

interface Props {
  data: PanelData | null;
  loading: boolean;
  lightMode: "light" | "dark";
  showSample: boolean;
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
  onSend: (message: Message, isResend: boolean) => void;
}

export const RightSidebar: FC<Props> = ({
  data,
  loading,
  lightMode,
  showSample,
  onAnotherPromptClick,
  onSend,
}) => {
  return (
    <div
      className={`flex flex-col bg-[#F4F4F4] min-w-full sm:min-w-[300px] lg:min-w-[30%] lg:max-w-[30%] z-10 sm:relative sm:top-0 absolute top-12 bottom-0 rounded-md`}
    >
      <div className="">
        <div className="text-black mt-4 mb-2 mx-2 p-2 pt-0">
          {showSample && (
            <div className="flex flex-col mt-2">
              <h2 className="font-bold mb-4">Examples</h2>
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "What are some affordable beach destinations in Europe with direct flights from Vienna?",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: "user", content }, false);
                }}
              />
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "I'm looking for super cheap flights from London next weekend to destinations with good weather and accessible hiking trails.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: "user", content }, false);
                }}
              />
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "I'm planning a 14-day trip to Asia and looking for recommendations for hidden gem destinations with astonishing Buddhist monuments and opportunities for surfing.",
                }}
                lightMode={lightMode}
                onSampleClick={(content) => {
                  onSend({ role: "user", content }, false);
                }}
              />
              <h2 className="font-bold mb-4 mt-2">Capabilities</h2>
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "My superpower is discovering destinations and flight tickets with just one request. Simply tell me your preferences, and I'll provide personalized recommendations.",
                }}
                lightMode={lightMode}
              />
              <h2 className="font-bold mb-4 mt-2">Coming soon</h2>
              <ChatMessage
                message={{
                  role: "sample",
                  content:
                    "We're expanding our capabilities! Soon, you'll be able to discover and book flights, hotels, and car rentals all in one query.",
                }}
                lightMode={lightMode}
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
                      label: "Destination",
                    },
                    {
                      type: WhereToDisplay.PANEL_FLIGHTS,
                      label: "Flights",
                    },
                  ]}
                />
              </div>
              <div
                className={`border-[#000000ff] leading-6  font-plus jakarta sans  font-[400]`}
              >
                {loading && (
                  <div className="flex flex-col items-center justify-center h-full mt-2">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>

                    <p className="text-2xl font-bold">Loading...</p>

                    <p className="text-xl">Please wait...</p>
                  </div>
                )}
                {data && (
                  <EarthGuideReactMarkdown
                    content={data.content}
                    lightMode={lightMode}
                    onAnotherPromptClick={onAnotherPromptClick}
                  />
                )}
              </div>
            </>
          )}
        </div>
        {data && (
          <div className="flex mt-4 mb-2 px-4">
            <Button
              text="Similar places"
              iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
              bgColor="#d4845c"
              typeOfPrompt={TypeOfPrompt.MORE_LIKE}
              onClick={(typeOfPrompt: TypeOfPrompt) => {
                onAnotherPromptClick(typeOfPrompt, `${data?.id}`);
                onSend &&
                  onSend(
                    {
                      role: "user",
                      content: "Similar places like this",
                      typeOfPrompt,
                      id: `${data?.id ?? ""}`,
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
