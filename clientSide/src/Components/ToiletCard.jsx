import { Card, Button } from "react-bootstrap"; //import the Card and Button components from react bootstrap
import { useMutation, gql } from "@apollo/client"; //import the useMutation hook from apollo client
import { Link } from "react-router-dom"; //import the Link component
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonDress,
  faPerson,
  faWheelchair,
  faBabyCarriage,
} from "@fortawesome/free-solid-svg-icons";
import { DELETE_TOILET_LOCATION } from "../graphQL/mutations/mutations"; //import the delete journal entry mutation
import Map from "../googleMap/Map";
import { toast } from "react-toastify";
import styles from "../styles/toiletCard.module.css";

//This component is used to display the journal entries on the home page
function ToiletCard({ location, user,setShowEdit,toiletLocationId,setToiletLocationId }) {
  // show deletion warning
  const [showWarning, setShowWarning] = useState(false);

  //useMutation hook to delete journal entries
  const [deleteJournalGQL] = useMutation(DELETE_TOILET_LOCATION, {
    context: {
      headers: {
        authorization: `${user.token}`,
      },
    },
    //update the cache to remove the deleted journal entry, (so NO NEED TO REFETCH )
    update(cache) {
      cache.modify({
        fields: {
          //remove the deleted journal entry from the journalEntries array
          //existingEntries is the array of journal entries
          //readField is a function that reads a field from the cache
          toiletLocations(existingEntries = [], { readField }) {
            //find the journal entry that was deleted and remove it from the array
            return existingEntries.filter(
              (entryRef) => location.id !== readField("id", entryRef)
            );
          },
        },
      });
    },
  });

  //handle delete function for toilet location
  const handleDelete = async () => {
    console.log(location.id);
    try {
      const result = await deleteJournalGQL({
        variables: { deleteToiletLocationId: location.id },
      });
      if (result.errors) {
        //if there are errors, throw an error
        throw new Error(result.errors[0].message);
      }
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete location: ${error.message}`);
    }
  };

  return (
    <>
      {/* // Modal starts */}

      {showWarning && (
        <div>
          <Card className={styles.modal}>
            <Card.Img variant="top" />
            <Card.Body>
              <Card.Title className="text-light">
                {" "}
                <h2>{location.name}</h2>
                <h3>
                  with all its records will be deleted,and is not recoverable.{" "}
                </h3>
                <h1>Are you sure?</h1>
              </Card.Title>
              <Card.Text> </Card.Text>
              <div className={styles.buttons}>
                {" "}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowWarning(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete(`${location.id}`);
                  }}
                >
                  {" "}
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      {/* // Modal ends */}

      <Card className={`shadow text-dark m-3`}>
        <Card.Body>
          <div className="d-flex">
            {/* <!--The div element for the map --> */}
            <div className={styles.mapSmall}>
            <Map location={location} /></div>

            {/* Displays the title and date of the journal entry */}
            <div className="title w-75 ">
              <Card.Title className="px-1">{location.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Operater:{location.operator}
              </Card.Subtitle>
              Facilities: <br />
              <span className="me-2 ms-2">
                {location.male ? (
                  <FontAwesomeIcon
                    icon={faPerson}
                    size="xl"
                    style={{ color: "#3f78d9" }}
                  />
                ) : null}
              </span>
              <span className="me-2">
                {location.female ? (
                  <FontAwesomeIcon
                    icon={faPersonDress}
                    size="xl"
                    style={{ color: "#e44978" }}
                  />
                ) : null}
              </span>
              <span className="me-2">
                {location.wheelchair ? (
                  <FontAwesomeIcon icon={faWheelchair} size="xl" />
                ) : null}
              </span>
              <span className="me-2">
                {location.baby_facil ? (
                  <FontAwesomeIcon
                    icon={faBabyCarriage}
                    size="xl"
                    style={{ color: "green" }}
                  />
                ) : null}
              </span>
            </div>

            {/* Displays the edit and delete buttons */}
            <div className="ms-auto">
              <Button
                
                // to={`/toiletLocations/edit/${location.id}`}
                variant="dark"
                size="sm"
                className="btn btn-dark rounded-circle inner-shadow"
                onClick={() => {
                  setShowEdit(true);
                  setToiletLocationId(location.id);
                }}
              >
                <i className="bi bi-scissors text-white"></i>
              </Button>
              <Button
                variant="dark"
                size="sm"
                className="rounded-circle inner-shadow mt-1"
                onClick={() => {
                  setShowWarning(true);
                }}
              >
                <i className="bi bi-trash2-fill text-white"></i>
              </Button>
              {/* /Displays the edit and delete buttons */}
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default ToiletCard;
