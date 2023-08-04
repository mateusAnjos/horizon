import signupStyle from './style.module.css'
import getCep from '../../services/cep'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useNavigate } from "react-router-dom";
import {isCNPJ} from 'validation-br'
import CnpjTextField from '../CnpjTextField';
import { TextField} from '@mui/material';
import { Snackbar, Alert } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';



function SignupFormPessoaJuridica(){
    const theme = createTheme();
    const navigate = useNavigate();

    const [autocomplete, setAutocomplete] =useState([])
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nomeFantasia, setNomeFantasia] =useState('')
    const [cnpj, setCNPJ] = useState('')
    const [cep,setCep]=useState('')
    const [numero, setNumero]=useState('')
    const [complemento,setComplemento]=useState('')
    const [email, setEmail]=useState('')
    const [senha, setSenha]=useState('')
    const [endereco, setEndereco] =useState("")
    const [cidade, setCidade] =useState("")
    const [estado, setEstado] =useState("")
    const [mailError, setMailError] = useState(false);
    const [mailErrorText, setMailErrorText] = useState(" ");
    const [responseType, setResponseType] = useState("success");
    const [responseMsg, setResponseMsg] = useState("");
    const [cnpjError, setCnpjError] = useState(false);
const [cnpjErrorText, setCnpjErrorText] = useState(" ");
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        setEndereco(autocomplete.logradouro)
        setCidade(autocomplete.localidade)
        setEstado(autocomplete.uf)
        setOpen(true)
    },[autocomplete])

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
    
        async function fetchCep(cep){
            try{
                const response = await getCep.get(`/${cep}/json`)
                setAutocomplete(response.data);
                console.log(autocomplete)
                    
            } catch (error){
                console.log("CEP n encontrado")
                console.log(error)
            }
        }
    
    
        const handleCep =(e) =>{
            const cepToFetch = e.target.value.replace(/\D/g, "")
            if(cepToFetch.length===8){
                setCep(cepToFetch)
                fetchCep(cepToFetch)
                console.log("fetch funcionou")
               
            }
            
        }
    
        async function handleSubmit (e){
            e.preventDefault()
            if(isCNPJ(cnpj) && isEmailValid(email)){
                setCnpjError(false)
                setCnpjErrorText("")
                setMailError(false)
                setMailErrorText("")
                await api.post("/usuario", {
                    username:email,
                    password:senha,
                    authorities:[{id:2}],
                    pessoa:{
                        nome:razaoSocial,
                        sobrenome:nomeFantasia,
                        cnpj:cnpj,
                        tipo_pessoa:2,
                        endereco:{
                            cep:cep,
                            rua:endereco,
                            numero:numero,
                            cidade:cidade,
                            uf:estado,
                            pais:'BR'
                        }
                    },   
                }).then((res) => {
                    setOpen(true)
                    setResponseMsg("PJ criado com sucesso, redirecionando...")
                    setTimeout( () => {
                        navigate("/Login")
                    }, 3000)
                    
                }).catch(function (error) {
                    if (error.response) {
                      // Erro: resposta com status diferente de 200
                      
                      console.log(error.response);
                      if(error.response.data.status == 400){
                        setResponseMsg(error.response.data.error)
                      }
        
                     
                      setOpen(true)
                      setResponseType('error')
                    } else {
                      // Erro na requisição
                      console.error('Erro na requisição:', error);
                    }
                    // Aqui você pode tratar o erro ou tomar alguma ação específica
                  })
            }else{
                if(!isCNPJ(cnpj)){
                    setCnpjError(true)
                    setCnpjErrorText("Insira um CNPJ válido.")
                    }else{
                    setCnpjError(false)
                    setCnpjErrorText("")
                    }
                    if(!isEmailValid(email)){
                    setMailError(true)
                    setMailErrorText("Insira um e-mail válido.")
                    }else{
                        setMailError(false)
                    setMailErrorText("")
                    }
            }
            
            
        }
    
    

    return(
        <form className={signupStyle.signupForm} onSubmit={handleSubmit}>

        
            
            <label htmlFor="razaoSocial" className={signupStyle.formLabel}>
                Razão Social
            </label>
            <input 
            className={signupStyle.formInput}
            type="text"
            id="razaoSocial" 
            name="razaoSocial"
            value={razaoSocial}
            onChange={(e)=>setRazaoSocial(e.target.value)} 
            required
            />

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
            
            
            <label htmlFor="nomeFantasia" className={signupStyle.formLabel}>
                Nome Fantasia
            </label>

            <input 
            className={signupStyle.formInput}
            type="text"
            id="nomeFantasia" 
            name="nomeFantasia"
            value={nomeFantasia}
            onChange={(e)=>setNomeFantasia(e.target.value)}
            required
            />
            
        
        <label htmlFor="cnpj" className={signupStyle.formLabel}>
            CNPJ
        </label>
        <CnpjTextField id="Cnpj" 
                                error={cnpjError}variant='standard'
                                helperText={cnpjErrorText} name='cnpj' className='input-mui'
                                value={cnpj} onChange={(e)=>setCNPJ(e.target.value)}/>
        {/* <input
        className={signupStyle.formInput} 
        type="number"
        id='cnpj'
        name='cnpj' 
        value={cnpj}
        onBlur={handleCep}
        required
        onChange={(e)=>setCNPJ(e.target.value)}
        /> */}
        <label htmlFor="cep" className={signupStyle.formLabel}>
            CEP
        </label>
        <input
        className={signupStyle.formInput} 
        type="number"
        id='cep'
        name='cep' 
        value={cep}
        onBlur={handleCep}
        required
        onChange={(e)=>setCep(e.target.value)}
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
            onChange={(e)=>setNumero(e.target.value)}
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
            onChange={(e)=>setComplemento(e.target.value)}
        
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
            // defaultValue={cidade}
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
        <TextField id="E-mail" variant='standard' className='input-mui'
                                error={mailError}
                                helperText={mailErrorText}
                                value={email} onChange={(e)=>setEmail(e.target.value)}/>
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
        onChange={(e)=>setSenha(e.target.value)}
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
            >
            Cadastrar
            </button>
    </form>
    )
}
export default SignupFormPessoaJuridica