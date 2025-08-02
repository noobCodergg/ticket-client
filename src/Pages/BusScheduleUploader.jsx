import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { UserContext } from "@/Context/UserContext";
import { uploadBus } from "@/Api/busApi";

const BusScheduleUploader = () => {
    const {company} = useContext(UserContext)
  const [schedule, setSchedule] = useState({
    coachNo: "",
    from: "",
    to: "",
    fare: "",
    seatCount: "",
    departureTime: "",
    company:company
  });

  const [date, setDate] = useState(new Date());

  const handleChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const fullSchedule = {
      ...schedule,
      date: format(date, "yyyy-MM-dd"),
    };
    console.log(fullSchedule);
    try{
        const response = await uploadBus(fullSchedule)
        console.log(response)
    }catch(error){
        console.log(error)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 space-y-6 border rounded-2xl shadow-lg mt-20"
    >
      <h2 className="text-2xl font-semibold text-center">Upload Bus Schedule</h2>

      <Input
        name="coachNo"
        placeholder="Coach No (e.g. 1234A)"
        value={schedule.coachNo}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="from"
          placeholder="From (e.g. Dhaka)"
          value={schedule.from}
          onChange={handleChange}
        />
        <Input
          name="to"
          placeholder="To (e.g. Chittagong)"
          value={schedule.to}
          onChange={handleChange}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full text-left font-normal">
            {date ? format(date, "PPP") : "Select Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="fare"
          placeholder="Fare (e.g. 550)"
          type="number"
          min={0}
          value={schedule.fare}
          onChange={handleChange}
        />
        <Input
          name="seatCount"
          placeholder="Seat Numbers (e.g. 40)"
          type="number"
          min={1}
          step={1}
          value={schedule.seatCount}
          onChange={handleChange}
        />
      </div>

      <Input
        name="departureTime"
        placeholder="Departure Time"
        type="time"
        value={schedule.departureTime}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full mt-4">
        Submit Schedule
      </Button>
    </form>
  );
};

export default BusScheduleUploader;
