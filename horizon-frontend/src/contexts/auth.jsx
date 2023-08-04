import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({})

const AuthProvider =({children})=>{
    // const [token, setToken] =useState("")
    const [name, setName] =useState('')
    const [lastName, setLastName]=useState('')
    const [token, setToken] =useState('')
    const [mail, setMail] = useState('')

useEffect(()=>{
    const response = localStorage.getItem('user_name')
    setName(response)

})

function saveName(user_name){
    setName(user_name)
    localStorage.setItem('user_name', user_name)
}
function saveLastName(last_name){
    setLastName(last_name)
    localStorage.setItem('last_name', last_name)
}

function saveMail(mail){
    setMail(mail)
    localStorage.setItem('user_mail', mail)
}

function saveToken(token){
    setToken(token)
    localStorage.setItem('token', token)
}

function removeUserStorage(){
    localStorage.removeItem('user_name')
    localStorage.removeItem('last_name')
    localStorage.removeItem('user_mail') 
    localStorage.removeItem('token')
}
return(
    <AuthContext.Provider
    value={{name, lastName, token, saveName, saveLastName, removeUserStorage, saveToken, setToken, saveMail}}
    >
        {children}
    </AuthContext.Provider>
)

}
export default AuthProvider