import { useState, createContext } from "react";

export const AddDataContext = createContext();
export const UpdateDataContext = createContext();
export const DeleteDataContext = createContext();

const ContextProvider = ({ children }) => {
  const [userAdd, setUserAdd] = useState("");
  const [userUpdate, setUserUpdate] = useState("");
  const [userDelete, setUserDelete] = useState("");
  return (
    <AddDataContext.Provider value={{ userAdd, setUserAdd }}>
      <UpdateDataContext.Provider value={{ userUpdate, setUserUpdate }}>
        <DeleteDataContext.Provider value={{ userDelete, setUserDelete }}>
          {children}
        </DeleteDataContext.Provider>
      </UpdateDataContext.Provider>
    </AddDataContext.Provider>
  );
};

export default ContextProvider;
