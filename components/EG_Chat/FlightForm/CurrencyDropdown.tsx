import { currencies } from '@/mocks/currency';
import { TranslateResponseBody } from '@/types';

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
      <div className="font-semibold text-sm mb-[0.1rem]">
        {texts?.flights_currency_title.translation ?? 'Currency:'}
      </div>
      <div className="flex items-center space-x-1">
        <div className="relative">
          <select
            className="block py-1 px-2 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
            value={selected}
            onChange={(e) => {
              const val = e.target.value;
              onCurrencyChange(val, 'curr');
            }}
          >
            {currenciesDropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
