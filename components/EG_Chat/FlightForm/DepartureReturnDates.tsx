import { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DepartureReturnDatesProps {
  from?: Date;
  to?: Date;
  fromKey: string;
  toKey: string;
  label: string;
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
  label,
  showToPicker = true,
  showFromPicker = true,
  onDateChange,
}) => {
  return (
    <div>
      <div className="font-semibold text-sm mb-[0.1rem]">{label}</div>
      <div className="flex items-center space-x-1">
        {showFromPicker ? (
          <div>
            <DatePicker
              onChange={(date) => {
                onDateChange({ name: fromKey, val: date as Date });
              }}
              className="px-2 py-1 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] text-[1.05rem] text-[var(--primary)] rounded-[5px]"
              selected={from}
              placeholderText="Select date"
              minDate={new Date()}
            />
          </div>
        ) : (
          <></>
        )}
        {showToPicker ? (
          <>
            <DatePicker
              onChange={(date) => {
                onDateChange({ name: toKey, val: date as Date });
              }}
              className="px-2 py-1 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] text-[1.05rem] text-[var(--primary)] rounded-[5px]"
              selected={to}
              placeholderText="Select date"
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
