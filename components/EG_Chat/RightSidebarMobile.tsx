/* eslint-disable @next/next/no-img-element */
import { Message, PanelData, TypeOfPrompt, WhereToDisplay } from "@/types";
import { EarthGuideReactMarkdown } from "./EarthGuideReactMarkdown";
import { Toggle } from "../Shared/Toggle";
import { IconArrowBarLeft } from "@tabler/icons-react";
import { FC } from "react";
import { ChatMessage } from "./ChatMessage";
import { Button } from "../Shared/Button";
import { ChatLoader } from "./ChatLoader";

interface Props {
  data: PanelData | null;
  loading: boolean;
  lightMode: "light" | "dark";
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
  onSend: (message: Message, isResend: boolean) => void;
  onDisplayGallery: (imgSrcs: string[], curIndex: number) => void;
}

export const RightSidebarMobile: FC<Props> = ({
  data,
  loading,
  lightMode,
  onAnotherPromptClick,
  onSend,
  onDisplayGallery,
}) => {
  return (
    <div
      className={`relative flex flex-col w-full h-full z-10 rounded-md bg-[#F4F4F4]`}
    //   style={{width: "-webkit-fill-available, fill-available, -moz-fill-available"}}
    >
      <div className="w-auto flex flex-col h-full justify-between rounded-md overflow-y-auto">
        <div className="text-black">
          {(data || loading) && (
            <>
              {/* <div className="flex flex-row justify-center align-center">
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
              </div> */}
              <div
                className={`border-[#000000ff] p-4 leading-6  font-plus jakarta sans  font-[400] overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_6rem)]`}
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
        {data && (
          <div className="flex my-4 px-4">
            <Button
              text="Similar places"
              iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
              bgColor="#d4845c"
              typeOfPrompt={TypeOfPrompt.MORE_LIKE}
              onClick={(typeOfPrompt: TypeOfPrompt) => {
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
