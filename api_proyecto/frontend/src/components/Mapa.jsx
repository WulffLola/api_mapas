import React, { useEffect, useState } from 'react';
import {Row,Col,Form,Button, Table} from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker} from 'react-leaflet';
import InspectorCard from './InspectorCard';

function Mapa() {

    var greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
  });

  const arrayCategorias = [];
  let data = '<option id="00">-- Elija una Actividad Comercial --</option><option id="11">Avicultura y otras actividades primarias</option><option id="91">Bancos y otras instituciones sujetas a la ley de entidades financieras, otras actividades de financiacion</option><option id="61">Comercio por mayor productos agropecuarios, forestales, de la pesca y mineria</option><option id="62">Comercio por menor, alimentos y bebidas</option><option id="92">Compañias de seguros</option><option id="73">Comunicaciones</option><option id="40">Construcción</option><option id="72">Depósito y almacenamiento</option><option id="50">Electricidad, gas y agua</option><option id="94">Empresas o personas dedicadas y/o que reciban ingresos directos por exportaciones</option><option id="34">Fabricación de papel y productos de papel, imprentas y editoriales</option><option id="38">Fabricación de productos metálicos, maquinarias y equipos</option><option id="36">Fabricación de productos minerales no metálicos, excepto derivados del petroleo y del carbon</option><option id="35">Fabricación de sustancias químicas y de productos químicos derivados del petroleo y del carbon, de caucho y de plastico</option><option id="32">Fabricación de textiles, prendas de vestir e industria del cuero</option><option id="33">Industria de la madera y productos de madera</option><option id="31">Industrias manufactureras de productos alimenticios, bebidas y tabacos</option><option id="37">Industrias metálicas básicas</option><option id="93">Locación de bienes inmuebles</option><option id="39">Otras industrias manufactureras</option><option id="63">Restaurantes y hoteles otros establecimientos que expendan, bebidas y comidas, (excepto night clubes y similares).</option><option id="84">Servicios de esparcimiento películas cinematográficas y emisiones de radio y televisión</option><option id="85">Servicios personales y de los hogares servicios de reparación</option><option id="83">Servicios prestados a las empresas</option><option id="82">Servicios prestados al público instrucción pública</option><option id="71">Transporte</option><option id="99">ver todos...</option>'
  data = data.split('</option>');
  data.forEach((e)=> {
    if(e != '</option>' && e != ''){
      let value = e.split('id="')
      value = value[1].split('">')[0]
      let text = e.split('>')
      text = text[1].split('<')[0]
      let option = {
        value,
        text
      }
      arrayCategorias.push(option);
    }    
  })

  const getAPI = async (url,setEstado,python = true) => {
    //El parametro opcional PYTHON recibe un booleano que indica si la API a la que consultamos es 
    //la nuestra en Python o es una externa (Marcelo / PHP). Por eso, la forma de setear el estado es diferente.
    const resAPI = await fetch(url)
    const resAPI2 = await resAPI.json()
    python ? setEstado(resAPI2.data) : setEstado(resAPI2)
  }

  const [comercios, setComercios] = useState()
  const [categorias, setCategorias] = useState()
  const [subCategorias, setSubcategorias] = useState()
  const [posicionInicial, setPosicionInicial] = useState()
  const [oficios, setOficios] = useState()


  const getSubcategorias = async (e) => {
    await getAPI ('https://bahia.gob.ar/comercios/datos/comerciosact.php?ac='+e.target.value,setSubcategorias,false)
  }

  const getOficios = async (e) => {
    await getAPI ('http://128.0.204.46:8010/oficios/',setOficios)
  }

  const getComercios = async () => {
    let value = document.getElementById('selectComercios').value
    await getAPI ('https://bahia.gob.ar/comercios/datos/xcomerciosxcategoria.php?ac='+value,setComercios,false)
  }

  const getInformacionInicial = async () => {
    await getAPI ('http://128.0.204.46:8010/filterbyParams/8000/BLANDENGUES/152',setPosicionInicial)
    setCategorias(arrayCategorias);   
  }
  
  useEffect(() => {
    getInformacionInicial()
    getOficios()
  }, [])

  if(!categorias || !posicionInicial || !oficios){
    return null
  }
  return (
    <div className="App">
      <img src="https://www.bahia.gob.ar/wp-content/uploads/2018/04/municipio-de-bahia-blanca.png"></img>
      <h3 className='m-3'>PLANIFICADOR DE FISCALIZACIÓN</h3>
      <div className="contenedor p-2">
        <Row>    {/* ACA TENEMOS EL SELECTOR DE LOS RUBROS*/}
          <Col className="col-5" >
            <Form> 
                <Form.Group className="m-3">
                    <Form.Label>Actividad: </Form.Label>
                    <Form.Select onChange={getSubcategorias}>
                    {categorias.map(option =>
                      <option key={option.value} value={option.value}>{option.text.toUpperCase()}</option>
                    )};
                  </Form.Select>
                </Form.Group>
            </Form>
          </Col>
          <Col className="col-5" >
            <Form>
                <Form.Group className="m-3">
                    <Form.Label>Sub-Actividad: </Form.Label>
                    <Form.Select id="selectComercios">
                    {subCategorias?.map(option =>
                      <option key={option.ACTIVIDAD_CODIGO} value={option.ACTIVIDAD_CODIGO}>{option.ACTIVIDAD_DESCRIPCION.toUpperCase()}</option>
                    )};
                  </Form.Select>
                </Form.Group>
            </Form>
          </Col>
          <Col className="col-2 mt-5">
            <Button variant="success" onClick={getComercios}>Geolocalizar</Button>{' '}
          </Col>
        </Row>
        <Row>     {/* ACA TENEMOS EL MAPA Y LOS FILTROS*/}
          <Col className='col-7'> 
            <MapContainer  center={[posicionInicial?.LATITUD, posicionInicial?.LONGITUD]} zoom={13} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <CircleMarker id="circuloSelector" center={[-38.7182346164, -62.2642808397]} pathOptions={{ color: 'red' }} radius={100}>
                <Popup>Area de Selección</Popup>
              </CircleMarker>
              {comercios?.map((e,i) =>
                <Marker icon={blueIcon}  key={i} position={[e?.latitud, e?.longitud]}>
                <Popup>
                  <center><strong> {e?.NOMBRE_FANTASIA.toUpperCase()} </strong> <br/> {e?.DOMICILIO.toUpperCase().split('(')[0]}</center>
                </Popup>
              </Marker>
              )};
              {oficios?.map((e,i) =>
                <Marker icon={greenIcon} key={i} position={[e?.LATITUD, e?.LONGITUD]} style={{color:'red !important'}}>
                <Popup>
                  <center><strong> {"OFICIO / DENUNCIA 0800"} </strong> <br/> {e?.CALLE.toUpperCase()}  {e?.ALTURA.toUpperCase()} </center>
                </Popup>
              </Marker>
              )};
            </MapContainer>
          </Col>
          <Col className='col-5'> 
            <p>Aca van los filtros</p>    
            <svg className='m-1' version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="35%" height="35%" viewBox="0 0 1171.000000 1280.000000"
            preserveAspectRatio="xMidYMid meet">
            <metadata>
            Created by potrace 1.15, written by Peter Selinger 2001-2017
            </metadata>
            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path d="M5310 12794 c-2180 -66 -3938 -423 -4754 -965 -354 -235 -535 -493
            -553 -789 -19 -312 160 -605 519 -851 73 -50 189 -164 695 -687 335 -345 757
            -780 938 -967 182 -187 854 -882 1495 -1544 l1165 -1203 5 -2762 5 -2761 25
            -50 c36 -74 123 -157 195 -186 l60 -24 720 0 720 0 62 29 c73 33 147 107 184
            181 l24 50 5 2746 5 2746 740 754 c407 415 861 878 1010 1029 275 280 934 952
            1850 1885 280 286 555 567 610 623 55 57 143 133 195 170 122 86 271 235 339
            340 l54 82 43 0 44 0 0 360 0 360 -50 0 c-27 0 -50 4 -50 9 0 15 -89 142 -134
            191 -362 396 -1106 713 -2181 929 -452 91 -1010 172 -1525 221 -619 58 -1082
            80 -1780 84 -311 2 -617 2 -680 0z"/>
            </g>
            </svg>
        
          </Col>
        </Row>
        <Row>          {/* ACA TENEMOS EL SELECTOR DE LOS COMERCIOS DENTRO DEL AREA*/}
          <Col className='text-center mt-5'>
                <span>SELECCIONE LOS COMERCIOS A INSPECCIONAR</span>
                <Table className='mt-5'>
                  <thead>
                    <tr>
                      <th width="20"></th>
                      <th width="260">COMERCIO</th>
                      <th width="260">RUBRO</th>
                      <th width="260">DIRECCION</th>
                    </tr>
                  </thead>
                  <tbody id='seleccionador-comercios'>         
                    {comercios?.map((e,i) =>
                      <tr key={i}>
                        <td>
                          <Form.Check // prettier-ignore
                            type="switch"
                            id={e.COMERCIO_ID}
                          />
                        </td>
                        <td>
                          {e?.NOMBRE_FANTASIA.toUpperCase()}
                        </td>
                        <td>
                          {e?.ACTIVIDAD_DESCRIPCION.toUpperCase().split('',30)}
                        </td>
                        <td>
                          {e?.DOMICILIO.toUpperCase().split(')')[0]+')'}
                        </td>
                      </tr>
                    )}
                    {oficios?.map((e,i) =>
                      <tr key={i}> 
                        <td>
                          <Form.Check // prettier-ignore
                            type="switch"
                            id={e.ID}
                          />
                        </td>
                        <td>
                          {e?.TIPO.toUpperCase()}
                        </td>
                        <td>
                          {e?.DETALLE.toUpperCase().split('',30)}
                        </td>
                        <td>
                          {e?.CALLE.toUpperCase()+' '+e?.ALTURA}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
          </Col>
        </Row>
        <Row>    {/* ACA TENEMOS EL SELECTOR DE LOS INSPECTORES Y EL GENERADOR DE LA HOJA DE RUTA*/}
          <Col className='col-6'> {/* SELECCIONAMOS LOS INSPECTORES */}
            <Form.Select>
              <option key='disabledRow' hidden value>Seleccione los Inspectores de la cuadrilla</option>
              <option value="1">Inspector Martínez P.</option>
            </Form.Select>
          </Col>
          <Col className='col-6'>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Mapa;