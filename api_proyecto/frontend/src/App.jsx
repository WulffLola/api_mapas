import React, { useEffect, useState } from 'react';
import {Container,Row,Col,Form,Button} from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker} from 'react-leaflet';

function App() {

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

  const getSubcategorias = async (e) => {
    await getAPI ('https://bahia.gob.ar/comercios/datos/comerciosact.php?ac='+e.target.value,setSubcategorias,false)
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
  }, [])

  if(!categorias || !posicionInicial ){
    return null
  }
  return (
    <div className="App">
      <img src="https://www.bahia.gob.ar/wp-content/uploads/2018/04/municipio-de-bahia-blanca.png"></img>
      <h3 className='m-3'>PLANIFICADOR DE FISCALIZACIÓN</h3>
      <Container>
        <Row>
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
        <Row> 
          <MapContainer  center={[posicionInicial?.LATITUD, posicionInicial?.LONGITUD]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <CircleMarker id="circuloSelector" center={[-38.7182346164, -62.2642808397]} pathOptions={{ color: 'red' }} radius={100}>
              <Popup>Area de Selección</Popup>
            </CircleMarker>
            {comercios?.map((e,i) =>
              <Marker key={i} position={[e?.latitud, e?.longitud]}>
              <Popup>
                <center><strong> {e?.NOMBRE_FANTASIA.toUpperCase()} </strong> <br/> {e?.DOMICILIO.toUpperCase()}</center>
              </Popup>
            </Marker>
            )};
          </MapContainer>
        </Row>
      </Container>      
    </div>
  );
}

export default App;