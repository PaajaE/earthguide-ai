import { FLIGHT_TYPES, TranslateResponseBody } from '@/types';
import {
  Select,
} from '@kiwicom/orbit-components';

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
  return (
    <>
      <div className="flex items-center min-w-[150px]">
        <Select
          value={selected}
          options={[
            {
              label: texts?.flights_type_oneway.translation,
              value: FLIGHT_TYPES.ONEWAY,
            },
            {
              label: texts?.flights_type_round.translation,
              value: FLIGHT_TYPES.ROUNDTRIP,
            },
          ]}
          onChange={(event) => {
            console.log(event.target.value);
            onFlightTypeChange(
              event.target.value as FLIGHT_TYPES,
              'flight_type'
            );
          }}
          inlineLabel
          required={false}
          disabled={false}
        />
      </div>
    </>
  );
};
