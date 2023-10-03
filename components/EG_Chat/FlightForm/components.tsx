import { TranslateResponseBody } from '@/types';

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
  const generateOptions = (
    start: number,
    end: number,
    withPlaceholder = false
  ) => {
    const options = [];

    if (withPlaceholder) {
      options.push(
        <option key={0} value={'undefined'}>
          {texts?.flights_vac_lenght_possibility1.translation ??
            'Based on flight dates'}
        </option>
      );
    }

    for (let i = start; i <= end; i++) {
      options.push(
        <option key={i} value={i}>
          {`${i} ${
            i === 1
              ? texts?.flights_vac_lenght_1_night.translation ??
                'night'
              : i <= 4
              ? texts?.['flights_vac_lenght_2-4_nights']
                  .translation ?? 'nights'
              : texts?.['flights_vac_lenght_5+nights'].translation ??
                'nights'
          }`}
        </option>
      );
    }
    return options;
  };

  return (
    <>
      <div className="font-semibold text-sm mb-[0.1rem]">
        {texts?.flights_vac_lenght_title.translation ??
          'Vacation length:'}
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-x-1">
        <div className="relative">
          <select
            className="block py-1 px-2 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
            value={from}
            onChange={(e) => {
              const val = e.target.value;
              onVacationLengthChange({
                from: val === 'undefined' ? undefined : parseInt(val),
                to: val === 'undefined' ? undefined : to,
              });
            }}
          >
            {generateOptions(1, 100, true)}
          </select>
        </div>
        {from && from > 0 ? (
          <>
            <span> - </span>
            <div className="relative">
              <select
                className="block py-1 px-2 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
                value={to}
                onChange={(e) => {
                  const val = e.target.value;
                  onVacationLengthChange({
                    to:
                      val === 'undefined' ? undefined : parseInt(val),
                    from,
                  });
                }}
              >
                {generateOptions(from, 100)}
              </select>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

interface LocationInputProps {
  radius: number;
  departureAirport?: string;
  onRadiusChange: (val: number) => void;
  onDepartureAirportChange: (val: string, name: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  departureAirport = '',
  radius,
  onRadiusChange,
  onDepartureAirportChange,
}) => {
  const handleDepartureAirportChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onDepartureAirportChange(event.target.value, 'departure_airport');
  };

  const handleRadiusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRadiusChange(+event.target.value);
  };

  return (
    <>
      <div className="text-black text-sm font-semibold mb-[0.1rem]">
        From:
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="appearance-none outline-none text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] px-2 py-1 w-auto focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
          value={departureAirport}
          size={departureAirport.length}
          onChange={handleDepartureAirportChange}
        />
        <label className="text-black px-2">
          include airports within
        </label>
        <input
          type="text"
          className="appearance-none outline-none text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] px-2 py-1 w-auto focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
          size={radius.toString().length}
          value={radius}
          onChange={handleRadiusChange}
        />
        <span className="text-black pl-2">km.</span>
      </div>
    </>
  );
};
