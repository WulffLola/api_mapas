import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const position = [51.505, -0.09]; // Ubicación de origen (Fiscalia)
  const [comercios, setComercios] = useState()
  const [categorias, setCategorias] = useState()

  const getInformacionInicial = async () => {
    const getComercios = await fetch('http://128.0.204.46:8010/filterbyParams/8000/fortinero/322')
    const getCategorias = await fetch('https://www.bahia.gob.ar/comercios/datos/actividades.php', {headers:{},mode: 'no-cors'})
    .then((data)=> {
      console.log(data.json() )
    })
    const resComercios = await getComercios.json()
   // const resCategorias = await getCategorias.text()
    /*
    setComercios(resComercios.data)
    setCategorias(resCategorias)*/
  }
  useEffect(() => {
    getInformacionInicial()
    console.log(categorias)
  }, [])

  if(!comercios || !categorias){
    return null
  }
  return (
    <div className="App">
      <h1>Mapa con React y Leaflet</h1>
      <MapContainer center={[comercios?.LATITUD, comercios?.LONGITUD]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker position={[comercios?.LATITUD, comercios?.LONGITUD]}>
          <Popup>
            ID: {comercios?.ID} <br/> Calle : {comercios?.CALLE} <br/> Altura: {comercios?.ALTURA}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;