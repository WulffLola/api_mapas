import Mapa from './components/Mapa';
import CargaOficios from './components/CargaOficios';
import { AppProvider } from './context/MyContext';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
 return (
  <AppProvider>
    <BrowserRouter>
      <Routes>
            <Route path="planificador" element={<Mapa />}/>
            <Route path="cargaroficio" element={<CargaOficios/>} />
            <Route path="verhojaruta" element={<Mapa />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
 )
}

export default App;