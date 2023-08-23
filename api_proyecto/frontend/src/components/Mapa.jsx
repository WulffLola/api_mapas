import React, { useEffect, useRef, useState } from 'react';
import {Map } from 'leaflet';
import '../App.css';

function App() {
  const [map, setMap] = useState();
  const mapInit = useRef(false);
  useEffect(() => {
    if (!mapInit.current) {
    // Damos por inicializado el mapa
      mapInit.current = true;
      // Asignamos el contenedor del mapa
      setMap(
        new Map('map', {
          center: [-33.8678, 151.21], // Centramos en Sidney
          zoom: 15,
        }).setView([-33.8678, 151.21]) // Sidney
      )
    }
  }, [mapInit])
  return (
    <div id="map"></div>
  );
}
export default App;