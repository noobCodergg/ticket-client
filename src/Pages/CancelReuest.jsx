import { cancelTicket, getCancelleRequest, updateStatus } from '@/Api/ticketApi';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CancelRequest = () => {
  const [requests, setRequests] = useState([]);
  const [refresh,setRefresh] = useState(false)
  const fetchCancelledRequest = async () => {
    try {
      const response = await getCancelleRequest();
      setRequests(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCancelledRequest();
  }, [refresh]);

  const handleAccept = async(ticketId,busId) => {
    console.log('Accepted ticket:', ticketId);
    try{
      await cancelTicket(ticketId,busId)
      setRefresh(!refresh)
      alert("Accepted Successfully!")
    }catch(error){
        console.log(error)
    }
  };

  const handleReject = async(ticketId) => {
    
    try{
        await updateStatus(ticketId)
        setRefresh(!refresh)
        alert("Rejected Successfully!")
    }catch(error){
        console.log(error)
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Cancel Requests</h2>
      <Table>
        <TableCaption>All pending cancel requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Fare</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.company}</TableCell>
                <TableCell>{ticket.from} → {ticket.to}</TableCell>
                <TableCell>{ticket.date}</TableCell>
                <TableCell>{ticket.departureTime}</TableCell>
                <TableCell>{ticket.seats.join(', ')}</TableCell>
                <TableCell>৳{ticket.fare * ticket.seats.length}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="sm" variant="success" onClick={() => handleAccept(ticket._id,ticket.id)}>
                    Accept
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(ticket._id)}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                No cancel requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CancelRequest;
