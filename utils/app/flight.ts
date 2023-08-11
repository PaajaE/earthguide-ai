export const getFlightDateString = (from?: string, to?: string): string => {
  if (from && to && from.length > 0 && to.length > 0 && from !== to) {
    return `${from} - ${to}`
  } else if (from && from.length > 0) {
    return from
  }
  return 'Anytime!'
}

export const getDepartureLocation = (airportSet: boolean, lon?: number, lat?: number, radius?: number, airport?: string) => {
  if (airportSet && airport && airport.length > 0) {
    return airport
  } else {
    return `${lat}, ${lon}, ${radius}`
  }
}

export const getNightsInDestination = (
  from?: number,
  to?: number
): string | null => {
  if (from && to && from > 0 && to > 0 && from !== to) {
    return `${from} - ${to}`;
  } else if (from && from > 0) {
    return from.toString();
  }
  return 'Not specified';
};