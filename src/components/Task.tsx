import React, { useState } from 'react';
import { Card, Button, Input, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import { blob } from 'stream/consumers';
import './Task.css'; 


const Tarjeta = ({id, titulo, descripcion, color, isCompleted, onEdit, onComplete, onDelete }: { 
    id: number;
    titulo: string;
    descripcion: string;
    color: string;
    isCompleted: boolean;
    onEdit: (id: number, newTitle: string, newDescription: string) => void;
    onComplete: (id: number, isCompleted: boolean) => void;
    onDelete: (id: number) => void; }) => 
    {
        const [isEditing, setIsEditing] = useState(false);
        const [editedTitle, setEditedTitle] = useState(titulo);
        const [editedDescription, setEditedDescription] = useState(descripcion);

        const onGuardar = () => {
            onEdit(id, editedTitle, editedDescription);
            setIsEditing(false);
        }
        const onCheckboxClick = () => {
            onComplete(id, !isCompleted); // Invierte el estado de completado
        }
        

    return (
        <Card
        className="card"
        style={{  justifyContent: 'space-around',width: 300, marginBottom: 16, marginLeft: 10, marginTop: 20, backgroundColor: color,  }}  
        >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '8px' }}>
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} />
            </div>
            {isEditing ? (
                <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
            ) : (
                <p>{titulo}</p>
            )}
        </div>
        {isEditing ? (
            <Input.TextArea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
        ) : (
            <p>{descripcion}</p>
        )}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
            {isEditing ? (
                <Button type="primary" onClick={onGuardar}>Guardar</Button>
            ) : (
                <>
               <Button type="primary" danger onClick={() => onDelete(id)} icon={<DeleteOutlined />}></Button>
                </>
            )}
            </div>
            <Checkbox className='mi-checkbox' onClick={onCheckboxClick} checked={isCompleted} style={{borderColor:'black'}}></Checkbox>
        </div>
        </Card>
    );
}

export default Tarjeta;

