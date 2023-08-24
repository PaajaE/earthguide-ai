interface VacationLengthPickerProps {
  from?: number;
  to?: number;
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
> = ({ from = 0, to = 0, onVacationLengthChange }) => {
  const generateOptions = (start: number, end: number) => {
    const options = [];

    options.push(
      <option key={0} value={'undefined'}>
        not defined
      </option>
    );

    for (let i = start; i <= end; i++) {
      options.push(
        <option key={i} value={i}>
          {`${i} days`}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="flex items-center space-x-1">
      <span className="font-semibold">Vacation length:</span>
      <div className="relative">
        <select
          className="block py-0 px-0 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-transparent border-0 border-b-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)]"
          value={from}
          onChange={(e) => {
            const val = e.target.value;
            onVacationLengthChange({
              from: val === 'undefined' ? undefined : parseInt(val),
              to: val === 'undefined' ? undefined : to,
            });
          }}
        >
          {generateOptions(1, 100)}
        </select>
      </div>
      {from && from > 0 ? (
        <>
          <span> - </span>
          <div className="relative">
            <select
              className="block py-0 px-0 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-transparent border-0 border-b-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)]"
              value={to}
              onChange={(e) => {
                const val = e.target.value;
                onVacationLengthChange({
                  to: val === 'undefined' ? undefined : parseInt(val),
                  from,
                });
              }}
            >
              {generateOptions(from + 1, 100)}
            </select>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

interface LocationInputProps {
  radius: number;
  locality?: string;
  onRadiusChange: (val: number) => void;
  onLocationChange: (val: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  locality = '',
  radius,
  onRadiusChange,
  onLocationChange,
}) => {
  const handleLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onLocationChange(event.target.value);
  };

  const handleRadiusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRadiusChange(+event.target.value);
  };

  return (
    <div className="flex items-center space-x-1">
      <label className="text-black font-semibold">From:</label>
      <input
        type="text"
        className="appearance-none outline-none text-[var(--primary)] leading-5 bg-transparent border-0 border-b-[1px] border-[var(--primary)] px-1 py-0 w-auto focus:outline-none focus:ring-0 focus:border-[var(--primary)]"
        value={locality}
        size={locality.length}
        onChange={handleLocationChange}
      />
      <label className="text-black pl-6">Radius:</label>
      <input
        type="text"
        className="appearance-none outline-none text-[var(--primary)] leading-5 bg-transparent border-0 border-b-[1px] border-[var(--primary)] px-1 py-0 w-auto focus:outline-none focus:ring-0 focus:border-[var(--primary)]"
        size={radius.toString().length}
        value={radius}
        onChange={handleRadiusChange}
      />
      <span className="text-black">km</span>
    </div>
  );
};
