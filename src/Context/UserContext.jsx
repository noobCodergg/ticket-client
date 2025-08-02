import React, { useState, createContext } from "react";


export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId,setUserId]=useState(null)
  const [userName,setUserName]=useState(null)
  const [role,setRole] = useState(null)
  const [company,setCompany]=useState(null)

  return (
    <UserContext.Provider value={{ userId,setUserId,userName,setUserName,role,setRole,company,setCompany}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;