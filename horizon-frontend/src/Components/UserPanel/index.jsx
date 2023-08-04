import UserPanelStyle from "./style.module.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

function UserPanel() {
  //captura de informações
  const [reservas, setReserva] = useState([]);
  const [atualizarPage, setAtualizarPage] = useState(false);
  let reservaUser = reservas[0];

  //Chamada de api para pegar as reservas
  async function getReserva() {
    try {
      const response = await api.get(
        `reserva/usuario/${localStorage.getItem("user_mail")}`
      );
      setReserva(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("erro ao obter Usuario");
      console.log(error);
    }
  }

  async function cancelarReserva(idReserva) {
    if (confirm("Tem certeza que deseja cancelar a reserva?")) {
      try {
        const response = await api.delete(`reserva/${idReserva}`);
        setAtualizarPage(true);
        // console.log(response.data);
      } catch (error) {
        console.log("erro ao obter Usuario");
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (atualizarPage == true) {
      getReserva();
      setAtualizarPage(false);
    }
  }, [atualizarPage]);

  useEffect(() => {
    getReserva();
  }, []);

  //Função de configurar a data
  function formatarData(dataString) {
    var data = new Date(dataString);
    var dia = ("0" + data.getDate()).slice(-2);
    var mes = ("0" + (data.getMonth() + 1)).slice(-2);
    var ano = data.getFullYear().toString().substr(-2);
    return dia + "/" + mes + "/" + ano;
  }

  return (
    <>
      <div className={UserPanelStyle.content}>
        {reservas.length == 0 ? null : <h1>Meus Dados</h1>}
        {reservaUser && (
          <div className={UserPanelStyle.cardDados}>
            <div>
              <h4>Nome: </h4>
              {reservaUser.usuario.pessoa && (
                <p className={UserPanelStyle.paragraph}>
                  {reservaUser.usuario.pessoa.nome}{" "}
                  {reservaUser.usuario.pessoa.sobrenome}
                </p>
              )}
            </div>
            <div>
              <h4>E-mail: </h4>
              {reservaUser.usuario && (
                <p className={UserPanelStyle.paragraph}>
                  {reservaUser.usuario.username}
                </p>
              )}
            </div>
            <div>
              <h4>Endereço: </h4>
              {reservaUser.usuario.pessoa.endereco && (
                <p className={UserPanelStyle.paragraph}>
                  {reservaUser.usuario.pessoa.endereco.rua}{" "}
                  {reservaUser.usuario.pessoa.endereco.numero}
                </p>
              )}
            </div>
            <div>
              <h4>CEP: </h4>
              {reservaUser.usuario.pessoa.endereco && (
                <p className={UserPanelStyle.paragraph}>
                  {reservaUser.usuario.pessoa.endereco.cep}
                </p>
              )}
            </div>
            <div>
              <h4>Cidade: </h4>
              {reservaUser.usuario.pessoa.endereco && (
                <p className={UserPanelStyle.paragraph}>
                  {reservaUser.usuario.pessoa.endereco.cidade}
                </p>
              )}
            </div>
            <div>
              <h4>Estado: </h4>
              {reservaUser.usuario.pessoa.endereco && (
                <p className={UserPanelStyle.paragraph}>
                  {reservaUser.usuario.pessoa.endereco.uf}
                </p>
              )}
            </div>
          </div>
        )}

        {reservas.length == 0 ? null : <h2>Minhas reservas</h2>}
        <div className={UserPanelStyle.card}>
          {reservas.length == 0 ? (
            <div className={UserPanelStyle.reserva}>
              <div className={UserPanelStyle.reservaTexto}>
                <h3>Você ainda não fez nenhuma reserva</h3>
              </div>
            </div>
          ) : (
            reservas.map((reserva) => (
              <div className={UserPanelStyle.reserva}>
                {reserva.carro[0].imagensCarro[0] && (
                  <img src={reserva.carro[0].imagensCarro[0].url} />
                )}
                <div className={UserPanelStyle.reservaTexto}>
                  <div>
                    {reserva.carro[0] && (
                      <h2>
                        {reserva.carro[0].marca} {reserva.carro[0].modelo}
                      </h2>
                    )}
                    {reserva.carro[0].cidade && (
                      <p>{reserva.carro[0].cidade.nome}</p>
                    )}
                  </div>
                  <div>Nº Reserva: {reserva.id}</div>
                  <div className={UserPanelStyle.retirada}>
                    <div>
                      <h4>Retirada</h4>
                      {reserva.carro[0] && (
                        <p>{formatarData(reserva.retirada)}</p>
                      )}
                    </div>
                    <div>
                      <h4>Entrega</h4>
                      {reserva.carro[0] && (
                        <p>{formatarData(reserva.entrega)}</p>
                      )}
                    </div>
                    {reserva.ativo ? (
                      <button onClick={() => cancelarReserva(reserva.id)}>
                        Cancelar Aluguel
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelarReserva(reserva.id)}
                        disabled
                      >
                        Aluguel Cancelado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default UserPanel;
