import { EarthGuideQuestionBody, EarthGuideQuestionResponse } from "@/types";

export const fetchEGQuestion = (
    requestBody: EarthGuideQuestionBody
): Promise<EarthGuideQuestionResponse> => {
    return new Promise<EarthGuideQuestionResponse>((resolve, reject) => {
        fetch("/api/eg-question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    reject();
                }

                return response.json();
            })
            .then((data: EarthGuideQuestionResponse) => {
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

// function that will get the user's IP address from /api/getIp returning a Promise
export const fetchIpData = (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        fetch("/api/getIp")
            .then((response) => {
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