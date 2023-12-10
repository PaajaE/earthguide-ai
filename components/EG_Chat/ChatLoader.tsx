import Lottie from 'lottie-react';
import { FC } from 'react';
import animData from '../assets/anim-green.json';

interface Props {
  dark?: boolean;
}

export const ChatLoader: FC<Props> = ({ dark }) => {
  return (
    <div className={`w-full flex justify-center px-4 my-2`}>
      <div className="w-1/2 lottie">
        <Lottie animationData={animData} loop />
      </div>
    </div>
  );
};
