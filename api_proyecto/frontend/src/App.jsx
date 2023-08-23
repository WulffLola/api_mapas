import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const position = [51.505, -0.09]; // Ubicación de ejemplo (latitud, longitud)
  const [data, setData] = useState()


  const traerData = async () => {
    const getData = await fetch('http://128.0.204.46:8010/filterbyParams/8000/brown/111',{ mode:'no-cors'} )
    const res = await getData.json()
    setData(res)
  }
  useEffect(() => {
    traerData()
    console.log(data)
  }, [])

  return (
    <div className="App">
      <h1>Mapa con React y Leaflet</h1>
      <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Ubicación de ejemplo <br /> Latitud: {position[0]}, Longitud: {position[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;