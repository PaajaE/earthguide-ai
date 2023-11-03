/* eslint-disable @next/next/no-img-element */
import {
  IFlightParamsConverted,
  Message,
  PanelData,
  TranslateResponseBody,
  TypeOfMessage,
  TypeOfPrompt,
  WhereToDisplay,
} from '@/types';
import { EarthGuideReactMarkdown } from './EarthGuideReactMarkdown';
import { Toggle } from '../Shared/Toggle';
import { IconArrowBarLeft } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { Button } from '../Shared/Button';
import { ChatLoader } from './ChatLoader';
import { FlightForm } from './FlightForm';

interface Props {
  data: PanelData | null;
  loading: boolean;
  texts?: TranslateResponseBody<string>;
  flightParams: IFlightParamsConverted;
  defaultData: boolean;
  showShadows?: boolean;
  onSend: (message: Message) => void;
  onFormSubmit: (
    flightParams: IFlightParamsConverted,
    defaultFpData: boolean
  ) => void;
}

export const RightSidebar: FC<Props> = ({
  data,
  loading,
  showShadows = false,
  texts,
  flightParams,
  defaultData,
  onSend,
  onFormSubmit,
}) => {
  const [fpData, setFpData] =
    useState<IFlightParamsConverted>(flightParams);
  const [defaultFpData, setDefaultFpData] =
    useState<boolean>(defaultData);

  const handleFormSubmit = () => {
    onFormSubmit(fpData, defaultFpData);
  };

  const handleChangeFlightParams = (
    newFpData: Partial<IFlightParamsConverted>
  ) => {
    console.log(newFpData);
    setFpData((prevData) => {
      return {
        ...prevData,
        ...newFpData,
      };
    });
    setDefaultFpData(false);
  };

  useEffect(() => {
    setFpData(flightParams);
    setDefaultFpData(defaultData);
  }, [flightParams, defaultData]);

  return (
    <div
      className={`relative flex flex-col w-1/4 min-w-[400px] shrink-0 z-10 rounded-md`}
      style={{
        width:
          '-webkit-fill-available, fill-available, -moz-fill-available',
      }}
    >
      <div className="w-auto rounded-md overflow-y-auto">
        <div className="text-[var(--tertiary-text)] pb-8 px-4">
          {fpData && (
            <div
              className={`flex flex-row justify-start items-start gap-2.5 w-100 box-border bg-[var(--secondary)] rounded-t-[10px] rounded-r-[10px] ${
                showShadows ? 'shadow-lg' : ''
              }`}
            >
              <div
                className={`p-8 leading-6 flex flex-col w-full font-plus jakarta sans font-[400] text-[var(--secondary-text)]`}
              >
                <FlightForm
                  flightParameters={fpData}
                  messageId={''}
                  texts={texts}
                  onChangeFlightParams={handleChangeFlightParams}
                  onFormSubmit={handleFormSubmit}
                />
              </div>
            </div>
          )}
        </div>
        {data && !loading && (
          <div className="flex mt-4 mb-2 px-4">
            <Button
              text={texts?.button_3.translation ?? 'Similar places'}
              iconUrl="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/ye8nsqm0bdc-825%3A578?alt=media&token=24521707-8435-44ee-82ca-d15de9e01b9f"
              bgColor="var(--tertiary)"
              typeOfPrompt={TypeOfPrompt.MORE_LIKE}
              onClick={(typeOfPrompt: TypeOfPrompt) => {
                onSend &&
                  onSend({
                    role: 'user',
                    content: `${
                      texts?.answer_button3.translation ??
                      'Similar places like this'
                    }`,
                    typeOfMessage: TypeOfMessage.TEXT,
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
