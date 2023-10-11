import { useQuery } from "@apollo/client"; // The useQuery hook allows send a query and get the response
import { Card, Button, Row, Col } from "react-bootstrap";
// import JournalEntry from "../Components/JournalEntry"; // Import JournalEntry component
import ToiletCard from "../Components/ToiletCard"; // Import JournalCard component
import ToiletEntry from "../Components/ToiletEntry";
import ToiletEdit from "../Components/ToiletEdit";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GET_TOILET_LOCATIONS } from "../graphQL/queries/queries"; // Import GET_JOURNAL_ENTRIES query
import styles from "../styles/toiletLocations.module.css";
import Map from "../googleMap/Map";

function ToiletLocations({ user }) {
  // click Add toilet button to show ToiletEntry panel
  const [showEntry, setShowEntry] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toiletLocationId, setToiletLocationId] = useState("");
  const handleToiletLocationId = (id) => {
    setToiletLocationId(id);
  };

  //This query is protected by the JWT token. A valid token must be sent in the request header
  const { loading, error, data, refetch } = useQuery(GET_TOILET_LOCATIONS, {
    context: {
      headers: {
        authorization: user.token,
      },
    },
  });

  useEffect(() => {
    refetch(); // Refetch the query
  }, []);

  if (loading) return <p>Loading... 🤔</p>; //If the request is in progress, display a loading message
  if (error) return <p>Error: No toilets😭</p>; //If the request fails, display an error message

  const locations = data.toiletLocations;

  return (
    <div className={styles.container}>
      {/* <MapCluster locations={locations} /> */}
      {/* BIG MAAAAAAAP*/}
      <div className={styles.mapContainer}>
        <Map location={locations} />
        {/* passing all locations to Map component */}
      </div>
      <div className="px-5 ">
        {/* hidden toilet ENTRY panel */}
        {showEntry && (
          <ToiletEntry
            user={user}
            setShowEntry={setShowEntry}
            refetch={refetch}
          />
        )}

        {/* hidden toilet EDIT panel */}
        {showEdit && (
          <ToiletEdit
            user={user}
            setShowEdit={setShowEdit}
            refetch={refetch}
            toiletLocationId={toiletLocationId}
          />
        )}

        <Row className="mt-3">
          {/* Add-new-toilet location card */}
          <Col sm={6} md={6} lg={4} className="mt-0">
            <Card
              className={`shadow text-dark m-3 align-items-center ${styles.addCard}`}
              onClick={() => {
                setShowEntry(true);
              }}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="title w-75">
                    <Card.Title className="bold">ADD A NEW LOO</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Save the tourists from their misery!
                    </Card.Subtitle>
                  </div>

                  <div
                    onClick={() => {
                      setShowEntry(true);
                    }}
                  >
                    <div className={styles.circle}>
                      <FontAwesomeIcon
                        icon={faPlus}
                        size="2xl"
                        className=" px-3 py-3 "
                      />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {locations.map((location) => (
            <Col sm={6} md={6} lg={4} className="mb-3" key={location.id}>
              <ToiletCard
                location={location}
                user={user}
                setShowEdit={setShowEdit}
                // toiletLocationId={toiletLocationId}
                setToiletLocationId={setToiletLocationId}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default ToiletLocations;
