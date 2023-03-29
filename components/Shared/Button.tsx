/* eslint-disable @next/next/no-img-element */
import { TypeOfPrompt } from "@/types";
import { FC } from "react";

interface Props {
  text: string;
  iconUrl: string;
  bgColor: string;
  typeOfPrompt: TypeOfPrompt;
  onClick: (typeOfPrompt: TypeOfPrompt) => void;
}

export const Button: FC<Props> = ({
  text,
  iconUrl,
  bgColor,
  typeOfPrompt,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-row justify-start first-of-type:mr-2 cursor-pointer items-start gap-2.5 h-[55px] px-[13px] py-3.5 rounded-t-[15px] rounded-bl-[15px] box-border bg-[rgba(255,86,0,0.41)]`}
      onClick={(e) => onClick(typeOfPrompt)}
    >
      <img src={iconUrl} alt="" className=" w-[30px] h-[30px]" />
      <p className="text-white leading-6 font-plus jakarta sans font-[400]">
        {text}
      </p>
    </div>
  );
};
