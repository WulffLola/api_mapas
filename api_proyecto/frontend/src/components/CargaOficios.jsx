import  { useEffect, useState } from 'react';
import {Container,Row,Form,Button,Col} from 'react-bootstrap';
import {
  Flex,
  FormControl, 
  FormHelperText,
  FormLabel 
  } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import "../App.css"

function CargaOficios() {

  const correctForm = () => toast.success('Formulario enviado correctamente.', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  const incorrectDate = () => toast.warn('Verifique que los campos sean correctos.', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  const emptyFields = () => toast.error('Los campos deben ser validos.', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  const date = new Date().toISOString().slice(0,10)

  const getAPI = async (url,setEstado,python = true) => {
    //El parametro opcional PYTHON recibe un booleano que indica si la API a la que consultamos es 
    //la nuestra en Python o es una externa (Marcelo / PHP). Por eso, la forma de setear el estado es diferente.
    const resAPI = await fetch(url)
    const resAPI2 = await resAPI.json()
    python ? setEstado(resAPI2.data) : setEstado(resAPI2)
  }

  const [detalle, setDetalle] = useState('')
  const [calle, setCalle] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [altura, setAltura] = useState("")
  const [fecha, setFecha] = useState(date)
  const [codigoPostalFiltradoCalles, setCodigoPostalFiltradoCalles] = useState('8000')

  const [calles, setCalles] = useState()

  const getCalles = async () => {
    await getAPI ('http://128.0.204.46:8010/listUniqueAddressNames/',setCalles)
  }

  const submitForm = async() => {
    if([calle, altura, detalle, codigoPostal, fecha].every((value) => value !== "")){
      const postForm = await fetch('http://128.0.204.46:8010/registerOficio/', {method: 'POST', body: JSON.stringify({fecha: fecha, calle: calle, altura: altura, detalle: detalle, codigo_postal: codigoPostal})})
      postForm.status === 200 ? resetFields() : incorrectDate()
    
    } else {
        emptyFields()
    }
  }

  const handlerChange = (calle,codigo_postal) =>{
    setCalle(calle)
    setCodigoPostal(codigo_postal)    

  } 

  const resetFields = () => {
    correctForm()
    setFecha(date)
    setDetalle('')
    setCalle('')
    setAltura('')
  
  }

  const getCalles2 = async (e) => {
    e? setCodigoPostalFiltradoCalles(e.target.value) : null
    await getAPI ('http://128.0.202.248:8499/calles/filtro_por_codigo_postal/'+codigoPostalFiltradoCalles,setCalles)
  }

  useEffect(() => {
    getCalles()
  }, [])

  if(!calles){
    return null
  }
  return (
    <div className="App">
      <img src="https://www.bahia.gob.ar/wp-content/uploads/2018/04/municipio-de-bahia-blanca.png"></img>
      <Container>
        <Row>
          <h3 className='m-3'>FORMULARIO DE OFICIOS</h3>
        </Row>
        <Form className='formulario'>
        <Row>
          <Col className='col-6'>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type = "date" onChange={(event) => setFecha(event.target.value)} value={fecha}/>
                </Form.Group>
          </Col>
          <Col className='col-6'>
            <Form.Label>Ciudad</Form.Label>
              <Form.Select>
                  <option value="8000">Bahia Blanca</option>
                  <option value="8105">Cerri</option>
                  <option value="8132">Medanos</option>
                  <option value="8103">Ingeniero White</option>
                </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col className='col-6'>
            <Flex justify="start" align="center" w="full">
              <FormControl w="1000">
                <Form.Label textAlign="center">Calle</Form.Label>
                <AutoComplete>
                  <AutoCompleteInput  autoComplete="off" variant="filled" color="grey" style={{borderColor: "lightgray", borderRadius: "5px", width: '100% !important'  }}  defaultValue={calle}/>
                  <AutoCompleteList color="black" bg = "white">
                    {calles.map((calle, cid) => (
                      <AutoCompleteItem
                      key={`option-${cid}`}    
                        value={calle.calle}
                        textTransform="capitalize"
                        onClick={() => handlerChange(calle.calle, calle.codigo_postal)}
                        bg="white"
                      >
                        {calle.calle}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
                <FormHelperText></FormHelperText>
              </FormControl>
            </Flex>
          </Col>
          <Col className='col-6'>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Altura</Form.Label>
              <Form.Control type = "number"  onChange={(event) => setAltura(event.target.value)} value={altura} autoComplete="off"/>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Detalle</Form.Label>
            <Form.Control as="textarea" rows={2} onChange={(event) => setDetalle(event.target.value)} value={detalle} autoComplete="off"/>
          </Form.Group>
        </Row>
        <Button as="input" type="button" value="Enviar Formulario"  onClick={submitForm} />{' '}
      </Form> 
      </Container>     
      <ToastContainer /> 
    </div>
  );
}

export default CargaOficios;