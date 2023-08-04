import React from 'react'
import CarEditForm from '../../Components/CarEditForm'
import { useParams } from 'react-router-dom'

function EditarCarro() {
    const carId = useParams()
  return (
    <CarEditForm carroId={carId}/>
  )
}

export default EditarCarro