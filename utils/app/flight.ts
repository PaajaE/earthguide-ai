export const getFlightDateString = (
  from?: string,
  to?: string
): string => {
  if (from && to && from.length > 0 && to.length > 0 && from !== to) {
    return `${from} - ${to}`;
  } else if (from && from.length > 0) {
    return from;
  }
  return 'Anytime!';
};

export const getDepartureLocation = (
  airportSet: boolean,
  lon?: number,
  lat?: number,
  radius?: number,
  airport?: string
) => {
  if (airportSet && airport && airport.length > 0) {
    return airport;
  } else {
    return `${lat}, ${lon}, ${radius}`;
  }
};

export const getNightsInDestination = (
  from: number = 0,
  to: number = 0
): number => {
  return (from + to) / 2;
};

export const getNightsInDestinationTolerance = (
  from: number = 0,
  to: number = 0
): number => {
  return (to - from) / 2;
};

export const parseLocation = (
  input: string
): {
  latitude?: number;
  longitude?: number;
  cityName?: string;
} => {
  // Regular expression to match various delimiters with optional spaces: , or - or ; or space
  const delimiterRegex = /[,\s;]+/;

  const parts = input
    .split(delimiterRegex)
    .map((part) => part.trim());

  console.log({ parts });
  // Check if the input looks like GPS coordinates
  if (
    parts.length === 2 &&
    !isNaN(parseFloat(parts[0])) &&
    !isNaN(parseFloat(parts[1]))
  ) {
    const latitude = parseFloat(parts[0]);
    const longitude = parseFloat(parts[1]);
    return { latitude, longitude };
  } else {
    // If not GPS coordinates, assume it's a city name
    const cityName = input;
    return { cityName };
  }
};

export function formatDateToYYYYMMDD(
  date?: Date
): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
