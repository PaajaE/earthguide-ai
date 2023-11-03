import { TranslateResponseBody } from '@/types';
import { Select, Text } from '@kiwicom/orbit-components';

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
        value: i.toString(),
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
      <div className="w-full flex flex-col gap-1 text-normal items-start vac-length">
        <div className="flex items-end w-full">
          <div className={`w-full flex items-center text-sm pr-1`}>
            <Select
              label={texts?.flights_vac_lenght_title.translation}
              value={from.toString()}
              options={generateOptions(1, 100, true)}
              onChange={(event) => {
                const { value } = event.target;
                onVacationLengthChange({
                  from:
                    value === 'undefined'
                      ? undefined
                      : parseInt(value.toString()),
                  to:
                    value === 'undefined'
                      ? undefined
                      : parseInt(value.toString()) > to
                      ? parseInt(value.toString())
                      : to,
                });
              }}
              required={false}
              disabled={false}
            />
          </div>
          {from && from > 0 ? (
            <>
              <div className="mb-2.5">
                <Text size="small">-</Text>
              </div>
              <div className="w-full flex items-center text-sm pl-1">
                <Select
                  value={to.toString()}
                  options={generateOptions(1, 100, true)}
                  onChange={(event) => {
                    const { value } = event.target;
                    onVacationLengthChange({
                      to:
                        value === 'undefined'
                          ? undefined
                          : parseInt(value.toString()),
                      from,
                    });
                  }}
                  required={false}
                  disabled={false}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
