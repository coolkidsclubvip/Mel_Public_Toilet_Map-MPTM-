
import styles from "../styles/loader.module.css"

function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div></div>
    
  );
}

export default Loader