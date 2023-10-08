// Importing the Nav component from react-bootstrap and the Link component from react-router-dom
import { Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthOceania } from "@fortawesome/free-solid-svg-icons";

// Defining the Header component that takes in the user and onLogout props
// user - The user object
// onLogout - The function to call when the user clicks the logout button
function Header({ user, onLogout }) {
  // Returning the JSX for the Header component
  return (
    <Container fluid>
      <Nav className=" justify-content-center d-flex flex-row bg-light w-100">
        {/* Rendering the title */}
        <div className="d-flex align-items-center">
          <div className="mr-2">
            <div className="rounded-circle ">
              <FontAwesomeIcon
                icon={faEarthOceania}
                size="2xl"
                style={{ color: "#FAA100" }}
                className="logo"
              />
            </div>
          </div>
          <div>
            <Link to="/" className="text-decoration-none">
              <h1 className="display-3 text-black bold p-0 m-0">
                Melbourne Public Toilet Map
              </h1>
            </Link>
          </div>
        </div>
        <br />
        {/* <h3>Let MPTM save your day!</h3> */}

        {/* Rendering the navigation links */}
        <div className="d-flex">
          {/* Rendering the toilet locations ONLY WHEN logged in */}
          {user ? (
            <Link to="/" className="nav-link background-hover px-3">
              Locations
              <i className="bi bi-journal-bookmark-fill ms-2"></i>
            </Link>
          ) : (
            <div className="nav-link px-5"></div>
          )}

          {/* Rendering the user profile and logout links if the user is logged in */}
          {user ? (
            <>
              <Link to="profile" className="nav-link background-hover px-3">
                {user.username}
                <i className="bi bi-person-fill ms-2"></i>
              </Link>

              <button onClick={onLogout} className="background-hover px-3">
                Logout
                <i className="bi bi-person-badge ms-2"></i>
              </button>
            </>
          ) : (
            // Rendering the sign up and login links if the user is not logged in
            <>
              <Link to="signup" className="nav-link background-hover px-3">
                Sign Up
                <i className="bi bi-person-badge ms-2"></i>
              </Link>
              <Link to="login" className="nav-link background-hover px-3">
                Login
                <i className="bi bi-person-badge ms-2"></i>
              </Link>
            </>
          )}
        </div>
      </Nav>
    </Container>
  );
}

// Exporting the Header component as the default export of this module
export default Header;
