import { InputField } from '@kiwicom/orbit-components';
import { SyntheticEvent, forwardRef } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DepartureReturnDatesProps {
  from?: Date;
  to?: Date;
  fromKey: string;
  toKey: string;
  labelFrom: string;
  labelTo: string;
  showToPicker?: boolean;
  showFromPicker?: boolean;
  minDateFrom?: Date;
  minDateTo?: Date;
  onDateChange: ({ name, val }: { name: string; val: Date }) => void;
}

type ExampleCustomInputProps = {
  value?: string;
  label: string;
  onClick?: () => void;
  onChange: (e: SyntheticEvent) => void;
};

const ExampleCustomInput = forwardRef<
  HTMLInputElement,
  ExampleCustomInputProps
>(function ExampleCustomInput(
  { value, label, onClick, onChange },
  ref
) {
  return (
    <InputField
      value={value}
      label={label}
      onFocus={onClick}
      ref={ref}
      onChange={onChange}
    />
  );
});

ExampleCustomInput.displayName = 'ExampleCustomInput';

export const DepartureReturnDates: React.FC<
  DepartureReturnDatesProps
> = ({
  from,
  to,
  fromKey,
  toKey,
  labelFrom,
  labelTo,
  showToPicker = true,
  showFromPicker = true,
  minDateFrom,
  minDateTo,
  onDateChange,
}) => {
  return (
    <>
      {showFromPicker ? (
        <div className="text-sm">
          <DatePicker
            onChange={(date) => {
              onDateChange({ name: fromKey, val: date as Date });
            }}
            dateFormat="dd/MM/yyyy"
            // className="px-2 py-1 bg-white w-full border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] text-[1.05rem] text-[var(--primary)] rounded-[5px]"
            selected={from}
            placeholderText="Select date"
            minDate={minDateFrom ? minDateFrom : new Date()}
            customInput={
              // @ts-ignore
              <ExampleCustomInput label={labelFrom} />
            }
          />
        </div>
      ) : (
        <></>
      )}
      {showToPicker ? (
        <div className="text-sm">
          <DatePicker
            onChange={(date) => {
              onDateChange({ name: toKey, val: date as Date });
            }}
            dateFormat="dd/MM/yyyy"
            // className="px-2 py-1 bg-white w-full border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] text-[1.05rem] text-[var(--primary)] rounded-[5px]"
            selected={to}
            placeholderText="Select date"
            minDate={minDateTo ? minDateTo : new Date()}
            customInput={
              // @ts-ignore
              <ExampleCustomInput label={labelTo} />
            }
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
