import Mapa from './components/Mapa';
import CargaOficios from './components/CargaOficios';
import { AppProvider } from './context/MyContext';


function App() {
 return (
  <AppProvider>
    <main>
      <Mapa/>
      <CargaOficios/>
    </main>
  </AppProvider>
 )
}

export default App;