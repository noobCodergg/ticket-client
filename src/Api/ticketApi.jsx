import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/ticket", 
    withCredentials: true,
  });


export const postTicket = (name, company, from, to, date, departureTime, fare,selectedSeats,id) =>API.post('/post-ticket',{name, company, from, to, date, departureTime, fare,selectedSeats,id})