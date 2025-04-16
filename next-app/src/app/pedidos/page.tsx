
import OrderItem from "@/Components/order-items"
import styles from "./page.module.css"
import Sidebar from "@/Components/sidebar"
export default function PedidosPage() {
  const orders = [
    { name: "Suculenta", quantity: 20, unit: "Caixas" },
    { name: "Cactos", quantity: 20, unit: "Caixas" },
    { name: "Pimenta", quantity: 60, unit: "porta vasos" },
    { name: "Túia", quantity: 10, unit: "Caixas" },
  ]

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Pedidos</h1>
          <div className={styles.count}>4</div>
        </div>

        <div className={styles.ordersList}>
          {orders.map((order, index) => (
            <OrderItem key={index} name={order.name} quantity={order.quantity} unit={order.unit} />
          ))}
        </div>
      </div>
    </div>
  )
}

