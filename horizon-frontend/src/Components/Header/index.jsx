import headerStyle from "./style.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext} from "react";
import {FaBars, FaTimes} from "react-icons/fa"
import { AuthContext } from "../../contexts/auth";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle
} from "@mui/material";
import api from "../../services/api";


function Header() {

  // const{nome, sobrenome} = props
  const token = localStorage.getItem('token')
  const nome = localStorage.getItem("user_name")
  const sobrenome = localStorage.getItem("last_name")
  const [img, setImg] =useState('')
  const {removeUserStorage} = useContext(AuthContext)

  const navigate = useNavigate()

    // constante onde a classe "responsive_nav" vai ser inserida ou retirada sempre que a função "showNavbar" for ativa
    const navRef = useRef();


    //Adiciona ou retira a classe "responsive_nav" a const "navRef"
    const showNavbar = () => {
        navRef.current.classList.toggle(`${headerStyle.responsiveNav}`);
    }

    function nameInitialsAvatar(nome, sobrenome) {
      // var img = document.getElementById('user-image')
      setImg(`https://ui-avatars.com/api/?name=${nome}+${sobrenome}&bold=true&rounded=true&background=27187e&color=ffffff`)
      // let avatarUrl = `https://ui-avatars.com/api/?name=${nome}+${sobrenome}&bold=true&rounded=true&background=27187e&color=ffffff`
      // img.setAttribute('src', avatarUrl)
    }

    function logout(){
      removeUserStorage()
      navigate('/')
      // console.log('clicou em logout')
    }

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

  const [actualUrl, setActualUrl] = useState("");
  
  const [userType, setUserType] = useState();

  //Função para checar se o usuário é administrador ou não
  async function isAdmin(user_email){
    try {
      const response = await api.get(`/usuario/${user_email}`);
      const data = response.data;
      setUserType(data.authorities[0].id)
    } catch (error) {
      console.log("Não foi possível checar nível de acesso do usuário")
    }
  }

  useEffect(() => {
    setActualUrl(window.location.href);
    nameInitialsAvatar(nome, sobrenome);
    isAdmin(localStorage.getItem("user_mail"));
  }, [nome, sobrenome]);

  return (
    <header className={headerStyle.header}>
      
      <div className={headerStyle.logo}>
      <Link to="/"> 
        <img
          className={headerStyle.logoImg}
          src="..\src\assets\horizon-logo-with-letters-BnR.png"
          alt="Logo da Horizon Rental Cars"
        />
        <img
          className={headerStyle.logoImgMobile}
          src="..\src\assets\horizon-logo.png"
          alt="Logo mobile da Horizon Rental Cars"
        />
        </Link>
      </div>

      {actualUrl.includes("Login") ? (
        
        <div className={headerStyle.btns} ref={navRef}>
          <div className={headerStyle.tituloMenu}><p>Menu</p></div>
          <Link to="/Signup">
            <button className={headerStyle.signupBtn}>Cadastre-se</button>
          </Link>
          <button className={`${headerStyle.navBtn} ${headerStyle.navClosebtn}`} onClick={showNavbar}>
            <FaTimes />
        </button>
        </div>
      ) : actualUrl.includes("Signup") ? (
        <div className={headerStyle.btns} ref={navRef}>
          <div className={headerStyle.tituloMenu}><p>Menu</p></div>
          <Link to="/Login">
            <button className={headerStyle.loginBtn}>Iniciar Sessão</button>
          </Link>
          <button className={`${headerStyle.navBtn} ${headerStyle.navClosebtn}`} onClick={showNavbar}>
            <FaTimes />
          </button>
        </div>
        //Header para usuário logado do tipo admin
      ) : (token!==null && token != undefined) && (userType == 1) ?(
        //Header abaixo é para quando o usuário estiver logado
        <div className={headerStyle.btns} ref={navRef}>
          <div className={headerStyle.tituloMenu}><p>Menu</p></div>
          
          <div className={headerStyle.loginGreetings}>
          <Link to="/minhas-reservas">
          <img id="user-image"src={img} alt="" />
          </Link>
          {<p>Olá, {nome} {sobrenome}</p>}
          {/* <p>{nome !== null ? nome : "" } {sobrenome}</p> */}
          
          </div>
          <Link to="/AdminCMS">
          <button className={headerStyle.loginBtn}>Painel</button>
          </Link>
          <Link to="/">
          <button className={headerStyle.logoutBtn} onClick={handleClickOpen}>Logout</button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Deseja encerrar a sessão?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>Não</Button>
              <Button onClick={logout} autoFocus style={{ color: 'red'}}>
                Sim
              </Button>
            </DialogActions>
          </Dialog>
          </Link>
          <button className={`${headerStyle.navBtn} ${headerStyle.navClosebtn}`} onClick={showNavbar}>
            <FaTimes />
          </button>
        </div>
        //Header para usuário logado do tipo cliente
      ) : (token!==null && token != undefined) && (userType == 2) ?(
        //Header abaixo é para quando o usuário estiver logado
        <div className={headerStyle.btns} ref={navRef}>
          <div className={headerStyle.tituloMenu}><p>Menu</p></div>
          
          <div className={headerStyle.loginGreetings}>
          <img id="user-image"src={img} alt=""  />
          {<p>Olá, {nome} {sobrenome}</p>}
          {/* <p>{nome !== null ? nome : "" } {sobrenome}</p> */}
          
          </div>
          <div className={headerStyle.mobileBtns}>
          <Link to="/minhas-reservas">
          <button className={headerStyle.loginBtn}>Minhas Reservas</button>
          </Link>
          <Link to="/">
          <button className={headerStyle.logoutBtn} onClick={handleClickOpen}>Logout</button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Deseja encerrar a sessão?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>Não</Button>
              <Button onClick={logout} autoFocus style={{ color: 'red'}}>
                Sim
              </Button>
            </DialogActions>
          </Dialog>
          </Link>
          </div>
          <button className={`${headerStyle.navBtn} ${headerStyle.navClosebtn}`} onClick={showNavbar}>
            <FaTimes />
          </button>
        </div>
      ) : (
      <div className={headerStyle.btns} ref={navRef}>
        <div className={headerStyle.tituloMenu}><p>Menu</p></div>
        
        <Link to="/Signup">
            <button className={headerStyle.signupBtn}>Cadastre-se</button>
          </Link>
           <Link to="/Login">
            <button className={headerStyle.loginBtn}>Iniciar Sessão</button>
          </Link>

        <button className={`${headerStyle.navBtn} ${headerStyle.navClosebtn}`} onClick={showNavbar}>
          <FaTimes />
        </button>
      </div>)}


      <button className={headerStyle.navBtn} onClick={showNavbar}>
                <FaBars />
      </button>

    </header>
  );
}

export default Header;
