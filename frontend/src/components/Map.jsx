

import { Marker, useMap, Popup } from 'react-leaflet';
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
    coordinates: [item.latitude, item.longitude],
    site_name: item.site_name,
    site_id: item.site_id,
    geology: item.geology,
    rock_age: item.rock_age
  }));

  var center = markers.length == 0 ? [51.505, -0.09] : markers[0].coordinates;

  useEffect(() => {
    map.setView(center, map.getZoom()); // Recenter the map to the new coordinates
  }, [center, map]);

  return (<>
    {markers.map((marker) => (
      <Marker key={marker.id} position={marker.coordinates}>
        <Popup>
        <strong>Site Name</strong>: {marker.site_name} <br/> <strong>Site ID</strong>: {marker.site_id} <br/> <strong>Geology</strong>: {marker.geology} <br/> <strong>Rock age</strong>: {marker.rock_age}
        </Popup>
      </Marker>
    ))}
  </>
  );
};

export default Map;
