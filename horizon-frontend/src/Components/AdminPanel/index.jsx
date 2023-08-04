import { useState } from 'react'
import AdminPanelStyle from './style.module.css'
import CarCreationForm from '../CarCreationForm'
import FullProductCard from '../FullProductCard'

function AdminPanel(){

    const  [carCreationFormVisibility, setCarCreationFormVisibility]=useState(false)
    const [productListVisibility, setProductListVisibility] = useState(false)

    
    function showCarCreation(){
        setProductListVisibility(false)
        setCarCreationFormVisibility(true)
    }

    function showProductList(){
        setProductListVisibility(true)
        setCarCreationFormVisibility(false)
    }

    return(
        <div className={AdminPanelStyle.container}>         
            
            <div className={AdminPanelStyle.content}>
                <div className={AdminPanelStyle.title}>
                    <h1>Painel de Administrador</h1>
                </div>
                <div className={AdminPanelStyle.options}>
                    <ul className={AdminPanelStyle.ul}>
                        <li>
                            <button className={AdminPanelStyle.button} onClick={showCarCreation }>Cadastrar Carro</button>
                            <button className={AdminPanelStyle.button} onClick={showProductList}>Listar Produtos</button>
                        </li>
                    </ul>
                </div>
                <div className={AdminPanelStyle.container}>
                        {carCreationFormVisibility?
                        <div className={AdminPanelStyle.content}>
                            <CarCreationForm/>
                        </div>
                        :null}
                        {productListVisibility? 
                        <div className={AdminPanelStyle.content}>
                        <FullProductCard/>
                        </div>
                        :null}
                </div>
            </div>
        </div>
    )
}

export default AdminPanel