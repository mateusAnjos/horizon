/* eslint-disable react-hooks/exhaustive-deps */
import carCheckoutStyle from "./style.module.css";
import { AiOutlineCheckCircle, AiFillEnvironment } from "react-icons/ai";
//configuração do calendario
import { useState, useEffect, useContext } from "react";
import "norama-react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "norama-react-modern-calendar-datepicker";
import { isCPF, isCNPJ, isCNH } from "validation-br";
import {
  Snackbar,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
  Input,
  FormHelperText,
} from "@mui/material";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import CpfTextField from "../CpfTextField";
import { AuthContext } from "../../contexts/auth";

function CarCheckout({ id }) {
  const myCustomLocale = {
    // meses em ordem
    months: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],

    // dias da semana em ordem
    weekDays: [
      {
        name: "Domingo",
        short: "D",
        isWeekend: true,
      },
      {
        name: "Segunda-feira",
        short: "S",
      },
      {
        name: "Terça-feira",
        short: "T",
      },
      {
        name: "Quarta-feira",
        short: "Q",
      },
      {
        name: "Quinta-feira",
        short: "Q",
      },
      {
        name: "Sexta-feira",
        short: "S",
      },
      {
        name: "Sábado",
        short: "S",
        isWeekend: true,
      },
    ],

    // índice de início da semana (0 para domingo, 1 para segunda-feira, etc.)
    weekStartingIndex: 0,

    // retorna um objeto { year: number, month: number, day: number }
    getToday(gregorainTodayObject) {
      return gregorainTodayObject;
    },

    // retorna um objeto Date nativo do JavaScript
    toNativeDate(date) {
      return new Date(date.year, date.month - 1, date.day);
    },

    // retorna o número de dias no mês
    getMonthLength(date) {
      return new Date(date.year, date.month, 0).getDate();
    },

    // retorna o dígito transformado para o formato do seu idioma
    transformDigit(digit) {
      return digit;
    },

    // textos no seletor de mês
    nextMonth: "Próximo mês",
    previousMonth: "Mês anterior",
    openMonthSelector: "Abrir seletor de mês",
    openYearSelector: "Abrir seletor de ano",
    closeMonthSelector: "Fechar seletor de mês",
    closeYearSelector: "Fechar seletor de ano",
    defaultPlaceholder: "Selecione...",

    // para o intervalo de valores de entrada
    from: "de",
    to: "até",

    // usado para valores de entrada quando várias datas são selecionadas
    digitSeparator: ",",

    // se você fornecer -2, por exemplo, o ano será com dois dígitos
    yearLetterSkip: 0,

    // o idioma é rtl (da direita para a esquerda) ou ltr (da esquerda para a direita)?
    isRtl: false,
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [numberOfMonths, setNumberOfMonths] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Define o valor de numberOfMonths com base na largura da janela
    if (windowWidth < 768) {
      setNumberOfMonths(1);
    } else {
      setNumberOfMonths(2);
    }
  }, [windowWidth]);

  //Captura das informações dos inputs
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const { removeUserStorage } = useContext(AuthContext);
  // const [retirada, setRetirada]=useState('')
  // const [entrega, setEntrega]=useState('')
  var entrega = "";
  var retirada = "";
  const navigate = useNavigate();
  const [reserva, setReserva] = useState([]);
  const [disabledDays, setDisabledDays] = useState([]);
  const user_mail = localStorage.getItem("user_mail");

  //estados para controlar os inputs
  const [mailError, setMailError] = useState(false);
  const [mailErrorText, setMailErrorText] = useState(" ");
  const [cpfError, setCpfError] = useState(false);
  const [cpfErrorText, setCpfErrorText] = useState(" ");
  const [cnhError, setCnhError] = useState(false);
  const [cnhErrorText, setCnhErrorText] = useState(" ");
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [responseType, setResponseType] = useState("info");
  const [responseMsg, setResponseMsg] = useState("");
  // const[ disabledDays, setDisabledDays] = useState([])

  const [modalVisibility, setModalVisibility] = useState(false);

  var valorTotal = 0;

  function logout() {
    removeUserStorage();
    navigate("/");
    // console.log('clicou em logout')
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };


  useEffect(() => {}, [entrega, retirada]);

  // Envio de cadastro
  const handleSubmit = (e) => {
    e.preventDefault();
    let retiradas = document.getElementById("retirada");
    let entregas = document.getElementById("entrega");
    const dataRetirada = moment(retiradas.value, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    const dataEntrega = moment(entregas.value, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );

    retirada = dataRetirada;
    entrega = dataEntrega;
    if (isCPF(cpf)) {
      setCpfError(false);
      setCpfErrorText("");
    } else {
      setCpfError(true);
      setCpfErrorText("O CPF é inválido.");
    }
    if (isCNH(cnh)) {
      setCnhError(false);
      setCnhErrorText("");
    } else {
      setCnhError(true);
      setCnhErrorText("A CNH é inválida");
    }
    if (isEmailValid(email)) {
      setMailError(false);
      setMailErrorText("");
    } else {
      setMailError(true);
      setMailErrorText("Email inválido.");
    }

    if (!localStorage.getItem("token")) {
      //precisa colocar uma mensagem de erro aqui
      setOpenLogin(true);
    }
    if (entregas.value == "-/-/-") {
      setOpen(true);
      setResponseType("info");
      setResponseMsg("Selecione as duas datas antes de enviar a reserva.");
    }

    if (
      isEmailValid(email) &&
      isCNH(cnh) &&
      isCPF(cpf) &&
      entregas.value != "-/-/-"
    ) {
      api
        .post("/reserva", {
          retirada: retirada,
          entrega: entrega,
          valorTotal: valorTotal,
          ativo: true,
          condutor: {
            nome: nome,
            sobrenome: sobrenome,
            contato: email,
            cnh: cnh,
          },
          carro: [
            {
              id: id,
            },
          ],
          usuario: {
            username: user_mail,
          },
        })
        .then((res) => {
          setModalVisibility(true);
          setTimeout(() => {
            navigate("/");
          }, "3000");
        })
        .catch((res) => {
          if (res.response.data.status == 403) {
            setResponseType("error");
            setResponseMsg(
              "Token está inválido, redirecionando para realizar login novamente..."
            );
            setOpen(true);
            setTimeout(() => {
              logout();
            }, 2000);
          }
          // alert("erro ao realizar reserva: " + res.data);
        });
    }
  };

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function getReservas() {
    try {
      const response = await api.get(`/reserva/carro/${id}`);
      setReserva(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  //buscando informações do carro
  const [carro, setCarro] = useState([]);
  async function getCarro() {
    try {
      const response = await api.get(`/carro/${id}`);
      setCarro(response.data);
    } catch (error) {
      console.log("erro ao obter carro");
      console.log(error);
    }
  }
  useEffect(() => {
    getCarro();
    getReservas();
  }, []);

  useEffect(() => {
    createDateObjectLoop(reserva);
  }, [reserva]);

  //Configurações do calendario
  var today = new Date();
  var defaultFrom = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  var defaultTo = {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate() + 2,
  };

  var defaultRange = {
    from: defaultFrom,
    to: defaultTo,
  };

  const [selectedDayRange, setSelectedDayRange] = useState(defaultRange);
  var diaRetirada = selectedDayRange.from;
  var diaEntrega = selectedDayRange.to;

  //Função para bloquear datas no calendario
  function createDateObjects(retirada, entrega) {
    let start = new Date(retirada);
    let end = new Date(entrega);
    let dateArray = [];

    while (start <= end) {
      let dateObject = {
        year: start.getFullYear(),
        month: start.getMonth() + 1,
        day: start.getDate() + 1,
      };
      dateArray.push(dateObject);

      start.setDate(start.getDate() + 1); // incrementa um dia
    }
    return dateArray;
  }

  function createDateObjectLoop(datesArray) {
    let datesArray2 = [];
    datesArray.forEach((locacao) => {
      datesArray2.push(createDateObjects(locacao.retirada, locacao.entrega));
    });
    const mergedArray = [].concat(...datesArray2);
    setDisabledDays([...mergedArray]);
  }
  //Fim da Função para bloquear datas no calendario

  //Função de adicionar o endereço

  function addEndereco(cidade) {
    const rio = "R. Mena Barreto, 151 - Botafogo, Rio de Janeiro";
    const sp = "Av. Brasil, 1693 - Jardins, São Paulo";
    if (cidade == 2) {
      return rio;
    }
    return sp;
  }

  //Função de retornar o valor de diferença das datas

  function dateDifference(dateObj1, dateObj2) {
    // Se um dos objetos é null, retorne 1
    if (dateObj1 === null || dateObj2 === null) {
      return 1;
    }

    // Criar objetos de data do JavaScript a partir dos objetos fornecidos
    // Subtraia 1 do mês, já que os meses estão sendo fornecidos no formato 1-12
    const date1 = new Date(dateObj1.year, dateObj1.month - 1, dateObj1.day);
    const date2 = new Date(dateObj2.year, dateObj2.month - 1, dateObj2.day);

    // Calcular a diferença em milissegundos
    const diffMillis = Math.abs(date1.getTime() - date2.getTime());

    // Converter para dias, adicionar 1 e retornar
    return Math.floor(diffMillis / (1000 * 60 * 60 * 24)) + 1;
  }

  function multiplicacao(vlr1, vlr2) {
    var resultado = vlr1 * vlr2;

    // Formata o número com pontos a cada três dígitos
    var numFormatado = resultado.toLocaleString("de-DE");

    // setValorTotal(numFormatado);
    valorTotal = resultado;

    return numFormatado;
  }

  //Função para tolltip

  return (
    <>
      <div className={carCheckoutStyle.bodyCheckout}>
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
        {modalVisibility ? (
          <div className={carCheckoutStyle.modal}>
            <div className={carCheckoutStyle.container}>
              <div className={carCheckoutStyle.content}>
                <img
                  className={carCheckoutStyle.modalImg}
                  src="../src/assets/check.png"
                  alt=""
                />
                <h1>Reserva concluída com sucesso!</h1>
                <div className={carCheckoutStyle.paragraphs}>
                  <p>
                    Nossa equipe entrará em contato por meio dos dados do seu
                    cadastro.
                  </p>
                  <p>
                    Você será redirecionado para a página inicial em instantes!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <Snackbar
          open={openLogin}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="warning"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
            Para fazer reservas você deve estar logado,{" "}
            {<Link to={"/Login"}>fazer login</Link>}.
          </Alert>
        </Snackbar>

        <div className={carCheckoutStyle.formField}>
          <div className={carCheckoutStyle.driverData}>
            <h3 className={carCheckoutStyle.h3}>Dados do condutor</h3>
            <div className={carCheckoutStyle.formCheckout}>
              <div>
                <label htmlFor="Nome">Nome</label>
                <TextField
                  id="Nome"
                  variant="standard"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                {/* <input type="Nome" value={nome} onChange={(e)=>setNome(e.target.value)} required/> */}
              </div>
              <div>
                <label htmlFor="Sobrenome">Sobrenome</label>
                <TextField
                  id="Sobrenome"
                  variant="standard"
                  className="input-mui"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                />
                {/* <input type="Sobrenome" value={sobrenome} onChange={(e)=>setSobrenome(e.target.value)} required/> */}
              </div>
              <div>
                <label htmlFor="E-mail">E-mail</label>
                <TextField
                  id="E-mail"
                  variant="standard"
                  className="input-mui"
                  error={mailError}
                  helperText={mailErrorText}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* <input type="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/> */}
              </div>
              <div>
                <label htmlFor="Cpf">CPF</label>
                <CpfTextField
                  id="Cpf"
                  error={cpfError}
                  variant="standard"
                  helperText={cpfErrorText}
                  name="cpf"
                  className="input-mui"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />

                {/* <input type="number" name="cpf" value={cpf} onChange={(e)=>setCpf(e.target.value)} required/> */}
              </div>
              <div>
                <label htmlFor="cnh">CNH</label>
                <TextField
                  id="Cnh"
                  error={cnhError}
                  helperText={cnhErrorText}
                  variant="standard"
                  name="cnh"
                  className="input-mui"
                  value={cnh}
                  onChange={(e) => setCnh(e.target.value)}
                />
                {/* <input type="number" name="cnh" value={cnh} onChange={(e)=>setCnh(e.target.value)} required/> */}
              </div>
            </div>
          </div>
          <div>
            <h3 className={carCheckoutStyle.h3}>
              Selecione sua data de reserva
            </h3>
            <div className={carCheckoutStyle.calendarCheckout}>
              {
                <Calendar
                  value={selectedDayRange}
                  onChange={setSelectedDayRange}
                  locale={myCustomLocale}
                  calendarClassName={carCheckoutStyle.cssCalendario}
                  shouldHighlightWeekends
                  numberOfMonths={numberOfMonths}
                  colorPrimary="var(--orange)" // added this
                  colorPrimaryLight="#e4181846"
                  disabledDays={disabledDays}
                  minimumDate={utils().getToday()}
                />
              }
            </div>
          </div>
          <div>
            <h3 className={carCheckoutStyle.h3}>
              Seu horário de retirada do veiculo
            </h3>
            <div className={carCheckoutStyle.timeformCheckout}>
              <div>
                <AiOutlineCheckCircle />
                <p>Seu carro estará preparado apartir desse horário</p>
              </div>

              <p>Indique a hora que vai retirar o veiculo</p>
              <select id="cars" name="cars">
                <option value="" disabled>
                  Escolha o horário de retirada
                </option>
                <option value="08">08:00</option>
                <option value="09">09:00</option>
                <option value="10">10:00</option>
                <option value="11">11:00</option>
                <option value="12">12:00</option>
                <option value="13">13:00</option>
                <option value="14">14:00</option>
                <option value="15">15:00</option>
                <option value="16">16:00</option>
                <option value="17">17:00</option>
                <option value="18">18:00</option>
                <option value="19">19:00</option>
              </select>
            </div>
          </div>
        </div>

        <div className={carCheckoutStyle.cardetailCheckout}>
          <h2>Detalhes da reserva</h2>
          {carro.imagensCarro && <img src={carro.imagensCarro[0].url} alt="" />}
          {carro.categoria && <h4>{carro.categoria.nome}</h4>}
          <h3
            className={carCheckoutStyle.h3}
          >{`${carro.marca} ${carro.modelo}`}</h3>

          <div className={carCheckoutStyle.cardetailAddress}>
            <AiFillEnvironment />
            {carro.cidade && <p> {addEndereco(carro.cidade.id)} </p>}
          </div>

          <div className={carCheckoutStyle.cardetailDate}>
            <p>Retirada</p>
            <input
              id="retirada"
              type="text"
              value={`${diaRetirada.day}/${diaRetirada.month}/${diaRetirada.year}`}
              disabled
            />
          </div>

          <div className={carCheckoutStyle.cardetailDate}>
            <p>Entrega</p>
            <input
              id="entrega"
              type="text"
              value={
                diaEntrega == null
                  ? "-/-/-"
                  : `${diaEntrega.day}/${diaEntrega.month}/${diaEntrega.year}`
              }
              disabled
            />
          </div>
          <div className={carCheckoutStyle.cardetailDate}>
            <p>Valor Diaria:</p>
            <p>R$ {multiplicacao(`${carro.valorDiario}`, 1)},00</p>
          </div>
          <div className={carCheckoutStyle.cardetailDate}>
            <p>Valor do Aluguel:</p>
            <p>
              R${" "}
              {multiplicacao(
                `${carro.valorDiario}`,
                `${dateDifference(diaRetirada, diaEntrega)}`
              )}
              ,00
            </p>
          </div>
          <input
            className={carCheckoutStyle.checkoutBtn}
            type="submit"
            value="Confirmar reserva"
            onClick={handleSubmit}
          ></input>
        </div>
      
      
      </div>
      <div className={carCheckoutStyle.infoInferior}>
      <h2>O que você precisa saber:</h2>
      <div className={carCheckoutStyle.line}></div>
      <div className={carCheckoutStyle.colunaInferior}>
        <div>
          <h3 className={carCheckoutStyle.h3}>Nosso carros</h3>
          <p>
            Na Horizon, oferecemos aluguel de carros de luxo de alta
            qualidade, combinando conforto e desempenho para proporcionar
            experiências inesquecíveis na estrada. Vivencie um estilo de vida
            de luxo.
          </p>
        </div>
        <div>
          <h3 className={carCheckoutStyle.h3}>Política de cancelamento</h3>
          <p>
            Cancelamentos feitos com menos de 48 horas de antecedência estão
            sujeitos a uma taxa de cancelamento correspondente a um dia de
            aluguel do carro reservado.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default CarCheckout;
