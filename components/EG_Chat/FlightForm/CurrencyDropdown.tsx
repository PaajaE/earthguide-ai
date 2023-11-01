import { currencies } from '@/mocks/currency';
import { TranslateResponseBody } from '@/types';
import {
  ButtonPrimitive,
  ListChoice,
  Popover,
  Select,
} from '@kiwicom/orbit-components';
import useClickOutside from '@kiwicom/orbit-components/lib/hooks/useClickOutside';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';
import { useRef, useState } from 'react';

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
  const [opened, setOpened] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const currenciesDropdownOptions: CurrencyOption[] = Object.entries(
    currencies
  )
    .map(([value, label]) => ({
      value,
      label: `${label} - ${value}`,
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

  const handleClickOutside = (ev: MouseEvent) => {
    setOpened(false);
  };
  useClickOutside(elementRef, handleClickOutside);

  const content = currenciesDropdownOptions.map(
    ({ value, label }) => (
      <ListChoice
        key={`${label}-${value}`}
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
      <div className="flex items-center space-x-1" ref={elementRef}>
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
