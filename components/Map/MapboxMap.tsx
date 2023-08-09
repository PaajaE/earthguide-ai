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
        // scrollZoom: false,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl());

      const bounds = new mapboxgl.LngLatBounds();

      mapData.forEach((destination) => {
        const el = document.createElement('div');
        el.className = 'marker';

        // el.style.width = `64px`;
        el.style.minHeight = `120px`;
        el.style.minWidth = `160px`;


        el.style.backgroundColor = '#e2e2e2';
        el.style.backgroundImage = `linear-gradient(to top, rgba(78, 78, 78, 0.43) 0%, rgba(255, 255, 255, 0) 40%), url(${
          destination.photos[0] ??
          'https://fakeimg.pl/160x120/cccccc/909090?text=~'
        })`;
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';
        el.style.border = `5px solid`;
        el.style.borderRadius = `10px`;
        el.style.borderColor = 'var(--tertiary)';
        el.style.display = 'flex'
        el.style.alignItems = 'end'
        el.style.padding = '2px 6px'

        var foot = document.createElement('div');
        foot.className = 'foot';
        el.appendChild(foot);


        const price = 'CZK 3500'

        const elChild = `<div style='display: block;'><div style='color: var(--primary-text); font-weight: 700; line-height: 1em;'>${destination.locationTitle}</div><div style='color: var(--primary-text);'>${price}</div></div>`;

        el.innerHTML += elChild;

        new mapboxgl.Marker(el, {
          anchor: 'bottom',
          offset: [0, -5]
        })
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
