
"use client";

import React, { use, useState } from "react";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ValidateHomeAcess} from "@/lib/ts/api";
import { showAlert, showError } from "@/lib/controller/alertsController";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Navegação

  // Estados dos campos principais

  const [items, setItems] = useState<ItemEntry[]>([]);
  const [itemsInfo, setItemsInfo] = useState<any>({})
  const [pageIsLoading, setPageIsLoading] = useState(true)
  const params = useParams();
  const id: any = params?.id ? params.id : null;


  if (pageIsLoading) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.loaderBox}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Carregando...</span>
        </div>
        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    );
    } else {
        return (
          <div className={styles.container}>
          <Sidebar />
          
        </div>
        )
}
}