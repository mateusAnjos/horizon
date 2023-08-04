import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import DetailCard from "../../Components/DetailCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function Details() {
  const { carName } = useParams();

  const [carro, setCarro] = useState({});

  async function getCarro() {
    try {
      const response = await api.get(`/carro/nome?nome=${carName}`);
      setCarro(response.data);
    } catch (error) {
      console.log("erro ao obter carro");
      console.log(error);
    }
  }

  useEffect(() => {
    getCarro();
  }, []);

  return (
    <>
      <Header />
      {carro.id && <DetailCard id={carro.id} />}
      <Footer />
    </>
  );
}

export default Details;
