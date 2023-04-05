/* eslint-disable @next/next/no-img-element */
import { PanelData, TypeOfPrompt, WhereToDisplay } from "@/types";
import { FC } from "react";
import { EarthGuideReactMarkdown } from "./EarthGuideReactMarkdown";
import { Toggle } from "../Shared/Toggle";

interface Props {
  data: PanelData;
  lightMode: "light" | "dark";
  onAnotherPromptClick: (typeOfPrompt: TypeOfPrompt, id: string) => void;
}

export const LeftPanel: FC<Props> = ({
  data,
  lightMode,
  onAnotherPromptClick,
}) => {
  console.log("content", data);
  return (
    <>
      <div className="text-black mt-4 mb-2 mx-2 p-4 bg-[#FAFAFA]">
        <div className="flex flex-row justify-center align-center">
          <Toggle
            items={[
              { type: WhereToDisplay.PANEL_DESTINATION, label: "Destination" },
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
          <EarthGuideReactMarkdown
            content={data.content}
            lightMode={lightMode}
            onAnotherPromptClick={onAnotherPromptClick}
          />
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
    </>
  );
};
