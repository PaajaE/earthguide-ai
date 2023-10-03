import { FLIGHT_TYPES, TranslateResponseBody } from '@/types';

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
      <div className="font-semibold text-sm mb-[0.1rem]">
        {texts?.flights_type_title.translation ?? 'Flight type:'}
      </div>
      <div className="flex items-center space-x-1">
        <div className="relative">
          <select
            className="block py-1 px-2 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
            value={selected}
            onChange={(e) => {
              const val = e.target.value as FLIGHT_TYPES;
              onFlightTypeChange(val, 'flight_type');
            }}
          >
            {Object.keys(FLIGHT_TYPES).map((key) => (
              <option
                key={key}
                value={FLIGHT_TYPES[key as keyof typeof FLIGHT_TYPES]}
              >
                {FLIGHT_TYPES[key as keyof typeof FLIGHT_TYPES] ===
                FLIGHT_TYPES.ROUNDTRIP
                  ? texts?.flights_type_round.translation ??
                    FLIGHT_TYPES.ROUNDTRIP
                  : texts?.flights_type_oneway.translation ??
                    FLIGHT_TYPES.ONEWAY}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
