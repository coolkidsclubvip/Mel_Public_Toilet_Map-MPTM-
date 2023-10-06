import { useQuery } from "@apollo/client"; // The useQuery hook allows send a query and get the response
import JournalEntry from "../Components/JournalEntry"; // Import JournalEntry component
import JournalCard from "../Components/JournalCard"; // Import JournalCard component
import { useEffect } from "react";
import { GET_JOURNAL_ENTRIES } from "../graphQL/queries/queries"; // Import GET_JOURNAL_ENTRIES query

function Journal({ user }) {

  //The useQuery hook allows send a query and get the response
  //Loading = true while the request is in progress
  //Error = true if the request fails
  //Data = the response from the server
  //Refetch = a function that refetches the query

  //This query is protected by the JWT token. A valid token must be sent in the request header
  const { loading, error, data, refetch } = useQuery(GET_JOURNAL_ENTRIES, {
    context: {
      headers: {
        authorization: user.token,
      },
    },
  });

  useEffect(() => {
    refetch(); // Refetch the query
  }, []);

  if (loading) return <p>Loading... 🤔</p>;   //If the request is in progress, display a loading message
  if (error) return <p>Error 😭</p>; //If the request fails, display an error message

  return (
    <>
      {/* JournalEntry component */}
      <JournalEntry user={user} /> {/* Allows the user to add new entices */}
      {/* Display the journal entries in the JournalCard Component */}
      {data.journalEntries.map((data) => (
        <JournalCard key={data.id} data={data} user={user} />
      ))}
    </>
  );
}

export default Journal;
