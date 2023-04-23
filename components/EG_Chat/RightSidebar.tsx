/* eslint-disable @next/next/no-img-element */
import { PanelData, TypeOfPrompt, WhereToDisplay } from "@/types";
import { EarthGuideReactMarkdown } from "./EarthGuideReactMarkdown";
import { Toggle } from "../Shared/Toggle";
import { IconArrowBarLeft } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  data: PanelData | null;
  lightMode: "light" | "dark";
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
}

export const RightSidebar: FC<Props> = ({
  data,
  lightMode,
  onAnotherPromptClick,
}) => {
  return (
    <div
      className={`flex flex-col bg-[#FAFAFA] min-w-full sm:min-w-[260px] sm:max-w-[calc((100%_-_260px)_/_2)] z-10 sm:relative sm:top-0 absolute top-12 bottom-0`}
    >
      <div className="flex-1 overflow-auto">
        <div className="text-black mt-4 mb-2 mx-2 p-2 bg-[#FAFAFA]">
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
            {data ? (
              <EarthGuideReactMarkdown
                content={data.content}
                lightMode={lightMode}
                onAnotherPromptClick={onAnotherPromptClick}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>

                <p className="text-2xl font-bold">Loading...</p>

                <p className="text-xl">Please wait...</p>
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex mt-4 mb-2">
        <Button
          text="More places like these"
          iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
          bgColor="#d4845c"
          typeOfPrompt={TypeOfPrompt.MORE_PLACES}
          onClick={(typeOfPrompt: TypeOfPrompt) => {
            onAnotherPromptClick(typeOfPrompt, "");
          }}
        />
        <Button
          text="Show me lesser-known places"
          iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
          bgColor="#d4845c"
          typeOfPrompt={TypeOfPrompt.LESSER_KNOWN}
          onClick={(typeOfPrompt: TypeOfPrompt) => {
            onAnotherPromptClick(typeOfPrompt, "");
          }}
        />
      </div> */}
      </div>
    </div>
  );
};
