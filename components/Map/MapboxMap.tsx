import React, {
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the Mapbox CSS
import { IMapDataConverted } from '@/types';

interface Props {
  mapData: IMapDataConverted[];
  isMobile: boolean;
}

mapboxgl.accessToken =
  'pk.eyJ1IjoidG9tYXNwYXBpcm5payIsImEiOiJja2p5ZWlqOXUwNzNnMm9tZWk4NXF2ZWNoIn0.ayautXOLSJt0ry3tfXElbw';

const MapboxMap: React.FC<Props> = ({ mapData, isMobile }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const initMap = useCallback(
    (ref: HTMLElement) => {
      const map = new mapboxgl.Map({
        container: ref,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 1,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl());

      map.on('wheel', (event) => {
        if (event.originalEvent.ctrlKey) {
          return;
        }

        if (event.originalEvent.metaKey) {
          return;
        }

        if (event.originalEvent.altKey) {
          return;
        }

        event.preventDefault();
      });

      const bounds = new mapboxgl.LngLatBounds();

      mapData.forEach((destination) => {
        if (destination) {
          if (
            Number.isNaN(destination.gps.latitude) ||
            Number.isNaN(destination.gps.longitude)
          ) {
            return;
          } else if (
            destination &&
            typeof destination.gps.latitude === 'number' &&
            typeof destination.gps.longitude === 'number'
          ) {
            const el = document.createElement('div');
            el.className =
              'marker h-20 w-20 lg:h-unset lg:w-auto lg:min-w-[160px] lg:max-w-[200px] lg:min-h-[120px]';
            if (destination.flightUrl) {
              el.onclick = (ev: MouseEvent) => {
                window.open(destination.flightUrl);
              };
            }

            el.style.backgroundColor = '#e2e2e2';
            if (isMobile) {
              el.style.backgroundImage = `linear-gradient(to top, rgba(78, 78, 78, 0.43) 0%, rgba(255, 255, 255, 0) 80%), url(${
                destination.photos[0] ?? '/plane.jpg '
              })`;
            } else {
              el.style.backgroundImage = `linear-gradient(to top, rgba(78, 78, 78, 0.43) 0%, rgba(255, 255, 255, 0) 40%), url(${
                destination.photos[0] ?? '/plane.jpg '
              })`;
            }

            el.style.backgroundRepeat = 'no-repeat';
            el.style.backgroundPosition = 'center';
            el.style.backgroundSize = 'cover';
            el.style.cursor = destination.flightUrl
              ? 'pointer'
              : 'not-allowed';
            el.style.border = `5px solid`;
            el.style.borderRadius = `10px`;
            el.style.borderColor = 'var(--tertiary)';
            el.style.display = 'flex';
            el.style.alignItems = 'end';
            el.style.padding = '2px 6px';

            var foot = document.createElement('div');
            foot.className = 'foot';
            el.appendChild(foot);

            let elChild = `<div style='display: block;'><div style='color: white; font-weight: 700; ${
              destination.price.length > 0
                ? 'line-height: 1em;'
                : 'line-height: 2em;'
            }'>${destination.locationTitle}</div>`;
            elChild +=
              destination.price.length > 0
                ? `<div style='color: white; font-size: x-small lg:small'>${destination.price}</div>`
                : '';
            elChild += '</div>';

            el.innerHTML += elChild;

            new mapboxgl.Marker(el, {
              anchor: 'bottom',
              offset: [0, -5],
            })
              .setLngLat([
                destination.gps.longitude,
                destination.gps.latitude,
              ])
              .addTo(map);

            bounds.extend([
              destination.gps.longitude,
              destination.gps.latitude,
            ]);
          }
        } else {
          return;
        }
      });

      map.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        maxZoom: 8,
      });
    },
    [mapData]
  );

  useEffect(() => {
    if (mapContainerRef.current) {
      initMap(mapContainerRef.current);
    }
  }, [initMap]);

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

export default memo(MapboxMap);
