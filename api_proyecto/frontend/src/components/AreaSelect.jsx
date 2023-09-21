import { useContext, useEffect} from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { AppContext } from "../context/MyContext";

function AreaSelect() {
    const map = useMap();
    const { setCoordinates } = useContext(AppContext)

  
    useEffect(() => {
      if (!map.selectArea) return;
  
      map.selectArea.enable();

      map.on("areaselected", (e) => {
        const unido = e.bounds.toBBoxString()
        const separado = unido.split(',')
        setCoordinates(separado)
        L.rectangle(e.bounds, { color: "blue", weight: 1 }).addTo(map);
      });
  
      // You can restrict selection area like this:
      const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
      // check restricted area on start and move
      map.selectArea.setValidate((layerPoint) => {
        return bounds.contains(this._map.layerPointToLatLng(layerPoint));
      });
  
      // now switch it off
      map.selectArea.setValidate();
    }, []);
  
    return null;
  }

  export default AreaSelect
