import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {Row,Col,Button, Table} from 'react-bootstrap';
import { useParams } from 'react-router';
import getAPI from '../config/getData'
import autoFillZeros from '../config/autoFillZeros';
import L, { icon } from "leaflet";
import '../config/leaflet_numbered_markers.js'
import '../config/leaflet_numbered_markers.css'

export default function HojaDeRuta() {

    const [HojaDeRuta, setHojaDeRuta] = useState()
    const [posicionInicial, setPosicionInicial] = useState()

    const { id } = useParams();

    const getHojaDeRuta = async () => {
        setHojaDeRuta([])
        await getAPI ('http://128.0.204.46:8010/obtenerHojaDeRuta/'+id,setHojaDeRuta)

    }    

    const getPosicionInicial = async () => {
        await getAPI ('http://128.0.204.46:8010/filterbyParams/8000/BLANDENGUES/152',setPosicionInicial)

      }

    let date = new Date(HojaDeRuta?.FECHA);
        /* Date format you have */
    let newMonth = date.getMonth () + 1
    newMonth < 10 ? newMonth = "0" + newMonth : null
    let dateMDY = `${date.getDate()}/${newMonth}/${date.getFullYear()}`;
        /* Date converted to MM-DD-YYYY format */
    HojaDeRuta ? HojaDeRuta.COMERCIOS = eval(HojaDeRuta.COMERCIOS) : null

    useEffect(() => {
        getPosicionInicial()
        getHojaDeRuta()
      }, [])
    
    if(!HojaDeRuta || !posicionInicial){
        return null
    }

    return (
        <div className="App">
            <img src="https://www.bahia.gob.ar/wp-content/uploads/2018/04/municipio-de-bahia-blanca.png"></img>
            <Row className='mt-5'>
                <Col className="col-4">
                    <h3 className='m-3'>{'FECHA: ' + dateMDY}</h3>
                    <iconImg></iconImg>
                </Col>
                <Col className="col-4">
                    <h3 className='m-3'>HOJA DE RUTA</h3>
                </Col>
                <Col className="col-4">
                <h3 className='m-3'>{'N° '+autoFillZeros(parseInt(HojaDeRuta?.ID),6)}</h3>
                </Col>
            </Row>
            <Row className='p-5 m-5'>
                <MapContainer  center={[posicionInicial?.LATITUD, posicionInicial?.LONGITUD]} zoom={16} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {HojaDeRuta?.COMERCIOS.map((e,i) =>
                    <Marker icon={new L.NumberedDivIcon({number: i+1})}  key={i} position={[e?.latitud, e?.longitud]}>
                    </Marker>
                )};
            </MapContainer>
            </Row>

            <Row>          {/* ACA TENEMOS EL LISTADO ORDENADO */}
                <Col className='text-center p-5'>
                        <h5>COMERCIOS A INSPECCIONAR POR ORDEN</h5>
                        <Table className='p-5 mt-5'>
                        <thead>
                            <tr>
                            <th width="260">COMERCIO</th>
                            <th width="260">RUBRO</th>
                            <th width="260">DIRECCION</th>
                            </tr>
                        </thead>
                        <tbody>         
                            {HojaDeRuta?.COMERCIOS.map((e,i) =>
                            <tr key={i}>
                                <td>
                                {e?.DETALLE.toUpperCase()}
                                </td>
                                <td>
                                {e?.TIPO.toUpperCase().split('',30)}
                                </td>
                                <td>
                                {e?.CALLE.toUpperCase() + ' ' +e?.ALTURA}
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </Table>
                </Col>
            </Row>

            <Row className='text-left p-5'>
                <Col className='col-12' style={{'text-align' : 'left'}}>
                    <h6 className='text-left'>Usuario Generador: {'ADMINISTRADOR (' + HojaDeRuta?.USUARIO_GENERADOR+')'}</h6>
                </Col>
            </Row>

            <Row className='text-left p-5'>
                <Col className='col-12' style={{'text-align' : 'left'}}>
                    <h6 className='text-left'>Inspectores Asignados: {HojaDeRuta?.INSPECTORES}</h6>
                </Col>
            </Row>
            <Row className='text-left p-5'>
                <Col className='col-12' style={{'text-align' : 'left'}}>
                    <h6 className='text-left'>Observaciones: {HojaDeRuta?.OBSERVACIONES}</h6>
                </Col>
            </Row>
        </div>
    )
}