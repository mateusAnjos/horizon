import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  // baseURL: "http://localhost:8080/",
  baseURL: "http://ec2-18-229-147-136.sa-east-1.compute.amazonaws.com:8080/",
  headers: {
    Authorization: `Bearer ${token ? token : ""}`,
  },
});

export default api;
