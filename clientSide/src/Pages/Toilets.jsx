import { useQuery } from "@apollo/client"; // The useQuery hook allows send a query and get the response
import { Card, Button, Row, Col } from "react-bootstrap";
// import JournalEntry from "../Components/JournalEntry"; // Import JournalEntry component
import ToiletCard from "../Components/ToiletCard"; // Import JournalCard component
import { useEffect } from "react";
import { GET_TOILET_LOCATIONS } from "../graphQL/queries/queries"; // Import GET_JOURNAL_ENTRIES query

function Toilets({ user }) {
  //The useQuery hook allows send a query and get the response

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

  console.log(data.toiletLocations);
  const locations = data.toiletLocations;
  return (
    <>
      {/* <JournalEntry user={user} /> */}

      <Row className="mt-3">
        {/* 第一个卡片 */}

        {locations.map((location) => (
          <Col sm={12} md={6} className="mb-3" key={location.id}>
            <ToiletCard location={location} user={user} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Toilets;
