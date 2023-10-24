import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Loader from "../Components/Loader";

function Map({ location }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  const [map, setMap] = useState(null);
  let locations = [];

  useEffect(() => {
    if (isLoaded && !isMarkerVisible) {
      setIsMarkerVisible(true);
    }
  }, [isLoaded, isMarkerVisible]);

  //Process according to the incoming data type
  if (Array.isArray(location)) {
    // If an array is passed in, use the array directly as the position
    locations = location;
  } else if (typeof location === "object") {
    // If an object is passed in, convert the object into an array
    locations = [location];
  }

  // When the map loads, adapt the view to all markers
  // Fix useEffect in Map component
  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        if (location.lat && location.lon) {
          bounds.extend(
            new window.google.maps.LatLng(location.lat, location.lon)
          );
        } else {
          console.error("Invalid location data:", location);
        }
      });
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  if (!isLoaded) {
    return <Loader />;
  }

  const mapOptions = {
    fullscreenControl: true,
    streetViewControl: false,
    zoom: 16,
  };

  return (
    <GoogleMap
      id="map"
      options={mapOptions}
      onLoad={(map) => setMap(map)} // save map instance
    >
      {isMarkerVisible &&
        locations.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lon }} />
        ))}
    </GoogleMap>
  );
}

export default Map;
