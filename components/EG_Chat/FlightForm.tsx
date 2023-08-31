import React, { useState } from 'react';

import { FLIGHT_TYPES, IFlightParamsConverted } from '@/types';
import {
  LocationInput,
  VacationLengthPicker,
} from './FlightForm/components';
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
  onFormSubmit: (
    data: IFlightParamsConverted,
    messageId: string,
    prevParams: IFlightParamsConverted
  ) => void;
}

export const FlightForm: React.FC<FormComponentProps> = ({
  flightParameters,
  messageId,
  onFormSubmit,
}) => {
  const [formData, setFormData] =
    useState<IFlightParamsConverted>(flightParameters);

  const handleDateChange = ({
    name,
    val,
  }: {
    name: string;
    val: Date;
  }) => {
    if (name === 'date_from') {
      setFormData({
        ...formData,
        date_from: val,
        date_to:
          formData.date_to && formData.date_to < val
            ? val
            : formData.date_to,
        return_from:
          formData.return_from && formData.return_from < val
            ? val
            : formData.return_from,
        return_to:
          formData.return_to && formData.return_to < val
            ? val
            : formData.return_to,
      });
    } else if (name === 'date_to') {
      setFormData({
        ...formData,
        date_to: val,
        date_from:
          formData.date_from && formData.date_from > val
            ? val
            : formData.date_from,
        return_to:
          formData.return_to && formData.return_to < val
            ? val
            : formData.return_to,
      });
    } else if (name === 'return_from') {
      setFormData({
        ...formData,
        return_from: val,
        return_to:
          formData.return_to && formData.return_to < val
            ? val
            : formData.return_to,
      });
    } else if (name === 'return_to') {
      setFormData({
        ...formData,
        return_to: val,
        return_from:
          formData.return_from && formData.return_from > val
            ? val
            : formData.return_from,
      });
    }
  };

  const handleChange = (val: string, name: string) => {
    setFormData({
      ...formData,
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
    setFormData({
      ...formData,
      date_to: from ? undefined : formData.date_to,
      return_from: from ? undefined : formData.return_from,
      nights_in_dst_from: from,
      nights_in_dst_to: to && from && to < (from ?? 0) ? from : to,
    });
  };

  const handleAirportChange = (selectedAirport: Airport) => {
    if (selectedAirport) {
      setFormData({
        ...formData,
        fly_from_lat: +selectedAirport.lat,
        fly_from_lon: +selectedAirport.lon,
        departure_airport: selectedAirport.name,
      });
    }
  };

  // const sortedAirports = airports.sort((a, b) =>
  //   a.name.localeCompare(b.city)
  // );

  // console.log(sortedAirports);

  return (
    <form>
      <h3 className="font-bold mb-2">Flights’ set-up:</h3>
      {/* <div className="mb-4">{flightParameters.comment}</div> */}
      <div className="text-black mb-2 text-sm">
        <FlightTypePicker
          selected={formData.flight_type}
          onFlightTypeChange={handleChange}
        />
      </div>
      <div className="text-black mb-2 text-sm">
        {/* <LocationInput
          departureAirport={formData.departure_airport}
          radius={formData.fly_from_radius}
          onRadiusChange={(val) => {
            setFormData({
              ...formData,
              ['fly_from_radius']: val,
            });
          }}
          onDepartureAirportChange={(val) => {
            setFormData({
              ...formData,
              ['departure_airport']: val,
            });
          }}
        /> */}
        <AirportSelect
          airports={airports}
          departureAirport={
            formData.departure_airport &&
            !formData.departure_airport
              ?.toLowerCase()
              .includes('your position')
              ? formData.departure_airport
              : undefined
          }
          radius={formData.fly_from_radius}
          onRadiusChange={(val) => {
            setFormData({
              ...formData,
              ['fly_from_radius']: val,
            });
          }}
          onChange={handleAirportChange}
        />
      </div>
      {formData.flight_type === FLIGHT_TYPES.ROUNDTRIP && (
        <div className="text-black mb-2">
          <VacationLengthPicker
            from={formData.nights_in_dst_from}
            to={formData.nights_in_dst_to}
            onVacationLengthChange={handleVacationLengthChange}
          />
        </div>
      )}
      <div className="text-black mb-2">
        <DepartureReturnDates
          from={formData.date_from}
          to={formData.date_to}
          labelFrom="Departure earliest"
          labelTo="Departure latest"
          fromKey="date_from"
          toKey="date_to"
          showToPicker={
            formData.nights_in_dst_from &&
            formData.nights_in_dst_from > 0 &&
            formData.flight_type === FLIGHT_TYPES.ROUNDTRIP
              ? false
              : true
          }
          minDateTo={formData.date_from}
          onDateChange={handleDateChange}
        />
      </div>

      {formData.flight_type === FLIGHT_TYPES.ROUNDTRIP && (
        <div className="text-black mb-2">
          <DepartureReturnDates
            from={formData.return_from}
            to={formData.return_to}
            labelFrom="Return earliest"
            labelTo="Return latest"
            fromKey="return_from"
            toKey="return_to"
            showFromPicker={
              formData.nights_in_dst_from &&
              formData.nights_in_dst_from > 0
                ? false
                : true
            }
            minDateFrom={formData.date_from}
            minDateTo={
              new Date(
                Math.max(
                  formData.date_from?.getTime() ??
                    new Date().getTime(),
                  formData.date_to?.getTime() ?? new Date().getTime(),
                  formData.return_from?.getTime() ??
                    new Date().getTime()
                )
              )
            }
            onDateChange={handleDateChange}
          />
        </div>
      )}

      <div className="text-black mb-2">
        <CurrencyPicker
          selected={formData.curr}
          onCurrencyChange={handleChange}
        />
      </div>

      <div>
        <button
          className="bg-[var(--primary)] text-white hover:bg-white hover:text-[var(--primary)] border-[1px] border-[var(--primary)] font-semibold py-2 px-4 mt-4 rounded-[15px]"
          onClick={(e) => {
            e.preventDefault();
            onFormSubmit(formData, messageId, flightParameters);
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
