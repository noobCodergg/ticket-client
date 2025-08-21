import { getTickets, updateStatus } from "@/Api/ticketApi";
import { UserContext } from "@/Context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";

const MyTickets = () => {
  const { userId } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [refresh,setRefresh] = useState(false)

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTicket = async () => {
    try {
      const response = await getTickets(userId);
      const data = response.data || [];
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.log(error);
    }
  };

  const isCancellable = (dateStr, timeStr) => {
    const departureDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const now = new Date();
    const hoursDifference = (departureDateTime - now) / (1000 * 60 * 60);
    return hoursDifference >= 4;
  };

  const handleCancel = async (ticketId) => {
    
    try {
      await updateStatus(ticketId);
      setRefresh(!refresh)
      alert("Request Placed Successfully! Wait for admin Response")
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate) {
      setFilteredTickets(
        tickets.filter((ticket) => ticket.date === selectedDate)
      );
    } else {
      setFilteredTickets(tickets);
    }
  };

  const downloadPDF = (ticket) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(" Bus Ticket", 105, 20, { align: "center" });

    doc.setFontSize(12);
    let y = 40;
    const lineGap = 10;
    doc.text(`Name: ${ticket.name}`, 20, y);
    y += lineGap;
    doc.text(`Company: ${ticket.company}`, 20, y);
    y += lineGap;
    doc.text(`Route: ${ticket.from} to ${ticket.to}`, 20, y);
    y += lineGap;
    doc.text(`Date: ${ticket.date}`, 20, y);
    y += lineGap;
    doc.text(`Departure: ${ticket.departureTime}`, 20, y);
    y += lineGap;
    doc.text(`Seats: ${ticket.seats.join(", ")}`, 20, y);
    y += lineGap;
    doc.text(`Total Fare: BDT ${ticket.fare * ticket.seats.length}`, 20, y);
    doc.save(`Ticket_${ticket.company}_${ticket.date}.pdf`);
  };

  useEffect(() => {
    fetchTicket();
  }, [refresh]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Tickets</h2>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filterDate}
            onChange={handleFilterChange}
            className="w-48"
          />
          {filterDate && (
            <Button
              variant="outline"
              onClick={() => {
                setFilterDate("");
                setFilteredTickets(tickets);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableCaption>Your booked tickets</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Operator</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Fare</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.company}</TableCell>
                <TableCell>
                  {ticket.from} → {ticket.to}
                </TableCell>
                <TableCell>{ticket.date}</TableCell>
                <TableCell>{ticket.departureTime}</TableCell>
                <TableCell>{ticket.seats.join(", ")}</TableCell>
                <TableCell>৳{ticket.fare * ticket.seats.length}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(ticket)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCancel(ticket._id)}
                    disabled={
                      !isCancellable(ticket.date, ticket.departureTime) ||
                      ticket.isCancelled !== null
                    }
                  >
                    {ticket.isCancelled === false ? "Pending" : "Cancel"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                No tickets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedTicket && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
              <DialogDescription>
                Details for ticket: <strong>{selectedTicket.company}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 mt-4">
              <p>
                <strong>Name:</strong> {selectedTicket.name}
              </p>
              <p>
                <strong>Company:</strong> {selectedTicket.company}
              </p>
              <p>
                <strong>Route:</strong> {selectedTicket.from} →{" "}
                {selectedTicket.to}
              </p>
              <p>
                <strong>Date:</strong> {selectedTicket.date}
              </p>
              <p>
                <strong>Departure:</strong> {selectedTicket.departureTime}
              </p>
              <p>
                <strong>Seats:</strong> {selectedTicket.seats.join(", ")}
              </p>
              <p>
                <strong>Total Fare:</strong> ৳
                {selectedTicket.fare * selectedTicket.seats.length}
              </p>
            </div>

            <DialogFooter className="mt-4 flex justify-between">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button onClick={() => downloadPDF(selectedTicket)}>
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyTickets;
