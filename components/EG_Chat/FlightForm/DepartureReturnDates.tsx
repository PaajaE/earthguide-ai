import { useState } from 'react';
import Calendar from 'react-calendar';

interface DepartureReturnDatesProps {
  from?: Date;
  to?: Date;
  fromKey: string;
  toKey: string;
  label: string;
  labelFrom: string;
  labelTo: string;
  showToPicker?: boolean;
  showFromPicker?: boolean;
  onDateChange: ({ name, val }: { name: string; val: Date }) => void;
}

export const DepartureReturnDates: React.FC<
  DepartureReturnDatesProps
> = ({
  from,
  to,
  fromKey,
  toKey,
  labelFrom,
  labelTo,
  label,
  showToPicker = true,
  showFromPicker = true,
  onDateChange,
}) => {
  const [showCalendar, setShowCalendar] = useState<string | null>(
    null
  );

  const handleInputFocus = (inputName: string): void => {
    setShowCalendar(inputName);
  };

  return (
    <div>
      <div className="flex items-center space-x-1">
        <span className="font-semibold">{label}</span>
        {showFromPicker ? (
          <>
            <div className="flex items-center space-x-1">
              {showToPicker && <span>{labelFrom}</span>}
              <span
                className="cursor-pointer leading-5 text-[var(--primary)] border-b-[1px] border-[var(--primary)]"
                onClick={() => handleInputFocus(fromKey)}
              >
                {from?.toLocaleDateString() ?? 'Select date'}
              </span>
            </div>
            {showCalendar === fromKey && (
              <Calendar
                onChange={(date) => {
                  onDateChange({ name: fromKey, val: date as Date });
                  setShowCalendar(null);
                }}
                value={from}
              />
            )}
          </>
        ) : (
          <></>
        )}
        {showToPicker ? (
          <>
            <div className="flex items-center space-x-1">
              {showFromPicker && <span>{labelTo}</span>}
              <span
                className="cursor-pointer leading-5 text-[var(--primary)] border-b-[1px] border-[var(--primary)]"
                onClick={() => handleInputFocus(toKey)}
              >
                {to?.toLocaleDateString() ?? 'Select date'}
              </span>
            </div>
            {showCalendar === toKey && (
              <Calendar
                onChange={(date) => {
                  onDateChange({ name: toKey, val: date as Date });
                  setShowCalendar(null);
                }}
                value={to}
              />
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
