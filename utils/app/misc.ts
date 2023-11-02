export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

export function extractSrcAttributesFromHTML(
  htmlString: string
): string[] {
  const srcRegex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/gi;
  const srcMatches = htmlString.match(srcRegex);

  if (srcMatches) {
    const srcAttributes = srcMatches
      .map((match) => {
        const srcAttribute = /src=['"]([^'"]+)['"]/.exec(match);
        return srcAttribute ? srcAttribute[1] : '';
      })
      .filter((item) => item.length > 0);

    return srcAttributes;
  } else {
    return [];
  }
}

export function extractGpsCoordinates(gpsString: string): {
  latitude: number;
  longitude: number;
} {
  console.log('recomputing GPS');
  if (gpsString.includes('−')) {
    console.log('gps not a number');
  }
  const [latitude, longitude] = gpsString
    .replaceAll('−', '-')
    .split(',')
    .map((coord) => {
      console.log(coord);
      console.log(coord.trim());
      return parseFloat(coord.trim());
    });

  console.log({ latitude, longitude });

  return {
    latitude,
    longitude,
  };
}
