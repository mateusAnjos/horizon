import { useState, useEffect } from "react";
import api from "../../services/api";
import CarCardCategory from "../../Components/CarCardCategory";
import bodyStyle from "../../Components/Body/style.module.css";
import filteredStyle from "./style.module.css";
import SearchBar from "../SearchBar";

function CarByCategory(props) {
  const [carros, setCarros] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [descricao, setDescricao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getCarros() {
    try {
      const response = await api.get(`/categoria/nome/${props.props}`);
      setCarros(response.data.carros);
      setIsLoading(false);
      setCategoria(response.data.nome);
      setDescricao(response.data.descricao);
    } catch (error) {
      console.log("erro ao obter categorias");
      console.log(error);
    }
  }

  useEffect(() => {
    getCarros();
  }, []);

  return isLoading ? (
    <p>Carregando...</p>
  ) : (
    <div className={bodyStyle.body}>
      <SearchBar />
      <div className={bodyStyle.recomendedCards}>
        <div className={filteredStyle.categoryTexts}>
          <h1 className={filteredStyle.title}>{categoria}</h1>
          <h3 className={filteredStyle.description}>{descricao}</h3>
        </div>
        <div className={bodyStyle.recomendedList}>
          <CarCardCategory
            props={carros}
            categoria={categoria}
            descricao={descricao}
          />
        </div>
      </div>
    </div>
  );
}

export default CarByCategory;
