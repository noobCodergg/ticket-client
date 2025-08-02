import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/bus", 
    withCredentials: true,
  });


export const uploadBus = (formData) =>API.post('/upload-bus',formData)
export const busDetails = (id) =>API.get(`/get-details/${id}`)
export const getAllBuses = ({ from, to, date }) =>
  API.get('/get-buses', {
    params: { from, to, date },
  });