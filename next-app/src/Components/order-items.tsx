import styles from "./order-items.module.css"

interface OrderItemProps {
  name: string
  quantity: number
  unit: string
}

export default function OrderItem({ name, quantity, unit }: OrderItemProps) {
  return (
    <div className={styles.orderItem}>
      <div className={styles.orderName}>{name}</div>
      <div className={styles.orderQuantity}>
        <span className={styles.orderCount}>{quantity}</span>
        <span className={styles.orderUnit}>{unit}</span>
      </div>
    </div>
  )
}

