import { useState,useEffect } from "react";
import {GoogleMap,useLoadScript, Marker} from "@react-google-maps/api"
// const config = require("./config");

function Map({lng,lat}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA5Lz2HeVLouUiWUm2QXErGbu8XmEl_WrM",
  }); 
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  useEffect(() => {
    if (isLoaded && !isMarkerVisible) {
      setIsMarkerVisible(true);
    }
  }, [isLoaded, isMarkerVisible]);

  
  if(!isLoaded) {return <div>Loading map...</div>;}
 



  return (
    <GoogleMap zoom={15} center={{ lat: lat, lng: lng }} id="map">
     { isMarkerVisible && <Marker position={{ lat: lat, lng: lng }} />}
    </GoogleMap>
  );
}

export default Map