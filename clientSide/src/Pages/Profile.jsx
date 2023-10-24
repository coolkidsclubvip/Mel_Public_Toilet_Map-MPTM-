
import { Card, Container} from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/profile.module.css";

function Profile() {
  // get user info from Session Storage 
  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
      <Card className={styles.card}>
        <div className={styles.img}></div>
        <Card.Body>
          <Card.Title>User Information:</Card.Title>

{/* show user info board if user info is found */}
          {userInfo && (
            <div>
              <p>
                <b>Username: </b>
                {userInfo.username}
              </p>
              <p>
                <b>Email: </b>
                {userInfo.email}
              </p>
              <p>
                <b>ID:</b> {userInfo.id}
              </p>
              <p>
                <b>Admin:</b> {userInfo.isAdmin.toLocaleString()}
              </p>
              <p>
                <b>Created At:</b>{" "}
                {new Date(Number(userInfo.createdAt)).toLocaleString()}
              </p>
            </div>
          )}
        </Card.Body>
        <Link to="/">
          <button className={`${styles.button} w-100 p-3 text-light`}>
            Go back to Home Page
          </button>
        </Link>
      </Card>
    </Container>
  );
}

export default Profile;
