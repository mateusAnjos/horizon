import axios from "axios";

const getCep = axios.create({
  baseURL: "https://viacep.com.br/ws/",
});



export default getCep;



