import { TranslateResponseBody } from '@/types';
import { InputGroup, Select } from '@kiwicom/orbit-components';

interface VacationLengthPickerProps {
  from?: number;
  to?: number;
  texts?: TranslateResponseBody<string>;
  onVacationLengthChange: ({
    from,
    to,
  }: {
    from?: number;
    to?: number;
  }) => void;
}

export const VacationLengthPicker: React.FC<
  VacationLengthPickerProps
> = ({ from = 0, to = 0, texts, onVacationLengthChange }) => {
  const generateOptions = (
    start: number,
    end: number,
    withPlaceholder = false
  ) => {
    const options = [];

    if (withPlaceholder) {
      options.push({
        label:
          texts?.flights_vac_lenght_possibility1.translation ??
          'Based on flight dates',
        value: 'undefined',
      });
    }

    for (let i = start; i <= end; i++) {
      options.push({
        value: i,
        label: `${i} ${
          i === 1
            ? texts?.flights_vac_lenght_1_night.translation ?? 'night'
            : i <= 4
            ? texts?.['flights_vac_lenght_2-4_nights'].translation ??
              'nights'
            : texts?.['flights_vac_lenght_5+nights'].translation ??
              'nights'
        }`,
      });
    }
    return options;
  };

  return (
    <>
      <div className="w-1/2 flex flex-col lg:flex-row items-start lg:items-center space-x-1">
        <InputGroup
          flex="1 1 auto"
          label={
            texts?.flights_vac_lenght_title.translation ??
            'Vacation length:'
          }
          error=""
          help=""
          disabled={false}
          size="small"
        >
          <Select
            // className="block py-1 px-2 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
            value={from}
            options={generateOptions(1, 100, true)}
            onChange={(e) => {
              const val = e.target.value;
              onVacationLengthChange({
                from: val === 'undefined' ? undefined : parseInt(val),
                to: val === 'undefined' ? undefined : to,
              });
            }}
          />
          {from && from > 0 ? (
            <Select
              // className="block py-1 px-2 w-full cursor-pointer font-normal text-[var(--primary)] leading-5 bg-white border-[1px] border-[var(--primary)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--primary)] rounded-[5px]"
              value={to}
              options={generateOptions(from, 100)}
              onChange={(e) => {
                const val = e.target.value;
                onVacationLengthChange({
                  to: val === 'undefined' ? undefined : parseInt(val),
                  from,
                });
              }}
            />
          ) : (
            <></>
          )}
        </InputGroup>
      </div>
    </>
  );
};
