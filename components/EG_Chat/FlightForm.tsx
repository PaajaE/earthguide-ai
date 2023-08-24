import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

import { IFlightParamsConverted } from '@/types';
import {
  LocationInput,
  VacationLengthPicker,
} from './FlightForm/components';
import { DepartureReturnDates } from './FlightForm/DepartureReturnDates';

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
    setFormData({
      ...formData,
      [name]: val,
    });
  };

  const handleLocationChange = (val: string) => {
    setFormData({
      ...formData,
      ['locality']: val,
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
      nights_in_dst_to:
        to && from && to <= (from ?? 0) ? from + 1 : to,
    });
  };

  return (
    <form>
      <h3 className="font-bold mb-2">Flights’ set-up:</h3>
      <div className="mb-2">{flightParameters.comment}</div>
      <div className="text-black mb-1">
        <LocationInput
          locality={formData.locality}
          radius={formData.fly_from_radius}
          onRadiusChange={(val) => {
            setFormData({
              ...formData,
              ['fly_from_radius']: val,
            });
          }}
          onLocationChange={handleLocationChange}
        />
      </div>
      <div className="text-black mb-1">
        <VacationLengthPicker
          from={formData.nights_in_dst_from}
          to={formData.nights_in_dst_to}
          onVacationLengthChange={handleVacationLengthChange}
        />
      </div>
      <div className="text-black mb-1">
        <DepartureReturnDates
          from={formData.date_from}
          to={formData.date_to}
          labelFrom="Earliest"
          labelTo="Latest"
          label="Departure:"
          fromKey="date_from"
          toKey="date_to"
          showToPicker={
            formData.nights_in_dst_from &&
            formData.nights_in_dst_from > 0
              ? false
              : true
          }
          onDateChange={handleDateChange}
        />
      </div>

      <div className="text-black mb-1">
        <DepartureReturnDates
          from={formData.return_from}
          to={formData.return_to}
          labelFrom="Earliest"
          labelTo="Latest"
          label="Return:"
          fromKey="return_from"
          toKey="return_to"
          showFromPicker={
            formData.nights_in_dst_from &&
            formData.nights_in_dst_from > 0
              ? false
              : true
          }
          onDateChange={handleDateChange}
        />
      </div>

      <div>
        <button
          className="bg-transparent hover:bg-[var(--secondary)] text-[var(--primary)] border-2 border-[var(--primary)] font-bold py-2 px-4 mt-4 rounded-[15px]"
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
