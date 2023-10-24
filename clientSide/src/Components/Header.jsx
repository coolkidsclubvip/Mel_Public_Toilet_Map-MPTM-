import { Nav, Container } from "react-bootstrap";//import grid component from react-bootstrap
import { Link } from "react-router-dom"; //import internal Link component from react-router-dom
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";//import FontAwesomeIcon component from react-fontawesome
import {
  faEarthOceania,
  faMapLocation,
  faUserGear,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";//import icons from fortawesome(not fontawesome)
import styles from "../styles/header.module.css";//import styles from css module
import SearchBar from "./SearchBar"; // import custom SearchBar component 

// Defining the Header component that takes in the user and onLogout props
// user - The user object
// onLogout - The function to call when the user clicks the logout button

function Header({ user, onLogout, searchText, setSearchText }) { 


  return (
    <div className={styles.wrapper}>
      <Container>
        <Nav className=" justify-content-center d-flex flex-row w-100">
          {/* Rendering the title */}
          <div className="d-flex align-items-center">
            <div className="mr-2">
              <div className="rounded-circle ">
                <FontAwesomeIcon
                  icon={faEarthOceania}
                  size="2xl"
                  style={{
                    background: "linear-gradient(to top, #0dcaf0,red)",
                  }}
                  className="logo"
                />
              </div>
            </div>
            <div>
              <Link to="/" className="text-decoration-none">
                <h1 className={` text-black bold p-0 m-0 ${styles.title}`}>
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
            {user && (
              <Link to="/" className="nav-link background-hover px-3 m-3">
                <FontAwesomeIcon
                  icon={faMapLocation}
                  size="lg"
                  style={{ color: "#000000" }}
                />{" "}
                Locations
              </Link>
            )}

            {/* Rendering the user profile and logout links if the user is logged in */}
            {user ? (
              <>
                <Link
                  to="profile"
                  className="nav-link background-hover  px-3 m-3"
                >
                  <FontAwesomeIcon
                    icon={faUserGear}
                    size="lg"
                    style={{ color: "#000000" }}
                  />{" "}
                  {user.username}
                </Link>

                <button
                  onClick={onLogout}
                  className="background-hover  px-3 m-3"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    size="xl"
                    style={{ color: "#000000" }}
                  />{" "}
                  Logout
                </button>
              </>
            ) : (
              // Rendering the sign up and login links if the user is not logged in
              <>
                <Link
                  to="signup"
                  className="nav-link background-hover px-3 m-3"
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ color: "black" }}
                  />{" "}
                  Sign Up
                </Link>
                <Link to="login" className="nav-link background-hover px-3 m-3">
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    style={{ color: "black" }}
                  />
                  {""} Login
                </Link>
              </>
            )}

            {/* search bar */}

            <SearchBar setSearchText={setSearchText} />

            {/* search bar ends */}
          </div>
        </Nav>
      </Container>
    </div>
  );
}

// Exporting the Header component as the default export of this module
export default Header;
