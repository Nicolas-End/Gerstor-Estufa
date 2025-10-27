import { toast } from "react-toastify";

export const showError = (text: string) => {
    toast.error(text, {
      style: {
        backgroundColor: "#fff",
        color: "#2b192e",
        fontFamily: "Arial, sans-serif",
      },
    });
}

export const showAlert = (text:string) =>{
    toast.warning(text, {
      style: {
        backgroundColor: "#fff",
        color: "#2b192e",
        fontFamily: "Arial, sans-serif",
      },
    });
}

export const showSucess = (text:string) =>{
    toast.success(text, {
      style: {
        backgroundColor: "#fff",
        color: "#2b192e",
        fontFamily: "Arial, sans-serif",
      },
    });
}

