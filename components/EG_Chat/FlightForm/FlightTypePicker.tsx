import { FLIGHT_TYPES, TranslateResponseBody } from '@/types';
import {
  ButtonPrimitive,
  ListChoice,
  Popover,
  Select,
} from '@kiwicom/orbit-components';
import useClickOutside from '@kiwicom/orbit-components/lib/hooks/useClickOutside';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';
import { useRef, useState } from 'react';

interface FlightTypePickerProps {
  selected: string;
  texts?: TranslateResponseBody<string>;
  onFlightTypeChange: (val: FLIGHT_TYPES, name: string) => void;
}

export const FlightTypePicker: React.FC<FlightTypePickerProps> = ({
  selected,
  onFlightTypeChange,
  texts,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (ev: MouseEvent) => {
    console.log(ev);
    setOpened(false);
  };
  useClickOutside(elementRef, handleClickOutside);

  const content = Object.keys(FLIGHT_TYPES).map((key) => (
    <ListChoice
      key={key}
      selected={selected === key}
      role="checkbox"
      onClick={() => {
        onFlightTypeChange(
          FLIGHT_TYPES[key as keyof typeof FLIGHT_TYPES],
          'flight_type'
        );
        setOpened(false);
      }}
      title={
        FLIGHT_TYPES[key as keyof typeof FLIGHT_TYPES] ===
        FLIGHT_TYPES.ROUNDTRIP
          ? texts?.flights_type_round.translation ??
            FLIGHT_TYPES.ROUNDTRIP
          : texts?.flights_type_oneway.translation ??
            FLIGHT_TYPES.ONEWAY
      }
    />
  ));

  return (
    <>
      <div className="flex items-center" ref={elementRef}>
        <Popover content={content} overlapped opened={opened}>
          <ButtonPrimitive
            iconRight={<ChevronDown />}
            onClick={() => {
              setOpened(true);
            }}
          >
            {selected === FLIGHT_TYPES.ROUNDTRIP
              ? texts?.flights_type_round.translation ??
                FLIGHT_TYPES.ROUNDTRIP
              : texts?.flights_type_oneway.translation ??
                FLIGHT_TYPES.ONEWAY}
          </ButtonPrimitive>
        </Popover>
      </div>
    </>
  );
};
