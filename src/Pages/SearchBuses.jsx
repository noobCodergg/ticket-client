import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { getAllBuses } from "@/api/busApi"; // Import your API function
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const SearchBuses = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle calendar selection: convert Date -> yyyy-MM-dd string
  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
    } else {
      setDate("");
    }
  };

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBuses({ from, to, date });
      setBuses(data.data);
    } catch (err) {
      setError("Failed to fetch buses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleNavigate=(id)=>{
     navigate(`/details/${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {/* Search inputs */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-40">
              {date ? format(parseISO(date), "PPP") : "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date ? parseISO(date) : undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={fetchBuses} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Error message */}
      {error && <div className="text-red-600">{error}</div>}

      {/* Results table */}
      {buses.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coach No</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Departure Time</TableHead>
              <TableHead>Fare (৳)</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buses.map((bus, index) => (
              <TableRow key={index}>
                <TableCell>{bus.coachNo}</TableCell>
                <TableCell>{bus.company}</TableCell>
                <TableCell>{bus.from}</TableCell>
                <TableCell>{bus.to}</TableCell>
                <TableCell>{bus.date}</TableCell>
                <TableCell>{bus.departureTime}</TableCell>
                <TableCell>{bus.fare}</TableCell>
                <TableCell>{bus.seatCount}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={()=>handleNavigate(bus._id)}>
                    View Seats
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        !loading && (
          <p className="pt-6 text-center text-muted-foreground">No buses found.</p>
        )
      )}
    </div>
  );
};

export default SearchBuses;
