import { Link } from 'react-router-dom'
import cardCategoryStyle from './style.module.css'


function CardCategory(props){

    const {imagem,titulo, qtde} = props

    return( 
       
            <div className={cardCategoryStyle.cardCategory}>
                 <Link to={`/CarsByCategory/${titulo}`} className={cardCategoryStyle.link}>
                <div>
                    <img 
                    src={imagem}
                    className={cardCategoryStyle.cardImg} 
                    alt={`Imagem de um carro representando a categoria ${titulo}`} />
                </div>
                <div className={cardCategoryStyle.cardText}>
                    <h2 className={cardCategoryStyle.cardTitle}>{titulo}</h2>
                    <p className={cardCategoryStyle.smallText}>{qtde} Modelos</p>
                </div>
                </Link>
            </div>
            
    )
}

export default CardCategory