import { currencies } from '@/mocks/currency';
import { TranslateResponseBody } from '@/types';
import {
  ButtonPrimitive,
  ListChoice,
  Popover,
  Select,
} from '@kiwicom/orbit-components';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';
import { useState } from 'react';

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
  const [opened, setOpened] = useState<boolean>(false);
  const content = currenciesDropdownOptions.map(
    ({ value, label }) => (
      <ListChoice
        key={value}
        selected={selected === value}
        role="checkbox"
        onClick={() => {
          onCurrencyChange(value, 'curr');
          setOpened(false);
        }}
        title={label}
      />
    )
  );

  return (
    <>
      <div className="flex items-center space-x-1">
        <div className="relative">
          <Popover
            content={content}
            overlapped
            opened={opened}
            maxHeight="40vh"
            placement="bottom-end"
          >
            <ButtonPrimitive
              iconRight={<ChevronDown />}
              onClick={() => {
                setOpened(true);
              }}
            >
              {selected.length > 0
                ? selected
                : texts?.flights_currency_title.translation ??
                  'Currency:'}
            </ButtonPrimitive>
          </Popover>
        </div>
      </div>
    </>
  );
};
