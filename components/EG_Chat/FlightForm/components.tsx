import { TranslateResponseBody } from '@/types';
import {
  ButtonPrimitive,
  ListChoice,
  Popover,
  Text,
} from '@kiwicom/orbit-components';
import useClickOutside from '@kiwicom/orbit-components/lib/hooks/useClickOutside';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';
import { useRef, useState } from 'react';

interface VacationLengthPickerProps {
  from?: number;
  to?: number;
  texts?: TranslateResponseBody<string>;
  onVacationLengthChange: ({
    from,
    to,
  }: {
    from?: number;
    to?: number;
  }) => void;
}

export const VacationLengthPicker: React.FC<
  VacationLengthPickerProps
> = ({ from = 0, to = 0, texts, onVacationLengthChange }) => {
  const [openedFrom, setOpenedFrom] = useState<boolean>(false);
  const [openedTo, setOpenedTo] = useState<boolean>(false);

  const elementRefFrom = useRef<HTMLDivElement | null>(null);
  const elementRefTo = useRef<HTMLDivElement | null>(null);

  const handleClickOutsideFrom = (ev: MouseEvent) => {
    setOpenedFrom(false);
  };
  const handleClickOutsideTo = (ev: MouseEvent) => {
    setOpenedTo(false);
  };
  useClickOutside(elementRefFrom, handleClickOutsideFrom);
  useClickOutside(elementRefTo, handleClickOutsideTo);

  const generateOptions = (
    start: number,
    end: number,
    withPlaceholder = false
  ) => {
    const options = [];

    if (withPlaceholder) {
      options.push({
        label:
          texts?.flights_vac_lenght_possibility1.translation ??
          'Based on flight dates',
        value: 'undefined',
      });
    }

    for (let i = start; i <= end; i++) {
      options.push({
        value: i,
        label: i,
      });
    }
    return options;
  };

  const contentFrom = generateOptions(1, 100, true).map(
    ({ value, label }) => (
      <ListChoice
        key={value.toString()}
        selected={from === value}
        role="checkbox"
        onClick={() => {
          onVacationLengthChange({
            from:
              value === 'undefined'
                ? undefined
                : parseInt(value.toString()),
            to:
              value === 'undefined'
                ? undefined
                : parseInt(value.toString()) > to
                ? parseInt(value.toString())
                : to,
          });
          setOpenedFrom(false);
        }}
        title={label.toString()}
      />
    )
  );

  const contentTo = generateOptions(from, 100).map(
    ({ value, label }) => (
      <ListChoice
        key={value.toString()}
        selected={to === value}
        role="checkbox"
        onClick={() => {
          onVacationLengthChange({
            to:
              value === 'undefined'
                ? undefined
                : parseInt(value.toString()),
            from,
          });
          setOpenedTo(false);
        }}
        title={label.toString()}
      />
    )
  );

  return (
    <>
      <div className="w-full flex flex-col gap-3 text-normal lg:flex-row items-start lg:items-center py-3 pl-1 vac-length">
        <Text weight="medium">
          {`${
            texts?.flights_vac_lenght_title.translation
              ? `${texts?.flights_vac_lenght_title.translation}:`
              : 'Vacation length:'
          }`}
        </Text>
        <div
          className="flex items-center text-sm"
          ref={elementRefFrom}
        >
          <Popover
            content={contentFrom}
            overlapped
            opened={openedFrom}
            maxHeight="40vh"
          >
            <ButtonPrimitive
              iconRight={<ChevronDown />}
              onClick={() => {
                setOpenedFrom(true);
              }}
            >
              {from
                ? from
                : `${
                    texts?.flights_vac_lenght_possibility1
                      .translation ?? 'Based on flight dates'
                  }`}
            </ButtonPrimitive>
          </Popover>
          {`${
            !from
              ? ''
              : from === 1
              ? texts?.flights_vac_lenght_1_night.translation ??
                'night'
              : from <= 4
              ? texts?.['flights_vac_lenght_2-4_nights']
                  .translation ?? 'nights'
              : texts?.['flights_vac_lenght_5+nights'].translation ??
                'nights'
          }`}
        </div>
        {from && from > 0 ? (
          <>
            <Text size="small">-</Text>
            <div
              className="flex items-center text-sm"
              ref={elementRefTo}
            >
              <Popover
                content={contentTo}
                overlapped
                opened={openedTo}
                maxHeight="40vh"
              >
                <ButtonPrimitive
                  iconRight={<ChevronDown />}
                  onClick={() => {
                    setOpenedTo(true);
                  }}
                >
                  {to}
                </ButtonPrimitive>
              </Popover>
              {`${
                !to
                  ? ''
                  : to === 1
                  ? texts?.flights_vac_lenght_1_night.translation ??
                    'night'
                  : to <= 4
                  ? texts?.['flights_vac_lenght_2-4_nights']
                      .translation ?? 'nights'
                  : texts?.['flights_vac_lenght_5+nights']
                      .translation ?? 'nights'
              }`}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
