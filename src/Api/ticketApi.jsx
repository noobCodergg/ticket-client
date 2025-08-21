import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/ticket", 
    withCredentials: true,
  });


export const postTicket = (name, company, from, to, date, departureTime, fare,selectedSeats,id,userId) =>API.post('/post-ticket',{name, company, from, to, date, departureTime, fare,selectedSeats,id,userId})
export const getTickets = (userId) => API.get(`/get-tickets/${userId}`)
export const cancelTicket = (ticketId, busId) => 
  API.delete(`/cancel-ticket/${ticketId}`, { 
    data: { busId } 
  });

export const updateStatus = (ticketId) => API.put(`/update-isCancelled/${ticketId}`)
export const getCancelleRequest = () =>API.get('/get-cancelled-request')
