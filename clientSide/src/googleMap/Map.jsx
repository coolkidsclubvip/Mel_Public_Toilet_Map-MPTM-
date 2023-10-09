import { useState,useEffect } from "react";
import {GoogleMap,useLoadScript, Marker} from "@react-google-maps/api"


function Map({lng,lat}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  }); 
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  useEffect(() => {
    if (isLoaded && !isMarkerVisible) {
      setIsMarkerVisible(true);
    }
  }, [isLoaded, isMarkerVisible]);

  
  if(!isLoaded) {return <div>Loading map...</div>;}
 


  // console.log("lat:", lat);
  // console.log("lng:", lng);
  const mapOptions = {
    zoom: 15,
    center: { lat: lat, lng: lng },
    fullscreenControl: true, // full screen control button
    streetViewControl: false, //no show street view
  };

  return (
    <GoogleMap id="map" options={mapOptions}>
      {isMarkerVisible && <Marker position={{ lat: lat, lng: lng }} />}
    </GoogleMap>
  );
}

export default Map