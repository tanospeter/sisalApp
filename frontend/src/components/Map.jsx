

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Map = ({ data }) => {
  const map = useMap();
  const markers = data.map((item) => ({
    id: item.entity_id,
    coordinates: [item.latitude, item.longitude]
  }));

  // const markers = [
  //     { id: 1, coordinates: ['51.505', '-0.09'] }, // London
  //     { id: 2, coordinates: ['40.7128', '-74.0060'] }, // New York
  //     { id: 3, coordinates: [34.0522, -118.2437] }, // Los Angeles
  //   ];

  var center = markers.length == 0 ? [51.505, -0.09] : markers[0].coordinates;

  useEffect(() => {
    map.setView(center, map.getZoom()); // Recenter the map to the new coordinates
  }, [center, map]);

  return (<>
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.coordinates} />
      ))}
      </>
  );
};

export default Map;
