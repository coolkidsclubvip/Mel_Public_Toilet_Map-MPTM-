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
 

// {{lat:`${lat}`, lng:`${lon}`}}
  console.log("lat:", lat);
  console.log("lng:", lng);

  return (
    <GoogleMap zoom={15} center={{ lat: lat, lng: lng }} id="map">
     { isMarkerVisible && <Marker position={{ lat: lat, lng: lng }} />}
    </GoogleMap>
  );
}

export default Map