/* eslint-disable @next/next/no-img-element */
import { TypeOfPrompt } from '@/types';
import { FC } from 'react';

interface Props {
  text: string;
  iconUrl: string;
  bgColor: string;
  typeOfPrompt?: TypeOfPrompt;
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
      className={`flex flex-row justify-center lg:justify-start mb-3 lg:mb-0 w-full lg:w-auto items-center first-of-type:mr-2 cursor-pointer items-start gap-2.5 px-[13px] py-3.5 rounded-lg box-border bg-[var(--tertiary)]`}
      onClick={(e) =>
        onClick(typeOfPrompt ?? TypeOfPrompt.TEXT_PROMPT)
      }
    >
      <img
        src={iconUrl}
        alt=""
        className="hidden md:block w-[30px] h-[30px]"
      />
      <p className="text-[var(--primary-text)] leading-6 font-plus jakarta sans font-[400]">
        {text}
      </p>
    </div>
  );
};
