import carCreationFormStyle from "./style.module.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function CarCreationForm() {
  const [listaCidade, setListaCidade] = useState([]);
  const [listaCaracteristica, setListaCaracteristica] = useState([]);
  const [selectedCidade, setSelectedCidade] = useState("");
  const selectRef = useRef();

  const [carro, setCarro] = useState({
    marca: "",
    modelo: "",
    cor: "",
    placa: "",
    renavam: "",
    chassi: "",
    descricao: "",
    ativo: true,
    valorDiario: 0,
    imagensCarro: [],
    caracteristica: [],
    categoria: {
      id: 0,
    },
    cidade: {
      id: selectedCidade,
    },
  });

  const [listaCategorias, setListaCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [listaMotores, setListaMotores] = useState([]);
  const [listaAssentos, setListaAssentos] = useState([]);
  const [listaBagagem, setListaBagagem] = useState([]);
  const [listaTransmissao, setListaTransmissao] = useState([]);
  const [listaBlindagem, setListaBlindagem] = useState([]);
  const [listaPorta, setListaPorta] = useState([]);
  const [listaArquivos, setListaArquivos] = useState([]);
  //state do modal
  const [modalVisibility, setModalVisibility] = useState(false);
  //funcao navigate
  const navigate = useNavigate();

  async function handleSendCar(e) {
    e.preventDefault();
    var arquivos = listaArquivos;

    var formData = new FormData();

    for (var i = 0; i < arquivos.length; i++) {
      var arquivo = arquivos[i];
      formData.append("file", arquivo);
      formData.append("nomes", `${arquivo.name}`);
    }
    await api
      .post("carro/enviarImagem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        // Sucesso da solicitação
        var responseData = response.data; // Dados retornados pela solicitação
        const objetos = responseData.map((url, index) => {
          return { url: url, titulo: "titulo" };
        });
        setCarro((prevObjeto) => ({
          ...prevObjeto,
          imagensCarro: objetos,
        }));
        setModalVisibility(true);
        setTimeout(() => {
          navigate("/AdminCMS");
          setModalVisibility(false);
        }, "3000");
      });
  }

  useEffect(() => {
    // listaArquivos.forEach((arquivo) => {
    //   console.log(arquivo.type);
    // })
  }, [listaArquivos]);

  useEffect(() => {
    getCidades();
    getCategorias();
    getCaracteristicas();
  }, []);

  //UseEffect para capturar a descrição da categoria selecionada
  useEffect(() => {
    selectedCategoria !== "" ? getDescricaoCategoria(selectedCategoria) : "";
  }, [selectedCategoria]);

  useEffect(() => {
    if (carro.imagensCarro.length > 0) {
      api.post("/carro", carro);
    }
  }, [carro]);

  useEffect(() => {
    setCarro((prevObjeto) => ({
      ...prevObjeto,
      cidade: [selectedCidade],
    }));
  }, [selectedCidade]);

  useEffect(() => {
    if (listaCaracteristica.length > 0) {
      setListaMotores(
        listaCaracteristica.filter((objeto) => objeto.nome === "Motor")
      );
      setListaAssentos(
        listaCaracteristica.filter((objeto) => objeto.nome === "Assentos")
      );
      setListaBagagem(
        listaCaracteristica.filter((objeto) => objeto.nome === "Bagagem")
      );
      setListaBlindagem(
        listaCaracteristica.filter((objeto) => objeto.nome === "Blindagem")
      );
      setListaTransmissao(
        listaCaracteristica.filter((objeto) => objeto.nome === "Câmbio")
      );
      setListaPorta(
        listaCaracteristica.filter((objeto) => objeto.nome === "Portas")
      );
    }
  }, [listaCategorias]);

  const handleInputTextChange = (event) => {
    const { id, value } = event.target;
    setCarro({ ...carro, [id]: value });
  };

  async function getCidades() {
    try {
      const response = await api.get("/cidade");
      setListaCidade(response.data);
    } catch (error) {
      console.log("erro ao obter cidades");
      console.log(error);
    }
  }
  async function enviarImagens() {}
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const caracteristicaSelecionada = listaCaracteristica.find(
      (objeto) => objeto.nome === name && objeto.valor == value
    );

    if (caracteristicaSelecionada) {
      const caracteristicaExistenteIndex = carro.caracteristica.findIndex(
        (objeto) => objeto.nome === caracteristicaSelecionada.nome
      );
      if (caracteristicaExistenteIndex != -1) {
        carro.caracteristica.splice(caracteristicaExistenteIndex, 1);
      }
      setCarro((prevObjeto) => ({
        ...prevObjeto,
        caracteristica: [
          ...prevObjeto.caracteristica,
          caracteristicaSelecionada,
        ],
      }));
    }
  };

  async function getCaracteristicas() {
    try {
      const response = await api.get("/caracteristica");
      setListaCaracteristica(response.data);
    } catch (error) {
      console.log("erro ao obter cidades");
      console.log(error);
    }
  }

  async function getCategorias() {
    try {
      const response = await api.get("/categoria");
      setListaCategorias(response.data);
    } catch (error) {
      console.log("erro ao obter categorias");
      console.log(error);
    }
  }

  function processarImagens() {
    let input = document.getElementById("imageInput");
    let inputCategoria = document.getElementById("categoriaInput");
    let optionSelecionado = inputCategoria.selectedOptions[0];
    let valorSelecionado = optionSelecionado.text;
    let arquivos = input.files;
    let arquivosPersonalizados = [];

    for (var i = 0; i < arquivos.length; i++) {
      let arquivo = arquivos[i];
      let nomeOriginal = arquivo.name;
      let extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf(".") + 1);
      let nomePersonalizado = `${valorSelecionado}-${carro.marca}-${carro.modelo}-${i}.${extensao}`;
      console.log(nomePersonalizado);

      let arquivoPersonalizado = new File([arquivo], nomePersonalizado, {
        type: arquivo.type,
      });
      arquivosPersonalizados.push(arquivoPersonalizado);
    }
    setListaArquivos(arquivosPersonalizados);
  }

  function getDescricaoCategoria(nomeCategoria) {
    const categoriaSelecionada = listaCategorias.filter(
      (objeto) => objeto.nome == nomeCategoria
    );
    setDescricaoCategoria(categoriaSelecionada[0].descricao);
  }

  return (
    <div className={carCreationFormStyle.container}>
      {modalVisibility ? (
        <div className={carCreationFormStyle.modal}>
          <div className={carCreationFormStyle.container2}>
            <div className={carCreationFormStyle.content}>
              <img
                className={carCreationFormStyle.modalImg}
                src="../src/assets/check.png"
                alt=""
              />
              <h1>Carro cadastrado com sucesso!</h1>
              <div className={carCreationFormStyle.paragraphs}>
                <p>Seu veículo já está disponivel em nosso site.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={carCreationFormStyle.content}>
        <div className={carCreationFormStyle.title}>
          <h1>Cadastro de Carro</h1>
        </div>

        <form className={carCreationFormStyle.form} onSubmit={handleSendCar}>
          <div className={carCreationFormStyle.carInfos}>
            <div className={carCreationFormStyle.title}>
              <h2>Informações do veículo</h2>
            </div>
            <div className={carCreationFormStyle.inputs}>
              <div className={carCreationFormStyle.column}>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="marca">Marca do veículo</label>
                  <input
                    id="marca"
                    type="text"
                    name="marca"
                    value={carro.marca}
                    onChange={handleInputTextChange}
                    required
                  />
                </div>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="modelo">Modelo do veículo</label>
                  <input
                    id="modelo"
                    type="text"
                    name="modelo"
                    value={carro.modelo}
                    onChange={handleInputTextChange}
                    required
                  />
                </div>
              </div>
              <div className={carCreationFormStyle.column}>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="descricao">Descrição do veículo</label>
                  <textarea
                    name="descricao"
                    id="descricao"
                    value={carro.descricao}
                    onChange={handleInputTextChange}
                    cols="30"
                    rows="4"
                    required
                  />
                </div>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="valorDiaria">Valor da diária</label>
                  <input
                    id="valorDiario"
                    value={carro.valorDiario}
                    onChange={handleInputTextChange}
                    type="number"
                    name="valorDiario"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className={carCreationFormStyle.column}>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="cor">Cor do veículo</label>
                  <input
                    type="text"
                    name="cor"
                    id="cor"
                    value={carro.cor}
                    onChange={handleInputTextChange}
                    required
                  />
                </div>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="cidade">Cidade do veículo</label>
                  <select
                    name="cidade"
                    id=""
                    value={carro.cidade.id}
                    onChange={(event) =>
                      setCarro((prevObjeto) => ({
                        ...prevObjeto,
                        cidade: {
                          id: parseInt(event.target.value), // Atualiza o ID da cidade no objeto carro
                        },
                      }))
                    }
                    required
                  >
                    <option value="" disabled selected></option>
                    {listaCidade.map((cidade) => (
                      <option key={cidade.id} value={cidade.id}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={carCreationFormStyle.categoryInfos}>
            <div className={carCreationFormStyle.title}>
              <h2>Informações da Categoria do Veículo</h2>
            </div>
            <div className={carCreationFormStyle.inputs}>
              <div className={carCreationFormStyle.column}>
                <div className={carCreationFormStyle.inputField}>
                  <label htmlFor="categoria">Categoria do veículo</label>
                  <select
                    name="categoria"
                    id="categoriaInput"
                    ref={selectRef}
                    onChange={(event) =>
                      setCarro((prevObjeto) => ({
                        ...prevObjeto,
                        categoria: {
                          id: parseInt(event.target.value), // Atualiza o ID da cidade no objeto carro
                        },
                      }))
                    }
                    required
                  >
                    <option value="" disabled selected></option>
                    {listaCategorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={carCreationFormStyle.carProperties}>
            <div className={carCreationFormStyle.title}>
              <h2>Características do Veículo</h2>
            </div>
            <div className={`${carCreationFormStyle.inputs}`}>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="assentos">Qtde de assentos</label>
                <select
                  name="Assentos"
                  id=""
                  onClick={handleInputChange}
                  required
                >
                  <option value="" disabled selected></option>
                  {listaAssentos &&
                    listaAssentos.map((assentos) => (
                      <option key={assentos.id} value={assentos.valor}>
                        {assentos.valor}
                      </option>
                    ))}
                </select>
              </div>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="motor">Motor</label>
                <select name="Motor" id="" onClick={handleInputChange} required>
                  <option value="" disabled selected></option>
                  {listaMotores &&
                    listaMotores.map((motor) => (
                      <option key={motor.id} value={motor.value}>
                        {motor.valor}
                      </option>
                    ))}
                </select>
              </div>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="bagagem">Tamanho do bagageiro</label>
                <select
                  name="Bagagem"
                  id=""
                  onClick={handleInputChange}
                  required
                >
                  <option value="" disabled selected></option>
                  {listaBagagem &&
                    listaBagagem.map((bagagem) => (
                      <option key={bagagem.id} value={bagagem.valor}>
                        {bagagem.valor}
                      </option>
                    ))}
                </select>
              </div>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="cambio">Tipo de transmissão</label>
                <select
                  name="Câmbio"
                  id=""
                  onClick={handleInputChange}
                  required
                >
                  <option value="" disabled selected></option>
                  {listaTransmissao &&
                    listaTransmissao.map((transmissao) => (
                      <option key={transmissao.id} value={transmissao.valor}>
                        {transmissao.valor}
                      </option>
                    ))}
                </select>
              </div>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="blindagem">Blindagem</label>
                <select
                  name="Blindagem"
                  id=""
                  onClick={handleInputChange}
                  required
                >
                  <option value="" disabled selected></option>
                  {listaMotores &&
                    listaBlindagem.map((blindagem) => (
                      <option key={blindagem.id} value={blindagem.valor}>
                        {blindagem.valor}
                      </option>
                    ))}
                </select>
              </div>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="portas">Qtde de Portas</label>
                <select
                  name="Portas"
                  id=""
                  onClick={handleInputChange}
                  required
                >
                  <option value="" disabled selected></option>
                  {listaPorta &&
                    listaPorta.map((porta) => (
                      <option key={porta.id} value={porta.valor}>
                        {porta.valor}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className={carCreationFormStyle.imageUploadDiv}>
            <div className={carCreationFormStyle.title}>
              <h2>Upload de Imagens</h2>
            </div>
            <div className={carCreationFormStyle.inputs}>
              <div className={carCreationFormStyle.inputField}>
                <label htmlFor="imageInput">
                  Selecione cinco imagens do veículo
                </label>
                <input
                  type="file"
                  name="imageInput"
                  id="imageInput"
                  onChange={processarImagens}
                  multiple
                  required
                />
              </div>
            </div>
          </div>
          <div className={carCreationFormStyle.submitBtnDiv}>
            <button className={carCreationFormStyle.submitBtn} type="submit">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarCreationForm;
