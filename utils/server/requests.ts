// function that will get the user's IP address from `https://api.geoapify.com/v1/ipinfo?&apiKey=12ce59f76de1435e87e69ec2085a6758` returning a Promise
export const fetchIpData = (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    fetch(`https://ipapi.co/json/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          reject();
        }

        return response.json();
      })
      .then((data: any) => {
        if (!data) {
          reject();
        }

        resolve(data);
      })
      .catch(() => {
        reject();
      });
  });
};

import { TranslateRequestBody, TranslateResponseBody } from '@/types';

export const fetchTranslation = (
  requestBody: TranslateRequestBody
): Promise<TranslateResponseBody<string>> => {
  return new Promise<TranslateResponseBody<string>>(
    (resolve, reject) => {
      fetch('/api/eg-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            reject();
          }

          return response.json();
        })
        .then((data: TranslateResponseBody<string>) => {
          if (!data) {
            reject();
          }

          console.log({ translation: data });

          resolve(data);
        })
        .catch(() => {
          reject();
        });
    }
  );
};
