import CardCategory from "../CardCategory";
import RecommendedCard from "../RecommendedCard";
import bodyStyle from "./style.module.css";
import api from "../../services/api";
import { useEffect, useState } from "react";

function Body() {
  const [categorias, setCategorias] = useState([]);

  async function getCategorias() {
    try {
      const response = await api.get("/categoria");
      setCategorias(response.data);
    } catch (error) {
      console.log("erro ao obter categorias");
      console.log(error);
    }
  }

  useEffect(() => {
    getCategorias();
    // if(localStorage.getItem('cidade_query')){
    //     localStorage.removeItem('cidade_query')
    // }
  }, []);

  return (
    <div className={bodyStyle.body}>
      <div className={bodyStyle.categoriesCards}>
        <h2 className={bodyStyle.title}>Filtrar carros por categoria</h2>
        <div className={bodyStyle.categoriesList}>
          {categorias.map((categoria) => (
            <CardCategory
              key={categoria.id}
              id={categoria.id}
              imagem={categoria.imagensCategoria[0].url}
              titulo={categoria.nome}
              qtde={categoria.qntCarros}
            />
          ))}
        </div>
      </div>
      <div className={bodyStyle.recomendedCards}>
        <h2 className={bodyStyle.title}>Conheça nossos carros!</h2>
        <div className={bodyStyle.recomendedList}>
          <RecommendedCard />
        </div>
      </div>
    </div>
  );
}

export default Body;
