import styles from "./user-header.module.css"

//supondo dados, depois trazer dados do usuario do banco
export default function UserHeader() {
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>Luís Octavio Barcelos</div>
        <div className={styles.badgeContainer}>
          <div className={styles.badge}>Adiministrador</div>
        </div>
      </div>
      <div className={styles.avatar}>
        <span className={styles.avatarText}>AM</span>
      </div>
    </div>
  )
}

