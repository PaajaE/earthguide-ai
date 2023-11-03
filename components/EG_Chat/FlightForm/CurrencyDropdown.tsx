import { currencies } from '@/mocks/currency';
import { TranslateResponseBody } from '@/types';
import { Select } from '@kiwicom/orbit-components';
import { useRef } from 'react';

interface CurrencyOption {
  value: string;
  label: string;
}

interface CurrencyPickerProps {
  selected: string;
  texts?: TranslateResponseBody<string>;
  onCurrencyChange: (val: string, name: string) => void;
}

export const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  selected,
  texts,
  onCurrencyChange,
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const currenciesDropdownOptions: CurrencyOption[] = Object.entries(
    currencies
  )
    .map(([value, label]) => ({
      value,
      label: `${value} - ${label}`,
    }))
    .sort((a, b) => {
      if (a.value === selected) {
        return -1; // Place selected value first
      } else if (b.value === selected) {
        return 1; // Place selected value first
      } else if (a.label < b.label) {
        return -1;
      } else if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

  return (
    <>
      <div className="flex items-center space-x-1" ref={elementRef}>
        <div className="relative">
          <Select
            value={selected}
            placeholder={texts?.flights_currency_title.translation}
            options={currenciesDropdownOptions}
            onChange={(event) =>
              onCurrencyChange(event.currentTarget.value, 'curr')
            }
            required={false}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
};
