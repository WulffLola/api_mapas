import Mapa from './components/Mapa';
import CargaOficios from './components/CargaOficios'
import HojaDeRuta from './components/HojaDeRuta';
import { AppProvider } from './context/MyContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useParams } from 'react-router';


function App() {
 return (
  <AppProvider>
    <BrowserRouter>
      <Routes>
            <Route path="planificador" element={<Mapa />}/>
            <Route path="cargaroficio" element={<CargaOficios/>} />
            <Route path="verhojaruta/:id" element={<HojaDeRuta/>} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
 )
}

export default App;