import { useState } from 'react';

interface DateValComponentProps {
  atr?: Date;
  label: string;
  onDateValClick: () => void;
}

export const DateValComponent: React.FC<DateValComponentProps> = ({
  atr,
  label,
  onDateValClick,
}) => {
  return (
    <div className="flex items-center space-x-1">
      <span>{label}</span>
      <span
        className="cursor-pointer leading-5 text-[var(--primary)] border-b-[1px] border-[var(--primary)]"
        onClick={onDateValClick}
      >
        {atr?.toLocaleDateString() ?? 'Select date'}
      </span>
    </div>
  );
};

interface VacationLengthPickerProps {
  length?: number;
  tolerance?: number;
  onVacationLengthChange: ({
    length,
    tolerance,
  }: {
    length: number;
    tolerance: number;
  }) => void;
}

export const VacationLengthPicker: React.FC<
  VacationLengthPickerProps
> = ({ length = 0, tolerance = 0, onVacationLengthChange }) => {
  const generateOptions = (start: number, end: number) => {
    const options = [];
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
      <span>Vacation length:</span>
      <div className="relative">
        <select
          className="block py-0 px-0 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-transparent border-0 border-b-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)]"
          value={length}
          onChange={(e) =>
            onVacationLengthChange({
              length: parseInt(e.target.value),
              tolerance,
            })
          }
        >
          {generateOptions(1, 100)}
        </select>
      </div>
      <span>(±</span>
      <div className="relative">
        <select
          className="block py-0 px-0 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-transparent border-0 border-b-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)]"
          value={tolerance}
          onChange={(e) =>
            onVacationLengthChange({
              tolerance: parseInt(e.target.value),
              length,
            })
          }
        >
          {generateOptions(0, 10)}
        </select>
      </div>
      <span>)</span>
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
      <label className="text-black">From:</label>
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
