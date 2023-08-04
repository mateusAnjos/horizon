import SearchBarStyle from "./style.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import moment from "moment";

function SearchBar() {
  const [carros, setCarros] = useState([]);
  const [carrosCarregados, setCarrosCarregados] = useState(false);
  const [listaCidade, setListaCidade] = useState([]);
  const [inputDateType, setInputDateType] = useState("text");
  const [inputTimeType, setInputTimeType] = useState("text");
  const [selectedCidade, setSelectedCidade] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [open, setOpen] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [responseType, setResponseType] = useState("");
  const [searchString, setSearchString] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  async function getCidades() {
    try {
      const response = await api.get("/cidade");
      setListaCidade(response.data);
      // console.log(response);
    } catch (error) {
      console.log("erro ao obter cidades");
      console.log(error);
    }
  }

  async function getCarrosPorCidade() {
    try {
      setCarrosCarregados(false);
      localStorage.setItem("cidade_query", selectedCidade);
      const response = await api.get(`/carro/cidade/${selectedCidade}`);
      // console.log(response);
      setCarros(response.data);
      setCarrosCarregados(true);
    } catch (error) {
      console.log("erro ao obter cidades");
      console.log(error);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  async function getCarrosPorCidadeEData() {
    // if(selectedCidade == "" && dataEntrada !== "" && dataSaida == ""){
    //   console.log("cidade vazia, entrada preenchida, saida vazia");
    // }else if(selectedCidade == "" && dataEntrada == "" && dataSaida != ""){
    //   console.log("cidade vazia, entrada vazia, saida preenchida");
    // }
    // else if (selectedCidade == "" && dataEntrada == "" && dataSaida == ""){
    //   console.log("todos vazios");
    // }
    const data1 = moment(dataEntrada);
    const data2 = moment(dataSaida);
    if (dataEntrada != "" && dataSaida != "" && data2.isSameOrAfter(data1)) {
      localStorage.setItem("cidade_query", selectedCidade);
      localStorage.setItem("data_retirada_query", dataEntrada);
      localStorage.setItem("data_entrega_query", dataSaida);
      const dataEntradaFormatada = moment(dataEntrada).format("DD/MM/YYYY");
      const dataSaidaFormatada = moment(dataSaida).format("DD/MM/YYYY");

      if (selectedCidade != "" || selectedCidade != "0") {
        setSearchString(
          "Buscando carros em " +
            selectedCidade +
            " nas datas: " +
            dataEntradaFormatada +
            " a " +
            dataSaidaFormatada
        );
      } else {
        setSearchString(
          "Buscando carros " +
            "nas datas: " +
            dataEntradaFormatada +
            " a " +
            dataSaidaFormatada
        );
      }

      try {
        // console.log(`/carro/reserva/?dataRetirada=${dataEntrada}&dataEntrega=${dataSaida}&nomeCidade=${selectedCidade}`);
        setCarrosCarregados(false);
        const response = await api.get(
          selectedCidade !== "0"
            ? `/carro/reserva/?dataRetirada=${dataEntrada}&dataEntrega=${dataSaida}&nomeCidade=${selectedCidade}`
            : `/carro/reserva/?dataRetirada=${dataEntrada}&dataEntrega=${dataSaida}&nomeCidade=`
        );
        // console.log(response);
        setCarros(response.data);
        setCarrosCarregados(true);
      } catch (error) {
        console.log("Erro ao obter cidades nas datas selecionadas");
        console.log(error);
      }
    } else {
      if (data1.isAfter(data2)) {
        setResponseType("warning");
        setResponseMsg(
          "A data de retirada do veículo não pode ser posterior a de entrega."
        );
        setOpen(true);
      } else if (selectedCidade == "" && dataEntrada == "" && dataSaida == "") {
        setResponseType("info");
        setResponseMsg("Preencha cidade ou datas para realizar a pesquisa.");
        setOpen(true);
      } else {
        setResponseType("info");
        setResponseMsg("Preencha ambas datas para fazer a busca por data.");
        setOpen(true);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selectedCidade != "" && dataEntrada == "" && dataSaida == "") {
      setSearchString("Buscando carros em: " + selectedCidade);
      getCarrosPorCidade();
    } else {
      getCarrosPorCidadeEData();
    }
  }

  useEffect(() => {
    getCidades();
    if (location.pathname == "/") {
      if (localStorage.getItem("cidade_query")) {
        localStorage.removeItem("cidade_query");
        const cityInput = (document.getElementById("city").value = 0);
      }
      if (localStorage.getItem("data_retirada_query")) {
        localStorage.removeItem("data_retirada_query");
        document.getElementById("dataRetirada").value = 0;
      }
      if (localStorage.getItem("data_entrega_query")) {
        localStorage.removeItem("data_entrega_query");
        document.getElementById("dataDevolucao").value = 0;
      }
    }
    if (localStorage.getItem("cidade_query")) {
      setSelectedCidade(localStorage.getItem("cidade_query"));
    }
    if (localStorage.getItem("data_retirada_query")) {
      setDataEntrada(localStorage.getItem("data_retirada_query"));
    }
    if (localStorage.getItem("data_entrega_query")) {
      setDataSaida(localStorage.getItem("data_entrega_query"));
    }
  }, []);

  useEffect(() => {
    if (carrosCarregados) {
      navigate("/Search", {
        state: {
          searchString: searchString,
          carrosList: carros,
        },
      });
    }
  }, [carrosCarregados]);

  // useEffect(() => {
  //   if (carros.length > 0) {
  //     handleSubmitSearchedByCity()
  //   }
  // }, [carros]);

  //Bloqueio de data anterior a data atual no input
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const day = ("0" + today.getDate()).slice(-2);
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();

    setMinDate(`${year}-${month}-${day}`);
  }, []);

  return (
    <div className={SearchBarStyle.searchBar}>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{ marginBottom: "60px" }}
      >
        <Alert
          data-testid="alert"
          onClose={handleClose}
          severity={responseType ? responseType : "info"}
          sx={{ width: "100%" }}
        >
          {responseMsg}
        </Alert>
      </Snackbar>
      <div className={SearchBarStyle.searchBarContent}>
        <h1 className={SearchBarStyle.title}>
          A chave para sua próxima aventura
        </h1>
        <form className={SearchBarStyle.form} onSubmit={handleSubmit}>
          <select
            value={selectedCidade}
            onChange={(event) => setSelectedCidade(event.target.value)}
            className={SearchBarStyle.input}
            type="text"
            id="city"
            placeholder="Digite o local de retirada"
          >
            <option value={0}>Selecione uma Cidade</option>
            {listaCidade.map((cidade) => (
              <option key={cidade.id}>{cidade.nome}</option>
            ))}
          </select>
          <input
            className={SearchBarStyle.input}
            type="date"
            id="dataRetirada"
            value={dataEntrada}
            onChange={(e) => setDataEntrada(e.target.value)}
            placeholder="Data de retirada"
            onFocus={() => setInputDateType("date")}
            onBlur={() => setInputDateType("text")}
            min={minDate}
          />

          <input
            className={SearchBarStyle.input}
            type="date"
            id="dataDevolucao"
            value={dataSaida}
            onChange={(e) => setDataSaida(e.target.value)}
            placeholder="Data de devolução"
            onFocus={() => setInputTimeType("date")}
            onBlur={() => setInputTimeType("text")}
            min={minDate}
          />
          <button type="submit" className={SearchBarStyle.button}>
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
