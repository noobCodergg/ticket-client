import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { busDetails } from "@/Api/busApi";
import { UserContext } from "@/Context/UserContext";
import { postTicket } from "@/Api/ticketApi";

const BusDetails = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [bus, setBus] = useState(null);
  const { id } = useParams();
  const {userName} = useContext(UserContext)

  const fetchDetails = async () => {
    try {
      const response = await busDetails(id);
      console.log(response, "This");
      setBus(response.data);
    } catch (error) {
      console.error("Error fetching bus details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const confirmBooking = async() => {
    if (selectedSeats.length === 0) {
      alert("Please select seats");
      return;
    }
    setTicketGenerated(true);
    
    try{
        const res = await postTicket(userName, bus.company, bus.from, bus.to, bus.date, bus.departureTime, bus.fare,selectedSeats,id)
    }catch(error){
      console.log(error)
    }

  };

  if (!bus) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">Bus: {bus.coachNo}</h2>
          <p>Company: {bus.company}</p>
          <p>From: {bus.from} → To: {bus.to}</p>
          <p>Date: {bus.date}</p>
          <p>Departure: {bus.departureTime}</p>
          <p>Fare: ৳{bus.fare}</p>
        </CardContent>
      </Card>

      {!ticketGenerated && (
        <>
          <div className="grid grid-cols-4 gap-3">
  {bus.seats.map((seat) => (
    <Button
      key={seat._id || seat.seatNumber}
      variant={selectedSeats.includes(seat.seatNumber) ? "default" : "outline"}
      onClick={() => toggleSeat(seat.seatNumber)}
      disabled={seat.isBooked}  // Disable if already booked
      className={seat.isBooked ? "opacity-50 cursor-not-allowed" : ""}
    >
      {seat.seatNumber}
    </Button>
  ))}
</div>



          <div className="flex items-center gap-4 mt-4">
           
            <Button onClick={confirmBooking} className="mt-6">
              Confirm Booking
            </Button>
          </div>
        </>
      )}

      {ticketGenerated && (
        <Card>
          <CardContent className="pt-6 space-y-2">
            <h2 className="text-xl font-bold">🎫 Ticket</h2>
            <p>Name: {userName}</p>
            <p>Company: {bus.company}</p>
            <p>Bus: {bus.coachNo}</p>
            <p>Route: {bus.from} → {bus.to}</p>
            <p>Date: {bus.date}</p>
            <p>Departure: {bus.departureTime}</p>
            <p>Seats: {selectedSeats.join(", ")}</p>
            <p>Total Fare: ৳{bus.fare * selectedSeats.length}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusDetails;
