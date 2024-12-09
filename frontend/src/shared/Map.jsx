import React, { useEffect } from "react";

const Map = ({ location }) => {
  const { lat, lng } = location;

  useEffect(() => {
    if (window.google) {
      const mapOptions = {
        center: { lat, lng },
        zoom: 15,
        mapTypeId: "roadmap",
      };

      const map = new window.google.maps.Map(document.getElementById("map"), mapOptions);

      new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });
    }
  }, [lat, lng]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default Map;
