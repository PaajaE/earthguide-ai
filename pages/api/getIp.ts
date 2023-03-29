export const config = {
    runtime: "edge"
};

const handler = async (): Promise<Response> => {
    try {
        const response = await fetch(`https://api.geoapify.com/v1/ipinfo?&apiKey=${process.env.IP_GEOLOCATION_API_KEY}`, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 200) {
            throw new Error("GEOAPIFY returned an error");
        }

        const json = await response.json();
        return new Response(JSON.stringify(json), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
};

export default handler;
