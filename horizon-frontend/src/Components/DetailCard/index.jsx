import detailCardStyle from "./style.module.css";
import { AiOutlineLeft, AiFillEnvironment } from "react-icons/ai";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
//configuração do calendario
import "norama-react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "norama-react-modern-calendar-datepicker";
//importando a api
import api from "../../services/api";
//importando o useEffect e useState
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function DetailCard({ id }) {
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
  const navigate = useNavigate();

  //Chamada de api para pegar infos da reserva
  const [reserva, setReserva] = useState([]);

  const [disabledDays, setDisabledDays] = useState([]);

  async function getReservas() {
    try {
      const response = await api.get(`/reserva/carro/${id}`);
      setReserva(response.data);
    } catch (error) {
      console.log("erro ao obter reserva");
      console.log(error);
    }
  }

  //Chakmada de api para pegar infos do carro
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

  const images = [];

  if (carro.imagensCarro) {
    for (let i = 0; i < carro.imagensCarro.length; i++) {
      const image = {
        original: `${carro.imagensCarro[i].url}`,
        thumbnail: `${carro.imagensCarro[i].url}`,
        originalHeight: "600px",
        originalWidith: "900px",
      };

      images.push(image);
    }
  }

  //Objetos de configuração do calendario
  const defaultFrom = {
    year: 2023,
    month: 6,
    day: 1,
  };

  const defaultTo = {
    year: 2023,
    month: 6,
    day: 1,
  };

  const defaultRange = {
    from: defaultFrom,
    to: defaultTo,
  };

  const [selectedDayRange, setSelectedDayRange] = useState(defaultRange);

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

  //Função de mudar o mapa
  function addMapa(cidade) {
    const rio =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d649.4477206874116!2d-43.19160249503758!3d-22.95644666649737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fe10c215261%3A0x91f18311c81b4e33!2sR.%20Mena%20Barreto%2C%20151%20-%20Botafogo%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022271-100!5e0!3m2!1spt-BR!2sbr!4v1687397432193!5m2!1spt-BR!2sbr";
    const sp =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1292.9475930366111!2d-46.67411193465163!3d-23.568154614680335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce577c5a7dfc0f%3A0x643e2d581778c68d!2sAv.%20Brasil%2C%201693%20-%20Jardim%20America%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2016604-006!5e0!3m2!1spt-BR!2sbr!4v1687397202966!5m2!1spt-BR!2sbr";
    if (cidade == 2) {
      return rio;
    }
    return sp;
  }

  return (
    <div className={detailCardStyle.card}>
      <div className={detailCardStyle.barra}>
        <div className={detailCardStyle.barraSup}>
          <div>
            {carro.categoria && <p>{carro.categoria.nome}</p>}
            <h2>
              {carro.marca} {carro.modelo}
            </h2>
          </div>

          <button className={detailCardStyle.btnVoltar}>
            <AiOutlineLeft onClick={() => navigate(-1)} />
          </button>
        </div>
      </div>
      <div className={detailCardStyle.barraInf}>
        <div className={detailCardStyle.endTexto}>
          <AiFillEnvironment />
          {carro.cidade && <p>{carro.cidade.nome}</p>}
        </div>
      </div>

      <div className={detailCardStyle.galeriaImagem}>
        <div className={detailCardStyle.galery}>
          <ImageGallery
            items={images}
            thumbnailPosition="bottom"
            showFullscreenButton={false}
            showPlayButton={false}
          />
        </div>
      </div>

      <div className={detailCardStyle.descricao}>
        <h2>Sobre o carro</h2>
        <p>{carro.descricao}</p>
      </div>

      <div className={detailCardStyle.listaIcones}>
        <h2>Características</h2>

        <div className={detailCardStyle.line}></div>

        <div className={detailCardStyle.bodyIcones}>
          <div className={detailCardStyle.divIcones}>
            <img src="https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/icon-lugares.png" />
            {carro.caracteristica && (
              <p>
                {carro.caracteristica[0].valor} {carro.caracteristica[0].nome}
              </p>
            )}
          </div>
          <div className={detailCardStyle.divIcones}>
            <img src="https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/icon-motor.png" />

            {carro.caracteristica && (
              <p>
                {carro.caracteristica[1].nome}: {carro.caracteristica[1].valor}
              </p>
            )}
          </div>
          <div className={detailCardStyle.divIcones}>
            <img src="https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/icon-malas.png" />

            {carro.caracteristica && (
              <p>
                {carro.caracteristica[2].nome}: {carro.caracteristica[2].valor}
              </p>
            )}
          </div>
          <div className={detailCardStyle.divIcones}>
            <img src="https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/icon-cambio.png" />
            {carro.caracteristica && (
              <p>
                {carro.caracteristica[3].nome}: {carro.caracteristica[3].valor}
              </p>
            )}
          </div>
          <div className={detailCardStyle.divIcones}>
            <img src="https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/icon-blindagem.png" />
            {carro.caracteristica && (
              <p>
                {carro.caracteristica[4].nome}: {carro.caracteristica[4].valor}
              </p>
            )}
          </div>
          <div className={detailCardStyle.divIcones}>
            <img src="https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/icon-portas.png" />
            {carro.caracteristica && (
              <p>
                {carro.caracteristica[5].nome}: {carro.caracteristica[5].valor}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={detailCardStyle.calendario}>
        <h2>Datas disponiveis</h2>
        <div className={detailCardStyle.calendarioInt}>
          {
            <Calendar
              locale={myCustomLocale}
              onChange={setSelectedDayRange}
              shouldHighlightWeekends
              numberOfMonths={numberOfMonths}
              disabledDays={disabledDays}
            />
          }

          <Link to={`/checkout/${carro.id}`}>
            <button className={detailCardStyle.button}>
              Reservar o veiculo
            </button>
          </Link>
        </div>
      </div>

      <div className={detailCardStyle.map}>
        <h2>Localidade do veículo</h2>
        <div className={detailCardStyle.line}></div>
        {carro.cidade && <iframe src={addMapa(carro.cidade.id)}></iframe>}
      </div>

      <div className={detailCardStyle.infoInferior}>
        <h2>O que você precisa saber:</h2>
        <div className={detailCardStyle.line}></div>
        <div className={detailCardStyle.colunaInferior}>
          <div>
            <h3>Nosso carros</h3>
            <p>
              Na Horizon, oferecemos aluguel de carros de luxo de alta
              qualidade, combinando conforto e desempenho para proporcionar
              experiências inesquecíveis na estrada. Vivencie um estilo de vida
              de luxo.
            </p>
          </div>
          <div>
            <h3>Política de cancelamento</h3>
            <p>
              Cancelamentos feitos com menos de 48 horas de antecedência estão
              sujeitos a uma taxa de cancelamento correspondente a um dia de
              aluguel do carro reservado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailCard;
