import { currencies } from '@/mocks/currency';
import { TranslateResponseBody } from '@/types';
import { Select } from '@kiwicom/orbit-components';

interface CurrencyOption {
  value: string;
  label: string;
}

const currenciesDropdownOptions: CurrencyOption[] = Object.entries(
  currencies
).map(([value, label]) => ({
  value,
  label,
}));

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
  return (
    <>
      <div className="flex items-center space-x-1">
        <div className="relative">
          <Select
            options={currenciesDropdownOptions}
            value={selected}
            label={
              texts?.flights_currency_title.translation ?? 'Currency:'
            }
            inlineLabel
            onChange={(e) => {
              const val = e.target.value;
              onCurrencyChange(val, 'curr');
            }}
          />
        </div>
      </div>
    </>
  );
};
