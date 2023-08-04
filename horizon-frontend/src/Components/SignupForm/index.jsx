import signupStyle from './style.module.css'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import SignupFormPessoaFisica from '../SignupFormPessoaFisica'
import SignupFormPessoaJuridica from '../SignupFormPessoaJuridica'

function SignupForm(){

    const [checked, setChecked] = useState('')

    return(
       <div className={signupStyle.signupContainer}>
        {/* <div className={signupStyle.content}> */}
        <div className={checked === "pessoaFisica" ? signupStyle.contentPessoaFisica: checked === "pessoaJuridica"?signupStyle.contentPessoaJuridica:signupStyle.content }>

            <h1 className={signupStyle.title}>Criar Conta</h1>
                <div className={signupStyle.inputBox}>
                    <input 
                    type="radio" 
                    id="pessoaFisica" 
                    name="tipoDeCadastro" 
                    value="pessoaFisica"
                    onChange={(e)=>{setChecked(e.target.value)
                    console.log("form de pessoa física renderizado")
                    }}
                    />
                    <label htmlFor="pessoaFisica">Pessoa Física</label>
                    <input 
                    type="radio" 
                    id="pessoaJuridica" 
                    name="tipoDeCadastro" 
                    value="pessoaJuridica"
                    onChange={(e)=>{setChecked(e.target.value)
                        console.log("form de pessoa jurídica renderizado")
                    }}
                    />
                    <label htmlFor="pessoaJuridica">Pessoa Jurídica</label>
                </div>
                {
                    checked === "pessoaFisica" && 
                    <SignupFormPessoaFisica />
                    }
                    {
                    checked === "pessoaJuridica" && 
                    <SignupFormPessoaJuridica />
                    }

{/*                
            <form className={signupStyle.signupForm}>
                <div className={signupStyle.firstLine}>
                    <div className={signupStyle.leftColumn}>
                    <label htmlFor="name" className={signupStyle.formLabel}>
                        Nome
                    </label>
                    <input 
                    className={signupStyle.formSmallerInput}
                    type="text"
                    id="name" 
                    name="name"
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
                    required
                    />
                    </div>
                </div>

                <label htmlFor="email" className={signupStyle.formLabel}>
                    E-mail
                </label>
                <input 
                className={signupStyle.formInput}
                type="email"
                id="email" 
                name="email"
                required
                />

                <label htmlFor="password" className={signupStyle.formLabel}>
                    Senha
                </label>
                <input 
                className={signupStyle.formInput}
                type="password"
                id="password" 
                name="password"
                required
                />

                <label htmlFor="password" className={signupStyle.formLabel}>
                    Confirmar Senha
                </label>
                <input 
                className={signupStyle.formInput}
                type="password"
                id="password" 
                name="password"
                required
                />
                <button
                    className={signupStyle.signupButton}
                    type="submit"
                    >
                    Cadastrar
                    </button>
            </form> */}
            <span className={signupStyle.span}>
                    Já tem uma conta?
                    <Link to='/Login' className={signupStyle.loginSpan}>Iniciar Sessão</Link>
                </span>
        </div>
       </div>
    )
}

export default SignupForm