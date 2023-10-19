import React, { useState } from 'react';

import {
  FLIGHT_TYPES,
  IFlightParamsConverted,
  TranslateResponseBody,
} from '@/types';
import { VacationLengthPicker } from './FlightForm/components';
import { DepartureReturnDates } from './FlightForm/DepartureReturnDates';
import { CurrencyPicker } from './FlightForm/CurrencyDropdown';
import { FlightTypePicker } from './FlightForm/FlightTypePicker';
import AirportSelect, {
  Airport,
} from './FlightForm/AirportsDropdown';
import { airports } from '@/mocks/airports';

interface FormComponentProps {
  flightParameters: IFlightParamsConverted;
  messageId: string;
  texts?: TranslateResponseBody<string>;
  onChangeFlightParams: (fp: Partial<IFlightParamsConverted>) => void;
  onFormSubmit: () => void;
}

export const FlightForm: React.FC<FormComponentProps> = ({
  flightParameters,
  messageId,
  texts,
  onChangeFlightParams,
  onFormSubmit,
}) => {
  const handleDateChange = ({
    name,
    val,
  }: {
    name: string;
    val: Date;
  }) => {
    if (name === 'date_from') {
      onChangeFlightParams({
        date_from: val,
        date_to:
          flightParameters.date_to && flightParameters.date_to < val
            ? val
            : flightParameters.date_to,
        return_from:
          flightParameters.return_from &&
          flightParameters.return_from < val
            ? val
            : flightParameters.return_from,
        return_to:
          flightParameters.return_to &&
          flightParameters.return_to < val
            ? val
            : flightParameters.return_to,
      });
    } else if (name === 'date_to') {
      onChangeFlightParams({
        date_to: val,
        date_from:
          flightParameters.date_from &&
          flightParameters.date_from > val
            ? val
            : flightParameters.date_from,
        return_to:
          flightParameters.return_to &&
          flightParameters.return_to < val
            ? val
            : flightParameters.return_to,
      });
    } else if (name === 'return_from') {
      onChangeFlightParams({
        return_from: val,
        return_to:
          flightParameters.return_to &&
          flightParameters.return_to < val
            ? val
            : flightParameters.return_to,
      });
    } else if (name === 'return_to') {
      onChangeFlightParams({
        return_to: val,
        return_from:
          flightParameters.return_from &&
          flightParameters.return_from > val
            ? val
            : flightParameters.return_from,
      });
    }
  };

  const handleChange = (val: string, name: string) => {
    onChangeFlightParams({
      [name]: val,
    });
  };

  const handleVacationLengthChange = ({
    from,
    to,
  }: {
    from?: number;
    to?: number;
  }): void => {
    onChangeFlightParams({
      date_to: from ? undefined : flightParameters.date_to,
      return_from: from ? undefined : flightParameters.return_from,
      nights_in_dst_from: from,
      nights_in_dst_to: to && from && to < (from ?? 0) ? from : to,
    });
  };

  const handleAirportChange = (selectedAirport: Airport) => {
    if (selectedAirport) {
      onChangeFlightParams({
        fly_from_lat: +selectedAirport.lat,
        fly_from_lon: +selectedAirport.lon,
        departure_airport: selectedAirport.name,
      });
    }
  };

  console.log(flightParameters);

  return (
    <form>
      <div className="w-full flex justify-between">
        <div className="text-black mb-2 text-sm">
          <FlightTypePicker
            selected={flightParameters.flight_type}
            onFlightTypeChange={handleChange}
            texts={texts}
          />
        </div>
        <div className="text-black mb-2">
          <CurrencyPicker
            selected={flightParameters.curr}
            onCurrencyChange={handleChange}
            texts={texts}
          />
        </div>
      </div>
      <div className="text-black mb-2 text-sm">
        <AirportSelect
          airports={airports}
          departureAirport={
            flightParameters.departure_airport &&
            !flightParameters.departure_airport
              ?.toLowerCase()
              .includes('your position')
              ? flightParameters.departure_airport
              : undefined
          }
          radius={flightParameters.fly_from_radius}
          texts={texts}
          onRadiusChange={(val) => {
            onChangeFlightParams({
              ['fly_from_radius']: val,
            });
          }}
          onChange={handleAirportChange}
        />
      </div>
      {flightParameters.flight_type === FLIGHT_TYPES.ROUNDTRIP && (
        <div className="text-black mb-2">
          <VacationLengthPicker
            from={flightParameters.nights_in_dst_from}
            to={flightParameters.nights_in_dst_to}
            texts={texts}
            onVacationLengthChange={handleVacationLengthChange}
          />
        </div>
      )}
      <div className="w-full flex">
        <div className="text-black mb-2">
          <DepartureReturnDates
            from={flightParameters.date_from}
            to={flightParameters.date_to}
            labelFrom={`${
              texts?.flights_departure_earliest.translation ??
              'Departure earliest'
            }`}
            labelTo={`${
              texts?.flights_departure_latest.translation ??
              'Departure latest'
            }`}
            fromKey="date_from"
            toKey="date_to"
            showToPicker={
              flightParameters.nights_in_dst_from &&
              flightParameters.nights_in_dst_from > 0 &&
              flightParameters.flight_type === FLIGHT_TYPES.ROUNDTRIP
                ? false
                : true
            }
            minDateTo={flightParameters.date_from}
            onDateChange={handleDateChange}
          />
        </div>

        {flightParameters.flight_type === FLIGHT_TYPES.ROUNDTRIP && (
          <div className="text-black mb-2">
            <DepartureReturnDates
              from={flightParameters.return_from}
              to={flightParameters.return_to}
              labelFrom={`${
                texts?.flights_return_earliest.translation ??
                'Return earliest'
              }`}
              labelTo={`${
                texts?.flights_return_latest.translation ??
                'Return latest'
              }`}
              fromKey="return_from"
              toKey="return_to"
              showFromPicker={
                flightParameters.nights_in_dst_from &&
                flightParameters.nights_in_dst_from > 0
                  ? false
                  : true
              }
              minDateFrom={flightParameters.date_from}
              minDateTo={
                new Date(
                  Math.max(
                    flightParameters.date_from?.getTime() ??
                      new Date().getTime(),
                    flightParameters.date_to?.getTime() ??
                      new Date().getTime(),
                    flightParameters.return_from?.getTime() ??
                      new Date().getTime()
                  )
                )
              }
              onDateChange={handleDateChange}
            />
          </div>
        )}
      </div>

      <div>
        <button
          className="bg-[var(--primary)] text-white hover:bg-white hover:text-[var(--primary)] border-[1px] border-[var(--primary)] font-semibold py-2 px-4 mt-4 rounded-[15px]"
          onClick={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
        >
          {texts?.flights_search_button.translation ?? 'Search'}
        </button>
      </div>
    </form>
  );
};
