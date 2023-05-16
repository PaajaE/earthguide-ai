import { IconDots } from "@tabler/icons-react";
import { FC } from "react";

interface Props {}

export const ChatLoader: FC<Props> = () => {
  return (
    <div className="w-full flex justify-center px-4 text-white my-2">
      <IconDots className="animate-pulse" />
    </div>
  );
};
