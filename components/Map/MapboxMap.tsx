import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the Mapbox CSS
import { destinations } from '../../mocks/map-data'; // Import your destination data

const MapboxMap: React.FC = () => {
  useEffect(() => {
    // Set your Mapbox access token here
    mapboxgl.accessToken =
      'pk.eyJ1IjoidG9tYXNwYXBpcm5payIsImEiOiJja2p5ZWlqOXUwNzNnMm9tZWk4NXF2ZWNoIn0.ayautXOLSJt0ry3tfXElbw';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 1,
      scrollZoom: false,
      attributionControl: false,
    });

    // Add zoom controls
    map.addControl(new mapboxgl.NavigationControl());

    const bounds = new mapboxgl.LngLatBounds();

    destinations.forEach((destination) => {
      const el = document.createElement('div');
      el.className = 'marker';

      el.style.width = `64px`;
      el.style.height = `64px`;

      el.style.backgroundImage = `url(${destination.imgUrl})`;
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';
      el.style.border = `5px solid`;
      el.style.borderRadius = `10px`;
      el.style.borderColor = '#e4aa5f';

      new mapboxgl.Marker(el)
        .setLngLat([destination.gps.lon, destination.gps.lat])
        .addTo(map);

      bounds.extend([destination.gps.lon, destination.gps.lat]);
    });

    map.fitBounds(bounds, {
      padding: { top: 100, bottom: 100, left: 100, right: 100 },
    });
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '50vh', borderRadius: '10px' }}>
      {/* The map will be rendered here */}
    </div>
  );
};

export default MapboxMap;
