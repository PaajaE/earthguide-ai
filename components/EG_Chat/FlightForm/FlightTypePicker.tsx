import { FLIGHT_TYPES, TranslateResponseBody } from '@/types';
import { Select } from '@kiwicom/orbit-components';

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
  const options = Object.keys(FLIGHT_TYPES).map((key) => {
    return {
      value: FLIGHT_TYPES[key as keyof typeof FLIGHT_TYPES],
      label:
        FLIGHT_TYPES[key as keyof typeof FLIGHT_TYPES] ===
        FLIGHT_TYPES.ROUNDTRIP
          ? texts?.flights_type_round.translation ??
            FLIGHT_TYPES.ROUNDTRIP
          : texts?.flights_type_oneway.translation ??
            FLIGHT_TYPES.ONEWAY,
    };
  });

  return (
    <>
      {/* <div className="font-semibold text-sm mb-[0.1rem]">
        {texts?.flights_type_title.translation ?? 'Flight type:'}
      </div> */}
      <div className="flex items-center space-x-1">
        <div className="relative">
          <Select
            options={options}
            value={selected}
            label={
              texts?.flights_type_title.translation ?? 'Flight type:'
            }
            inlineLabel
            onChange={(e) => {
              const val = e.target.value as FLIGHT_TYPES;
              onFlightTypeChange(val, 'flight_type');
            }}
          />
        </div>
      </div>
    </>
  );
};
