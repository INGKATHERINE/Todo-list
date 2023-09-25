import React, { useState,useEffect } from 'react';
import { FloatButton, Modal, Input,  Row, Col, Select,Button  } from 'antd';
import { PlusOutlined,SearchOutlined  } from '@ant-design/icons';
import Navbar from './components/Navbar';
import Task from './components/Task';
import { ColorResult, SketchPicker } from 'react-color';
import { Center } from '@chakra-ui/react';
import './index.css'; 

const App: React.FC = () => {
  interface TarjetaItem {
    id: number;
    title: string;
    description: string;
    color: string;
    isCompleted:boolean
  }
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [titulo,setTitulo] = useState("");
  const [descripcion,setDescripcion] = useState("");
  const [buscar,setBuscar] = useState('');
  const { Option } = Select;
  const [tarjetas,setTarjetas] =  useState<TarjetaItem[]>([]);
  const [componenteTarjetas,setComponenteTarjetas] = useState<JSX.Element[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selecionarFiltro,setSelecionarFiltro] = useState(0);

  const cargarRecordatorio=()=>{
    interface Post {
      id: number;
      title: string;
      body: string;
    }

    fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((json: Post[])  => {
      let temporal: TarjetaItem[] = [];

      json.forEach((item: Post) => {
        temporal.push({
          id:item.id,
          title:item.title,
          description:item.body,
          isCompleted:false,
          color:"#ffffff",
        })
      });
      setTarjetas(temporal);
    });
  }

  useEffect(() => {
    cargarRecordatorio();
  }, []);

  const showModal = () => {
    setModalVisible(true);
  }

  const onCancel = () => {
    setModalVisible(false);
  }

  const onCambiarColor = (color: ColorResult) => {
    setSelectedColor(color.hex);
  }

  const handleEdit = (id: number, newTitle: string, newDescription: string) => {
    
    fetch('https://jsonplaceholder.typicode.com/posts/'+id, {
      method: 'PUT',
      body: JSON.stringify({ 
        title: newTitle, 
        description: newDescription
      } ),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        setTarjetas(prevTarjetas => prevTarjetas.map(tarjeta => 
          tarjeta.id === id ? { ...tarjeta, title: newTitle, description: newDescription } : tarjeta
        ));
      });
  };
  
  const onSearch = () => {
    // Filtra las tarjetas por la descripción y el filtro
    const tarjetasFiltradas = tarjetas.filter(tarjeta =>
      {
        if(tarjeta.description.toLowerCase().includes(buscar.toLowerCase()))
        {
          if(selecionarFiltro==0)
          {
            return true;
          }
          else if(selecionarFiltro==1 && tarjeta.isCompleted==false){
            return true;
          }
          else if(selecionarFiltro==2 && tarjeta.isCompleted==true){
            return true;
          }
        }
        return false;
      }
    );
    // Actualiza el estado con las tarjetas filtradas
    setComponenteTarjetas(tarjetasFiltradas.map(tarjeta => (
      <Col xs={24} sm={12} md={8} className="gutter-row">
        <Task
          id={tarjeta.id}
          titulo={tarjeta.title}
          descripcion={tarjeta.description}
          color={tarjeta.color}
          isCompleted={tarjeta.isCompleted}
          onEdit={handleEdit}
          onComplete={onCompleto}
          onDelete={() => Eliminar(tarjeta.id)}
        />
      </Col>
    )));
  };

  const onCompleto= (id: number) => {
    let estado = tarjetas.find(item=>item.id==id)?.isCompleted;
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PATCH',
      body: JSON.stringify({
        isCompleted: !estado ,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) =>{
        setTarjetas(prevTarjetas => prevTarjetas.map(tarjeta => 
        tarjeta.id === id ? { ...tarjeta, isCompleted: !estado } : tarjeta
      ));
  })}

  

  const Eliminar = (id: number) => {
    fetch('https://jsonplaceholder.typicode.com/posts/'+ id, {
      method: 'DELETE',
    });
    setTarjetas(prevTarjetas => prevTarjetas.filter(tarjeta => tarjeta.id !== id));
  }

  const onAgregarActividad = () => {
   if (titulo && descripcion && selectedColor) {
    setTarjetas(prevTarjetas => [
      ...prevTarjetas,
      {
        "id": nextId,
        "title": titulo,
        "description": descripcion,
        "color": selectedColor,
        isCompleted:false,
      }
    ]);
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        "id": nextId,
        "title": titulo,
        "description": descripcion,
        "color": selectedColor,
        isCompleted:false,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) =>{
        setNextId(prevId => prevId + 1);
        setTitulo('');
        setDescripcion('');
        setModalVisible(false);
      });
    
  } else {
    alert('Por favor, completa todos los campos.');
    
  }
};

  const onCargarTarjetas = ()=>{
    let nuevasTarjetas = tarjetas.filter(tarjeta => tarjeta.description.toLowerCase().includes(buscar.toLowerCase())).map(tarjeta => (
      <Col xs={24} sm={12} md={8} className="gutter-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Task
          id={tarjeta.id}
          titulo={tarjeta.title}
          descripcion={tarjeta.description}
          color={tarjeta.color}
          isCompleted={tarjeta.isCompleted}
          onEdit={handleEdit}
          onComplete={onCompleto}
          onDelete={() => Eliminar(tarjeta.id)}
        />
      </Col>
    ));
    
    setComponenteTarjetas(nuevasTarjetas);
    
  }

  useEffect(() => {
    onCargarTarjetas();
  }, [tarjetas]);


  return (
    <div className="App">
      <Navbar />
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}  style={{ justifyContent: 'space-around', marginBottom: 16, marginLeft: 20,}}className="gutter-row" span={6}>
          <div>
            <p>Selecciona un estado:</p>
            <Select
              defaultValue="0"
              showSearch
              style={{ width: 200 }}
              placeholder="Seleccionar estado"
              onChange={(value)=>{
                setSelecionarFiltro(Number(value));
              }}
            >
              <Option value="0">Todas las Actividades</Option>
              <Option value="1">Actividades Pendientes</Option>
              <Option value="2">Actividades Completadas</Option>
            </Select>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} style={{marginBottom: 16,marginLeft: 20,}} className="gutter-row" span={6}>
            <div>
                <p>Buscar Descripción:</p>
                <Input
                    style={{ width: 200 }}
                    placeholder="Buscar"
                    value={buscar}
                    onChange={(evento)=>{setBuscar(evento.target.value)}}
                    onPressEnter={onSearch}
                />
            </div>
        </Col>
        <Col span={6} style={{marginBottom: 16,marginLeft: 20,marginTop: 25,}}>
            <Button onClick={onSearch} icon={<SearchOutlined />}>Buscar</Button>
        </Col>
      </Row>
      <Row  style={{ backgroundColor: '#DCDCDC'}} >
       <Col style={{ textAlign: 'left', marginLeft: 20,}} span={24}>
       <h1>Lista de Actividades</h1>
       </Col>
        <Row gutter={16} justify="center">
              {componenteTarjetas}
        </Row>
      </Row>
      <FloatButton className='center'
            shape="circle"
            type="primary"
            icon={<PlusOutlined />}
            tooltip={<div>Crear Actividad</div>}
            onClick={showModal}
      />
      <Modal
        title="Agregar una Actividad"
        visible={modalVisible}
        onOk={onAgregarActividad}
        onCancel={onCancel}
      >
        <div>
          <label htmlFor="titulo">Título:</label>
          <Input id="titulo" value={titulo} onChange={(evento)=>{setTitulo(evento.target.value)}} type="text" />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción de una Actividad:</label>
          <Input.TextArea  placeholder="Escribe algo..." value={descripcion} onChange={(evento)=>{setDescripcion(evento.target.value)}}  />
        </div>
        <div>
          <p>Paleta de Colores</p>
          <SketchPicker
            color={selectedColor}
            onChange={onCambiarColor}
          />
        </div>
      </Modal>
      
    </div>
  );
};

export default App;









