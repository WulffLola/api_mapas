import React, { useEffect, useState } from 'react';
import {Container,Row,Col,Form,Button} from 'react-bootstrap';
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

function CargaOficios() {

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
  const [fecha, setFecha] = useState('')
  const [formData, setFormData] = useState({
    detalle: "",
    calle: "",
    altura: ""
  })
  const [calles, setCalles] = useState()

  const getCalles = async () => {
    await getAPI ('http://128.0.204.46:8010/listUniqueAddressNames/',setCalles)
  }

  const submitForm = async() => {
    if([calle, altura, detalle, codigoPostal, fecha].some((value) => value.length !== 0)){
      const postForm = await fetch('http://128.0.204.46:8010/registerOficio/', {method: 'POST', body: JSON.stringify(data = {fecha: fecha, calle: calle, altura: altura, detalle: detalle, codigo_postal: codigoPostal})})
      postForm.status === 200 && resetFields() 
    } else {
      alert('Debe completar todos los campos')
    }
  }

  const handlerChange = (calle,codigo_postal) =>{
    setCalle(calle)
    setCodigoPostal(codigo_postal)    

  } 

  const resetFields = () => {
    setFecha('')
    setDetalle('')
    setCalle('')
    setAltura('')
  
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
      <h3 className='m-3'>PLANIFICADOR DE FISCALIZACIÓN</h3>
      <Container>
        <Row>
          <h3 className='m-3'>FORMULARIO DE OFICIOS</h3>
        </Row>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Fecha</Form.Label>
            <Form.Control type = "date" onChange={(event) => setFecha(event.target.value)} value={fecha}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Detalle</Form.Label>
            <Form.Control type = "text" onChange={(event) => setDetalle(event.target.value)} value={detalle}/>
          </Form.Group>
            <Flex justify="start" align="center" w="full">
            <FormControl w="1000">
              <FormLabel textAlign="center">Calle</FormLabel>
              <AutoComplete w = "full">
                <AutoCompleteInput variant="filled" color="grey" w = "100%" style={{borderColor: "lightgray", borderRadius: "5px" }} onChange={(e) => handlerChange(e)} value={calle}/>
                <AutoCompleteList color="black" bg = "white">
                  {calles.map((country, cid) => (
                    <AutoCompleteItem
                    key={`option-${cid}`}    
                      value={country.calle}
                      textTransform="capitalize"
                      onClick={() => handlerChange(country.calle, country.codigo_postal)}
                      bg="white"
                    >
                      {country.calle} {' - ' + country.codigo_postal}
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
              <FormHelperText></FormHelperText>
            </FormControl>
          </Flex>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Altura</Form.Label>
            <Form.Control type = "number"  onChange={(event) => setAltura(event.target.value)} value={altura}/>
          </Form.Group>
          <Button as="input" type="button" value="Submit" onClick={submitForm} />{' '}
        </Form> 
      </Container>      
    </div>
  );
}

export default CargaOficios;