import signupStyle from "./style.module.css";
import getCep from "../../services/cep";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, FormHelperText, TextField } from "@mui/material";
import { isCPF, isCNPJ, isCNH } from "validation-br";
import CpfTextField from "../CpfTextField";

function SignupFormPessoaFisica() {
  const navigate = useNavigate();

  const [autocomplete, setAutocomplete] = useState([]);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCPF] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [open, setOpen] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const [cpfErrorText, setCpfErrorText] = useState(" ");
  // const[formError, setFormError] = useState('')
  const [responseType, setResponseType] = useState("success");
  const [responseMsg, setResponseMsg] = useState("");
  const [mailError, setMailError] = useState(false);
  const [mailErrorText, setMailErrorText] = useState(" ");

  useEffect(() => {
    setEndereco(autocomplete.logradouro);
    setCidade(autocomplete.localidade);
    setEstado(autocomplete.uf);
  }, [autocomplete]);

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function fetchCep(cep) {
    try {
      const response = await getCep.get(`/${cep}/json`);
      setAutocomplete(response.data);
      console.log(autocomplete);
    } catch (error) {
      console.log("CEP n encontrado");
      console.log(error);
    }
  }

  const handleCep = (e) => {
    const cepToFetch = e.target.value.replace(/\D/g, "");
    if (cepToFetch.length === 8) {
      setCep(cepToFetch);
      fetchCep(cepToFetch);
      console.log("fetch funcionou");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (isCPF(cpf) && isEmailValid(email)) {
      setCpfError(false);
      setCpfErrorText("");
      setMailError(false);
      setMailErrorText("");
      await api
        .post("/usuario", {
          username: email,
          password: senha,
          authorities: [{ id: 2 }],
          pessoa: {
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            tipo_pessoa: 1,
            endereco: {
              cep: cep,
              rua: endereco,
              numero: numero,
              cidade: cidade,
              uf: estado,
              pais: "BR",
            },
          },
        })
        .then((res) => {
          setResponseType("success");
          setOpen(true);
          setResponseMsg("PF criado com sucesso, redirecionando...");
          setTimeout(() => {
            navigate("/Login");
          }, 3000);
        })
        .catch(function (error) {
          if (error.response) {
            // Erro: resposta com status diferente de 200

            console.log(error.response);
            if (error.response.data.status == 400) {
              setResponseMsg(error.response.data.error);
            }

            setOpen(true);
            setResponseType("error");
          } else {
            // Erro na requisição
            console.error("Erro na requisição:", error);
          }
          // Aqui você pode tratar o erro ou tomar alguma ação específica
        });
    } else {
      if (!isCPF(cpf)) {
        setCpfError(true);
        setCpfErrorText("Insira um CPF válido.");
      } else {
        setCpfError(false);
        setCpfErrorText("");
      }
      if (!isEmailValid(email)) {
        setMailError(true);
        setMailErrorText("Insira um e-mail válido.");
      } else {
        setMailError(false);
        setMailErrorText("");
      }
    }
  }

  return (
    <form className={signupStyle.signupForm}>
      <div className={signupStyle.firstLine}>
        <div className={signupStyle.leftColumn}>
          <Snackbar
            open={open}
            autoHideDuration={1500}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            style={{ marginBottom: "60px" }}
          >
            <Alert
              data-testid="alert"
              onClose={handleClose}
              severity={responseType}
              sx={{ width: "100%" }}
            >
              {responseMsg}
            </Alert>
          </Snackbar>
          <label htmlFor="name" className={signupStyle.formLabel}>
            Nome
          </label>
          <input
            className={signupStyle.formSmallerInput}
            type="text"
            id="name"
            name="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className={signupStyle.rightColumn}>
          <label htmlFor="surname" className={signupStyle.formLabel}>
            Sobrenome
          </label>

          <input
            className={signupStyle.formSmallerInput}
            type="text"
            id="surname"
            name="surname"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </div>
      </div>
      <label htmlFor="Cpf" className={signupStyle.formLabel}>
        CPF
      </label>
      <CpfTextField
        id="Cpf"
        error={cpfError}
        variant="standard"
        helperText={cpfErrorText}
        name="cpf"
        className="input-mui"
        value={cpf}
        onChange={(e) => setCPF(e.target.value)}
      />
      <label htmlFor="cep" className={signupStyle.formLabel}>
        CEP
      </label>
      <input
        className={signupStyle.formInput}
        type="number"
        id="cep"
        name="cep"
        value={cep}
        onBlur={handleCep}
        required
        onChange={(e) => setCep(e.target.value)}
      />

      <label htmlFor="logradouro" className={signupStyle.formLabel}>
        Endereço
      </label>
      <input
        className={signupStyle.formInput}
        type="text"
        id="logradouro"
        name="logradouro"
        defaultValue={endereco}
        required
      />
      <div className={signupStyle.firstLine}>
        <div className={signupStyle.leftColumn}>
          <label htmlFor="numero" className={signupStyle.formLabel}>
            Numero
          </label>
          <input
            className={signupStyle.formSmallerInput}
            type="number"
            id="numero"
            name="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
        </div>
        <div className={signupStyle.rightColumn}>
          <label htmlFor="complemento" className={signupStyle.formLabel}>
            Complemento
          </label>

          <input
            className={signupStyle.formSmallerInput}
            type="text"
            id="complemento"
            name="complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
      </div>
      <div className={signupStyle.firstLine}>
        <div className={signupStyle.leftColumn}>
          <label htmlFor="cidade" className={signupStyle.formLabel}>
            Cidade
          </label>
          <input
            className={signupStyle.formSmallerInput}
            type="text"
            id="cidade"
            name="cidade"
            defaultValue={cidade}
            required
          />
        </div>
        <div className={signupStyle.rightColumn}>
          <label htmlFor="estado" className={signupStyle.formLabel}>
            Estado
          </label>

          <input
            className={signupStyle.formSmallerInput}
            type="text"
            id="estado"
            name="estado"
            defaultValue={estado}
            required
          />
        </div>
      </div>

      <label htmlFor="email" className={signupStyle.formLabel}>
        E-mail
      </label>
      <TextField
        id="E-mail"
        variant="standard"
        className="input-mui"
        error={mailError}
        helperText={mailErrorText}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* <input 
        className={signupStyle.formInput}
        type="text"
        id="email" 
        name="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        /> */}

      <label htmlFor="password" className={signupStyle.formLabel}>
        Senha
      </label>
      <input
        className={signupStyle.formInput}
        type="password"
        id="password"
        name="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <label htmlFor="passwordConfirm" className={signupStyle.formLabel}>
        Confirmar Senha
      </label>
      <input
        className={signupStyle.formInput}
        type="password"
        id="passwordConfirm"
        name="passwordConfirm"
        required
      />
      <button
        className={signupStyle.signupButton}
        type="submit"
        onClick={handleSubmit}
      >
        Cadastrar
      </button>
    </form>
  );
}
export default SignupFormPessoaFisica;
