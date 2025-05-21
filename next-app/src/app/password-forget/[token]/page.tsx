"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProdutoPage() {
  const router = useRouter();
  const params = useParams();

  // Verifica se o ID existe, se não existir torna-se null
  const token: any = params?.token ? params.token : null;

  return (
    <div>
      <h1>{decodeURIComponent(token)}</h1>
      
    </div>
  );
}