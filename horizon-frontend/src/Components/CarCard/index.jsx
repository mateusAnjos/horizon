import { useState, useEffect } from "react";
import recommendedCardStyle from "./style.module.css";
import api from "../../services/api";
import { Link } from "react-router-dom";

function CarCard({props}) {

  const [carros, setCarros] = useState([]);

  useEffect(() => {
    setCarros(props);
  }, [props]);



  const recommendedList = carros.map((cars, index)=>(
    <div className={recommendedCardStyle.card} key={index}>
            
        <img 
        src={cars.imagensCarro.length > 0 ? cars.imagensCarro[0].url: "https://www.autossegredos.com.br/wp-content/webp-express/webp-images/uploads/2022/02/Ferrari-SF90-Spider.jpg.webp" } 
        className={recommendedCardStyle.cardImg}
        alt="Imagem do carro citado neste card" />
    
    <div className={recommendedCardStyle.cardText}>
        <p className={recommendedCardStyle.category}>{cars.categoria.nome}</p>
        <h2>{`${cars.marca} ${cars.modelo}`}</h2>
        <p className={recommendedCardStyle.carPrice}>{"Valor Diário: " + cars.valorDiario.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
        <p>{cars.cidade.nome}</p>
        <span className={recommendedCardStyle.categoryDescription} >{cars.categoria.descricao}</span>
        <Link to={`/details/${cars.modelo}`}> 
        <button className={recommendedCardStyle.detailButton}>Mais Detalhes</button>
        </Link>
    </div>
</div>))
        
    return(
        <div className={recommendedCardStyle.recommendedList}>
            {recommendedList}
        </div>
    )

}

export default CarCard;
