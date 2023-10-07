import { Card, Button } from "react-bootstrap"; //import the Card and Button components from react bootstrap
import { useMutation, gql } from "@apollo/client"; //import the useMutation hook from apollo client
import { Link } from "react-router-dom"; //import the Link component
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonDress, faPerson,faWheelchair,faBabyCarriage } from "@fortawesome/free-solid-svg-icons";
// import { DELETE_JOURNAL_ENTRY } from "../graphQL/mutations/mutations"; //import the delete journal entry mutation
import Map from "../googleMap/Map";
//This component is used to display the journal entries on the home page
function ToiletCard({ location, user }) {
  //   //useMutation hook to delete journal entries
  //   const [deleteJournalEntry] = useMutation(DELETE_TOILET_LOCATION, {
  //     context: {
  //       headers: {
  //         authorization: `${user.token}`,
  //       },
  //     },
  //     //update the cache to remove the deleted journal entry
  //     update(cache) {
  //       cache.modify({
  //         fields: {
  //           //remove the deleted journal entry from the journalEntries array
  //           //existingEntries is the array of journal entries
  //           //readField is a function that reads a field from the cache
  //           journalEntries(existingEntries = [], { readField }) {
  //             //find the journal entry that was deleted and remove it from the array
  //             return existingEntries.filter(
  //               (entryRef) => location.id !== readField("id", entryRef)
  //             );
  //           },
  //         },
  //       });
  //     },
  //   });

  //   //handle delete function for journal entries
  //   const handleDelete = async () => {
  //     console.log(location.id);
  //     try {
  //       //delete the journal entry
  //       //deleteJournalEntryId is the id of the journal entry to be deleted
  //       const result = await deleteJournalEntry({
  //         variables: { deleteJournalEntryId: location.id },
  //       });
  //       if (result.errors) {
  //         //if there are errors, throw an error
  //         throw new Error(result.errors[0].message);
  //       }
  //     } catch (error) {
  //       console.error(`Failed to delete journal entry: ${error.message}`);
  //     }
  //   };


  return (
 
      <Card className={`shadow text-dark m-3`}>
        {/* bg-${location.mood} */}
        <Card.Body>
          <div className="d-flex">
            {/* <!--The div element for the map --> */}
            <Map lng={location.lon} lat={location.lat} />

            {/* Displays the title and date of the journal entry */}
            <div className="title">
              <Card.Title className="">{location.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Operater:{location.operator}
              </Card.Subtitle>
              Facilities:
              <span className="me-2 ms-2">{location.male ? <FontAwesomeIcon icon={faPerson} size="xl" style={{color: "#3f78d9",}} /> : null }</span>
              <span className="me-2">
                {location.female  ? <FontAwesomeIcon icon={faPersonDress} size="xl" style={{color: "#e44978",}} />: null}
              
              </span>
              <span className="me-2">
                {location.wheelchair  ? <FontAwesomeIcon icon={faWheelchair} size="xl" /> : null}
              </span>
              <span className="me-2">
                {location.baby_facil  ? <FontAwesomeIcon icon={faBabyCarriage} size="xl" style={{color: "#14e147",}} /> : null}
              </span>
            </div>

            {/* Displays the edit and delete buttons */}
            <div className="ms-auto">
              <Link
                to={`journal/edit/${location.id}`}
                variant="dark"
                size="sm"
                className="btn btn-dark rounded-circle inner-shadow mx-2"
              >
                <i className="bi bi-scissors text-white"></i>
              </Link>
              <Button
                variant="dark"
                size="sm"
                className="rounded-circle inner-shadow"
                //     onClick={handleDelete}
              >
                <i className="bi bi-trash2-fill text-white"></i>
              </Button>
              {/* /Displays the edit and delete buttons */}
            </div>
          </div>
        </Card.Body>
      </Card>
    
  );
}

export default ToiletCard;
