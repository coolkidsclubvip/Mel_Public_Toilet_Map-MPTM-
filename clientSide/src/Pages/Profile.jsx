import React from "react";
import { Card, Container, Button } from "react-bootstrap";
import {Link} from "react-router-dom"
import img from "../../public/images/groupthink-blog-650x650-c-default.jpg"
import styles from "./profile.module.css"

function Profile() {
  // 从 Session Storage 中获取用户信息
  const userInfo = JSON.parse(sessionStorage.getItem("user"));


  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <Card.Img
          variant="top"
          src={img}
          style={{ height: "50vh", width: "auto" }}
        />
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
                <b>Created At:</b>{" "}
                {new Date(Number(userInfo.createdAt)).toLocaleString()}
              </p>
            </div>
          )}
        </Card.Body>
        <Button className={styles.button}>
          {" "}
          <Link to="/">BACK TO HOMEPAGE</Link>
        </Button>
      </Card>
    </Container>
  );
}

export default Profile;
