import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { busDetails } from "@/Api/busApi";
import { UserContext } from "@/Context/UserContext";
import { postTicket } from "@/Api/ticketApi";
import jsPDF from "jspdf";

const BusDetails = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [bus, setBus] = useState(null);
  const { id } = useParams();
  const { userName,userId } = useContext(UserContext);

  const fetchDetails = async () => {
    try {
      const response = await busDetails(id);
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

  const generatePDF = () => {
    const doc = new jsPDF();

    // === HEADER ===
    doc.setFillColor(33, 150, 243); // Blue header
    doc.roundedRect(10, 10, 190, 15, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("BUS TICKET", 105, 20, { align: "center" });

    // === TICKET BODY ===
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 25, 190, 120, 3, 3, "F");

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);

    let y = 40;
    const gap = 8;

    const addRow = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 70, y);
      y += gap;
    };

    addRow("Name:", userName);
    addRow("Company:", bus.company);
    addRow("Bus No:", bus.coachNo);
    addRow("Route:", `${bus.from} to ${bus.to}`);
    addRow("Date:", bus.date);
    addRow("Departure:", bus.departureTime);
    addRow("Seats:", selectedSeats.join(", "));
   addRow("Fare per Seat:", `BDT ${bus.fare}`);
addRow("Total Fare:", `BDT ${bus.fare * selectedSeats.length}`);
    // Divider line before footer
    doc.setDrawColor(200);
    doc.line(10, y + 5, 200, y + 5);

    // === FOOTER ===
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Thank you for booking with us!", 105, y + 15, { align: "center" });
    doc.text("Please carry a valid ID during travel.", 105, y + 22, { align: "center" });

    doc.save(`Ticket_${bus.coachNo}_${bus.date}.pdf`);
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select seats");
      return;
    }
    setTicketGenerated(true);

    try {
      
      await postTicket(
        
        userName,
        bus.company,
        bus.from,
        bus.to,
        bus.date,
        bus.departureTime,
        bus.fare,
        selectedSeats,
        id,
        userId,
      );
    } catch (error) {
      console.log(error);
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
                disabled={seat.isBooked}
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
            <h2 className="text-xl font-bold">Ticket</h2>
            <p>Name: {userName}</p>
            <p>Company: {bus.company}</p>
            <p>Bus: {bus.coachNo}</p>
            <p>Route: {bus.from} to {bus.to}</p>
            <p>Date: {bus.date}</p>
            <p>Departure: {bus.departureTime}</p>
            <p>Seats: {selectedSeats.join(", ")}</p>
            <p>Total Fare: ৳{bus.fare * selectedSeats.length}</p>

            <Button onClick={generatePDF} className="mt-4">
              Download PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusDetails;
