import styles from "../styles/footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoo } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <div className={styles.container}>
      {" "}
      <div>
        Lei{" "} 
        <FontAwesomeIcon icon={faPoo} size="sm" style={{ color: "#F8B12E" }} />{" "}
        2023
      </div>
    </div>
  );
}

export default Footer;
