import { useEffect, useState } from "react";
import { GET_TOILET_LOCATION_BY_NAME } from "../graphQL/queries/queries"; // Import qgl query
import Loader from "../Components/Loader";
import { useQuery} from "@apollo/client"; // The useQuery hook allows send a query and get the response
import {  Row, Col, Container } from "react-bootstrap";
import ToiletCard from "../Components/ToiletCard"; // Import Card component
// import ToiletEntry from "../Components/ToiletEntry";
import ToiletEdit from "../Components/ToiletEdit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
// import Map from "../googleMap/Map";
import { toast } from "react-toastify";
import styles from "../styles/searchResult.module.css";

function SearchResult({ searchText, user }) {
  const [searchResult, setSearchResult] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [toiletLocationId, setToiletLocationId] = useState("");
  // const handleToiletLocationId = (id) => {
  //   setToiletLocationId(id);
  // };

  // GraphQL Query to get the location
  const { loading, error, data, refetch } = useQuery(
    GET_TOILET_LOCATION_BY_NAME,
    {
      variables: { toiletLocationName: searchText },
      context: {
        headers: {
          authorization: `${user.token}`,
        },
      },
    }
  );

  useEffect(() => {
    refetch(); // Refetch the query
  }, [data]);

  // if loading is false, set searchResult to empty array or toiletLocationByName
  useEffect(() => {
    if (!loading) {
      setSearchResult(data?.toiletLocationByName || []);
    }
  }, [data, loading]);

  // if loading is true,show loader components
  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    toast.error(error);

    return (
      <div style={{ height: "79vh", textAlign: "center", paddingTop: "35vh" }}>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          size="2xl"
          style={{ color: "#000000" }}
        />{" "}
        No data can be retrieved this time, try again later
      </div>
    );
  }


  return (
    <Container fluid>
      <div className={styles.container}>
        {/* hidden toilet EDIT panel */}
        {showEdit && (
          <ToiletEdit
            user={user}
            setShowEdit={setShowEdit}
            refetch={refetch}
            toiletLocationId={toiletLocationId}
          />
        )}
        <div className="d-flex mx-auto mt-3">
          {" "}
          <h2>Search result: {searchResult.length}</h2>
        </div>

        <Row className="mt-3">
          {searchResult &&
            searchResult?.map((location,index) => (
              <Col sm={6} md={6} lg={4} className="mb-3 " key={`toilet-${index}`}>
                <ToiletCard
                  location={location}
                  user={user}
                  setShowEdit={setShowEdit}
                  toiletLocationId={toiletLocationId}
                   setToiletLocationId={setToiletLocationId}
                />
              </Col>
            ))}
        </Row>
      </div>{" "}
    </Container>
  );
}

export default SearchResult;
