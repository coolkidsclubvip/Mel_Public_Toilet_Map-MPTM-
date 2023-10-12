import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/notFound.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
//Simple 404 page component
function NotFound() {
  return (
    <div className={styles.container}>
      <div style={{ height: "79vh", textAlign: "center", paddingTop: "35vh" }}>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          size="2xl"
          style={{ color: "#000000" }}
        />{" "}
        404, No page in this URL.
        <br/>
          <Link to="/" className="mt-3 btn btn-dark w-10 mt-5">
            <i className="bi bi-house-fill"></i> Go back to homepage
          </Link>
       
      </div>
    </div>
  );
}

export default NotFound;
