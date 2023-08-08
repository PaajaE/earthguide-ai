import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the Mapbox CSS
import { IMapDataConverted } from '@/types';

interface Props {
  mapData: IMapDataConverted[];
}

const MapboxMap: React.FC<Props> = ({mapData}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoidG9tYXNwYXBpcm5payIsImEiOiJja2p5ZWlqOXUwNzNnMm9tZWk4NXF2ZWNoIn0.ayautXOLSJt0ry3tfXElbw';

    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 1,
        scrollZoom: false,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl());

      const bounds = new mapboxgl.LngLatBounds();

      mapData.forEach((destination) => {
        const el = document.createElement('div');
        el.className = 'marker';

        el.style.width = `64px`;
        el.style.height = `64px`;

        el.style.backgroundImage = `url(${destination.photos[0]})`;
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';
        el.style.border = `5px solid`;
        el.style.borderRadius = `10px`;
        el.style.borderColor = '#e4aa5f';

        new mapboxgl.Marker(el)
          .setLngLat([destination.gps.longitude, destination.gps.latitude])
          .addTo(map);

        bounds.extend([destination.gps.longitude, destination.gps.latitude]);
      });

      map.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ width: '100%', height: '50vh', borderRadius: '10px' }}
    >
      {/* The map will be rendered here */}
    </div>
  );
};

export default MapboxMap;
