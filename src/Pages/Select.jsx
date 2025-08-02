import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Select = () => {
  const [role, setRole] = React.useState("user");
  const navigate = useNavigate();

  const handleNext = () => {
    console.log("Selected role:", role);
    localStorage.setItem('role',role)
    navigate('/registration')
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold">Are You a User or a Operator?</h2>

        <ToggleGroup
          type="single"
          value={role}
          onValueChange={(value) => {
            if (value) setRole(value);
          }}
          className="justify-center"
        >
          <ToggleGroupItem value="user" className="px-6 py-2 text-lg">
            User
          </ToggleGroupItem>
          <ToggleGroupItem value="operator" className="px-6 py-2 text-lg">
            Operator
          </ToggleGroupItem>
        </ToggleGroup>

        <p className="text-sm text-muted-foreground">
          You selected: <strong>{role}</strong>
        </p>

        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};

export default Select;


