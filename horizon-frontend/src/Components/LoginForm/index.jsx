import loginStyle from "./style.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import {
  Snackbar,
  Alert,
  TextField,
  
  IconButton,
  InputAdornment,
  Input,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../contexts/auth";

function LoginForm() {
  const [mailError, setMailError] = useState(false);
  const [mailErrorText, setMailErrorText] = useState(" ");
  const [passError, setPassError] = useState(false);
  const [passErrorText, setPassErrorText] = useState(" ");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseType, setResponseType] = useState("info");
  const [responseMsg, setResponseMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const navigate = useNavigate();
  const {saveName, saveLastName, saveToken, token, setToken, saveMail} = useContext(AuthContext)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (username == "") {
      setMailErrorText("Insira o e-mail");
      setMailError(true);
    } else {
      if (isEmailValid(username)) {
        setMailError(false);
        setMailErrorText(" ");
        if (password == "") {
          setPassErrorText("Insira uma senha.");
          setPassError(true);
        } else {
          setPassError(false);
          setPassErrorText("");
          if (isEmailValid(username)) {
            validateUser(username, password);
          }
        }
      } else {
        setMailError(true);
        setMailErrorText("E-mail inserido está inválido");
      }
    }

  }

 async function validateUser(user, pass) {
  api.post('/auth', {
    username: user,
    password: pass
  })
    .then(function (res) {
      // Sucesso: status 200
      console.log('Requisição bem-sucedida');
      // Aqui você pode realizar ações adicionais com a resposta, se necessário
      saveToken(res.data.token)
      setToken(res.data.token)
      const nome = res.data.pessoa.nome
      saveName(nome)
      
      const sobrenome = res.data.pessoa.sobrenome
      saveLastName(sobrenome)
      const email = res.data.pessoa.mail
      saveMail(email)
        navigate("/", {
          state: {
            user_name: localStorage.getItem('user_name'),
            user_surname: localStorage.getItem('last_name')
        }
      });
      
    })
    .catch(function (error) {
      if (error.response) {
        // Erro: resposta com status diferente de 200
        setMailError(true)
        setPassError(true)
        setOpen(true);
        setResponseType("error");
        setResponseMsg(
          "Por favor, tente novamente, suas credenciais são inválidas."
        );
        console.log(error.response);
      } else {
        // Erro na requisição
        console.error('Erro na requisição:', error);
      }
      // Aqui você pode tratar o erro ou tomar alguma ação específica
    });
   

 
  }


  return (
    <div className={loginStyle.loginContainer}>
      <div className={loginStyle.content}>
        <h1 className={loginStyle.title}>Iniciar Sessão</h1>
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
            severity={responseType ? responseType: "info"}
            
            sx={{ width: "100%" }}
          >
            {responseMsg}
          </Alert>
        </Snackbar>

        <form className={loginStyle.loginForm} onSubmit={handleSubmit}>
          <label className={loginStyle.formLabel} htmlFor="login">
            Login
          </label>

          <TextField
            error={mailError}
            id="login"
            data-testid="login"
            label=""
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText={mailErrorText}
          />

          <label className={loginStyle.formLabel} htmlFor="password">
            Senha
          </label>
          <Input
            error={passError}
            id="password"
            data-testid="password"
            onFocus={handleInputFocus}
            onBlur={showPassword ? null : handleInputBlur}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                {isInputFocused ? (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ) : null}
              </InputAdornment>
            }

            
          />
          {passError ? (
            <FormHelperText error>{passErrorText}</FormHelperText>
          ) : (
            " "
          )}
          <button className={loginStyle.loginButton} data-testid="submitBtn" type="submit">
            Entrar
          </button>
        </form>
        <span className={loginStyle.span}>
          Ainda não tem conta?
          <Link to="/Signup" className={loginStyle.signupSpan}>
            Registre-se
          </Link>
        </span>
      </div>
    </div>
  );
}
export default LoginForm;
