import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <ModalContext.Provider value={{ selectedMovie, setSelectedMovie }}>
      {children}
    </ModalContext.Provider>
  );
};
