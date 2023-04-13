import { EarthGuideQuestionBody, EarthGuideQuestionResponse } from "@/types";

export const config = {
    runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
    try {
        const requestBody = (await req.json()) as EarthGuideQuestionBody;
        console.log(requestBody)

        const response = await fetch("https://api.earth.guide/api/question_api", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "earthguide-api-key": "6fdb15a8-23e4-405c-a495-c23ca0d1871d",
                "earthguide-client": "pwa",
            },
            body: JSON.stringify(requestBody),
        });
        console.log(response)

        if (response.status !== 200) {
            throw new Error("Earth.Guide API returned an error");
        }

        const json: EarthGuideQuestionResponse = await response.json();

        return new Response(JSON.stringify(json), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
};

export default handler;
