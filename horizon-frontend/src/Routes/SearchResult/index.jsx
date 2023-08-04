import CarCard from "../../Components/CarCard";
import { useEffect, useState } from "react";
import bodyStyle from "../../Components/Body/style.module.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useLocation } from "react-router-dom";
import SearchBar from "../../Components/SearchBar";

function SearchResult() {
  const location = useLocation();
  const { carrosList, searchString } = location.state;
  const atualizarEstado = (novoEstado) => {
    setEstado(novoEstado);
  };
  const [estado, setEstado] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  // async function getCarrosPorCidade() {
  //   try {
  //     const response = await api.get(`/carro/cidade/${city}`);
  //     setCarros(response.data);
  //     console.log(response);
  //     setIsLoading(false);

  //   } catch (error) {
  //     console.log("erro ao obter carros");
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    setIsLoading(false);
    setSearchResults(carrosList);
  }, [carrosList]);

  useEffect(() => {
    setIsLoading(false);

    // setSearchResults(carrosList);
    // setCarros(props);
    // setIsLoading(false);
    // getCarrosPorCidade();
  }, []);

  return isLoading ? (
    <p>Carregando...</p>
  ) : (
    <div className={bodyStyle.body}>
      <Header />
      <SearchBar />
      <div className={bodyStyle.recomendedCards}>
        <h2 className={bodyStyle.title}>{searchString}</h2>
        <div className={bodyStyle.recomendedList}>
          <CarCard
            props={searchResults}
            categoria={
              searchResults.categoria && searchResults[0].categoria.nome
            }
            descricao={
              searchResults.categoria && searchResults[0].categoria.descricao
            }
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchResult;
