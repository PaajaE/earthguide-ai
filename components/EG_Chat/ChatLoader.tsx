import { IconDots } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  dark?: boolean;
}

export const ChatLoader: FC<Props> = ({ dark }) => {
  return (
    <div
      className={`w-full flex justify-center px-4 text-[${
        dark ? "black" : "white"
      }] my-2`}
    >
      <IconDots className="animate-pulse" />
    </div>
  );
};
