import React from "react";
import { Card, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import img from "../images/groupthink-blog-650x650-c-default.jpg";
import styles from "../styles/profile.module.css";

function Profile() {
  // 从 Session Storage 中获取用户信息
  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className={styles.card}>
        <div className={styles.img}></div>
        <Card.Body>
          <Card.Title>User Information:</Card.Title>

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
            BACK
          </button>
        </Link>
      </Card>
    </Container>
  );
}

export default Profile;
