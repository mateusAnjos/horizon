import fullProductListStyle from "./style.module.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

function FullProductCard() {
  const [carros, setCarros] = useState([]);

  async function getCarros() {
    try {
      const response = await api.get("/carro");
      setCarros(response.data);
      console.log(response);
    } catch (error) {
      console.log("erro ao obter carros");
      console.log(error);
    }
  }
  async function deleteCar(id) {
    api
      .delete(`/carro/${id}`)
      .then((res) => {
        alert("Carro excluído com sucesso.");
      })
      .catch((err) => {
        alert("erro ao deletar carro \n" + err);
      });
  }

  useEffect(() => {
    getCarros();
  }, []);

  const productList = carros.map((car, index) => (
    <div className={fullProductListStyle.fullCard} key={index}>
      <div className={fullProductListStyle.carImgDiv}>
        <img
          className={fullProductListStyle.carImg}
          src={car.imagensCarro[0].url}
          alt="Imagem do carro citado neste card"
        />
      </div>
      <div className={fullProductListStyle.carTexts}>
        <div className={fullProductListStyle.carInfos}>
          <div
            className={fullProductListStyle.carName}
          >{`Marca: ${car.marca} Modelo: ${car.modelo}`}</div>
          <div
            className={fullProductListStyle.carValue}
          >{`Valor diário: ${car.valorDiario}`}</div>
          <div
            className={fullProductListStyle.carColor}
          >{`Cor: ${car.cor}`}</div>
          <div
            className={fullProductListStyle.carCity}
          >{`Cidade: ${car.cidade.nome}`}</div>
          <div
            className={fullProductListStyle.carCategory}
          >{`Categoria: ${car.categoria.nome}`}</div>
        </div>
        <div className={fullProductListStyle.propertiesList}>
          <p>Lista de características</p>
          {car.caracteristica[0] && (
            <div
              className={fullProductListStyle.propertyItem}
            >{`Assentos: ${car.caracteristica[0].valor}`}</div>
          )}
          {car.caracteristica[1] && (
            <div
              className={fullProductListStyle.propertyItem}
            >{`Motor: ${car.caracteristica[1].valor}`}</div>
          )}
          {car.caracteristica[2] && (
            <div
              className={fullProductListStyle.propertyItem}
            >{`Bagagem: ${car.caracteristica[2].valor}`}</div>
          )}
          {car.caracteristica[3] && (
            <div
              className={fullProductListStyle.propertyItem}
            >{`Câmbio: ${car.caracteristica[3].valor}`}</div>
          )}
          {car.caracteristica[4] && (
            <div
              className={fullProductListStyle.propertyItem}
            >{`Blindagem: ${car.caracteristica[4].valor}`}</div>
          )}
          {car.caracteristica[5] && (
            <div
              className={fullProductListStyle.propertyItem}
            >{`Portas: ${car.caracteristica[5].valor}`}</div>
          )}
        </div>
      </div>
      <div className={fullProductListStyle.button}>
        <Link to={`/editarCarro/${car.id}`}>
          <button>Editar Produto</button>
        </Link>
        <button onClick={() => deleteCar(car.id)}>Excluir Carro</button>
      </div>
    </div>
  ));

  return (
    <div className={fullProductListStyle.container}>
      <div className={fullProductListStyle.content}>{productList}</div>
    </div>
  );
}

export default FullProductCard;
