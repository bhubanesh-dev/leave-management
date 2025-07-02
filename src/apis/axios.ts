import axios from "axios";

export default function initializeAxios(){
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    axios.defaults.withCredentials = true;
    
}