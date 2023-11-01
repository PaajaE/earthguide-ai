import { TranslateResponseBody } from '@/types';
import { InputField } from '@kiwicom/orbit-components';
import useClickOutside from '@kiwicom/orbit-components/lib/hooks/useClickOutside';
import React, { useState, useEffect, useRef } from 'react';

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: string;
  lon: string;
}

interface AirportSelectProps {
  airports: Airport[];
  departureAirport?: string;
  radius: number;
  texts?: TranslateResponseBody<string>;
  onRadiusChange: (val: number) => void;
  onChange: (value: Airport) => void;
}

const AirportSelect: React.FC<AirportSelectProps> = ({
  airports,
  departureAirport,
  onChange,
  radius,
  texts,
  onRadiusChange,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    departureAirport ?? ''
  );
  const [filteredOptions, setFilteredOptions] =
    useState<Airport[]>(airports);
  const [isOpen, setIsOpen] = useState(false);
  const elementRef = useRef<HTMLUListElement | null>(null);

  const handleClickOutside = (ev: MouseEvent) => {
    console.log(ev);
    setIsOpen(false);
  };
  useClickOutside(elementRef, handleClickOutside);

  useEffect(() => {
    console.log({ departureAirport });
    setInputValue(departureAirport ?? '');
  }, [departureAirport]);

  useEffect(() => {
    const filtered = airports.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, airports]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleOptionClick = (selectedValue: Airport) => {
    console.log(selectedValue);
    setInputValue(selectedValue.name);
    setIsOpen(false);
    onChange(selectedValue);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0]);
    }
  };

  const handleRadiusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRadiusChange(+event.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-start lg:items-center">
        <div className="relative w-full mb-3">
          <InputField
            type="text"
            value={inputValue}
            label={texts?.flights_from.translation ?? 'From:'}
            inlineLabel
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e.target.value)
            }
            // className="w-full appearance-none outline-none text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] px-2 py-1 w-auto focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px] focus:rounded-b-[0]"
            onFocus={handleInputFocus}
            // onBlur={handleInputBlur}
            placeholder={`${
              texts?.flights_airports_possibility1.translation ??
              'Your position'
            }`}
            onKeyDown={handleInputKeyDown}
          />
          {isOpen && (
            <ul
              className={`absolute overflow-y-auto max-h-[200px] border-[1px] border-[var(--primary)] w-full bg-white border-t-0 top-[calc(100% - 20px)] z-[100] shadow-xl`}
              ref={elementRef}
            >
              {filteredOptions.map((option) => (
                <li
                  key={option.iata}
                  className="px-2 py-1 cursor-pointer hover:bg-[var(--secondary)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(e);
                    console.log({ option });
                    handleOptionClick(option);
                  }}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-full">
          <div className="relative w-full">
            <InputField
              type="text"
              label={
                texts?.flights_airports_title.translation ??
                'Airports within:'
              }
              inlineLabel
              // className="appearance-none outline-none text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] pl-2 py-1 w-auto focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
              // size={radius.toString().length + 3}
              value={`${radius}`}
              onChange={handleRadiusChange}
              suffix={<span className="pr-2">km</span>}
            />
            {/* <span className="absolute right-2 top-[1px] py-1 text-[var(--primary)] text-[1.05rem]">
              km
            </span> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AirportSelect;
