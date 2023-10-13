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

  // 根据传入的数据类型进行处理
  if (Array.isArray(location)) {
    // 如果传入的是数组，直接使用该数组作为位置
    locations = location;
  } else if (typeof location === "object") {
    // 如果传入的是对象，将对象转化为数组
    locations = [location];
  }

  // 当地图加载后，适应所有标记的视图
  // 在 Map 组件中修复 useEffect
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
      onLoad={(map) => setMap(map)} // 保存地图实例
    >
      {isMarkerVisible &&
        locations.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lon }} />
        ))}
    </GoogleMap>
  );
}

export default Map;
