'use client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MeuComponente = () => {
  const mostrarAlerta = () => {
    toast("Esse é um alerta!");
  };

  return (
    <div>
      <button onClick={mostrarAlerta}>Mostrar Alerta</button>
      <ToastContainer />
    </div>
  );
};

export default MeuComponente;
