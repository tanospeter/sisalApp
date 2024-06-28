import { Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useEffect, useRef, useState } from 'react';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Map = ({ data, onAreaSelected }) => {
  const map = useMap();
  const drawControlRef = useRef(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());

  const markers = data.map((item) => ({
    id: item.entity_id,
    coordinates: [item.latitude, item.longitude],
    site_name: item.site_name,
    site_id: item.site_id,
    geology: item.geology,
    rock_age: item.rock_age
  }));

  const [center, setCenter] = useState(markers.length === 0 ? map.getCenter() : markers[0].coordinates);

  useEffect(() => {
    const maxLng = 180;
    const minLng = -180;

    if (!map.hasLayer(drawnItemsRef.current)) {
      map.addLayer(drawnItemsRef.current);
    }

    if (!drawControlRef.current) {
      drawControlRef.current = new L.Control.Draw({
        draw: {
          polygon: false,
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false,
          rectangle: true,
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          edit: false,
          remove: true, // Allow removal of drawn shapes
        }
      });
      map.addControl(drawControlRef.current);
    }

    const handleDrawCreated = (event) => {
      const { layerType, layer } = event;

      if (layerType === 'rectangle') {
        let bounds = layer.getBounds();
        let northEast = bounds.getNorthEast();
        let southWest = bounds.getSouthWest();

        // Adjust bounds if they exceed the limits
        if (northEast.lng > maxLng) northEast.lng = maxLng;
        if (southWest.lng < minLng) southWest.lng = minLng;

        bounds = L.latLngBounds(southWest, northEast);
        layer.setBounds(bounds);

        onAreaSelected({
          northEast: {
            lat: northEast.lat,
            lng: northEast.lng,
          },
          southWest: {
            lat: southWest.lat,
            lng: southWest.lng,
          },
        });

        setCenter([(southWest.lat + northEast.lat) / 2, (northEast.lng + southWest.lng) / 2]);
        // Clear previous drawings
        drawnItemsRef.current.clearLayers();
        // Add the new layer
        drawnItemsRef.current.addLayer(layer);
      }
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);

    map.setView(center, map.getZoom()); // Recenter the map to the new coordinates

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
    };
  }, [center, map, onAreaSelected]);

  return (
    <>
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.coordinates}>
          <Popup>
            <strong>site_name</strong>: {marker.site_name} <br />
            <strong>site_id</strong>: {marker.site_id} <br />
            <strong>geology</strong>: {marker.geology} <br />
            <strong>rock_age</strong>: {marker.rock_age}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Map;
