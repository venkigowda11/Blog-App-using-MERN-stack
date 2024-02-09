import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [search, setSearch] = useState("");
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, search, setSearch }}>
      {children}
    </UserContext.Provider>
  );
}
