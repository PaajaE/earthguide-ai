import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { IFlightParamsConverted } from '@/types';
import {
  DateValComponent,
  LocationInput,
  VacationLengthPicker,
} from './FlightForm/components';

interface FormComponentProps {
  flightParameters: IFlightParamsConverted;
  messageId: string;
  onFormSubmit: (
    data: IFlightParamsConverted,
    messageId: string
  ) => void;
}

export const FlightForm: React.FC<FormComponentProps> = ({
  flightParameters,
  messageId,
  onFormSubmit,
}) => {
  const [formData, setFormData] =
    useState<IFlightParamsConverted>(flightParameters);
  const [showCalendar, setShowCalendar] = useState<string | null>(
    null
  );

  const handleDateChange = (name: string, date: Date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleInputFocus = (inputName: string) => {
    setShowCalendar(inputName);
  };

  const handleLocationChange = (val: string) => {
    setFormData({
      ...formData,
      ['locality']: val,
    });
  };

  const handleVacationLengthChange = ({
    length,
    tolerance,
  }: {
    length: number;
    tolerance: number;
  }) => {
    setFormData({
      ...formData,
      nights_in_dst_tolerance: tolerance,
      nights_in_dst: length,
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
        <DateValComponent
          atr={formData.date_from}
          label="Earliest departure:"
          onDateValClick={() => {
            handleInputFocus('date_from');
          }}
        />
        {showCalendar === 'date_from' && (
          <Calendar
            onChange={(date) => {
              handleDateChange('date_from', date as Date);
              setShowCalendar(null);
            }}
            value={formData.date_from}
          />
        )}
      </div>
      <div className="text-black mb-1">
        <DateValComponent
          atr={formData.date_to}
          label="Latest departure:"
          onDateValClick={() => {
            handleInputFocus('date_to');
          }}
        />
        {showCalendar === 'date_to' && (
          <Calendar
            onChange={(date) => {
              handleDateChange('date_to', date as Date);
              setShowCalendar(null);
            }}
            value={formData.date_to}
          />
        )}
      </div>
      <div className="text-black mb-1">
        <DateValComponent
          atr={formData.return_from}
          label="Earliest return:"
          onDateValClick={() => {
            handleInputFocus('return_from');
          }}
        />
        {showCalendar === 'return_from' && (
          <Calendar
            onChange={(date) => {
              handleDateChange('return_from', date as Date);
              setShowCalendar(null);
            }}
            value={formData.return_from}
          />
        )}
      </div>
      <div className="text-black mb-1">
        <DateValComponent
          atr={formData.return_to}
          label="Latest return:"
          onDateValClick={() => {
            handleInputFocus('return_to');
          }}
        />
        {showCalendar === 'return_to' && (
          <Calendar
            onChange={(date) => {
              handleDateChange('return_to', date as Date);
              setShowCalendar(null);
            }}
            value={formData.return_to}
          />
        )}
      </div>
      <div className="text-black mb-1">
        <VacationLengthPicker
          length={formData.nights_in_dst}
          tolerance={formData.nights_in_dst_tolerance}
          onVacationLengthChange={handleVacationLengthChange}
        />
      </div>
      <div>
        <button
          className="bg-transparent hover:bg-[var(--secondary)] text-[var(--primary)] border-2 border-[var(--primary)] font-bold py-2 px-4 mt-4 rounded-[15px]"
          onClick={(e) => {
            e.preventDefault();
            onFormSubmit(formData, messageId);
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
