import { Card, Button } from "react-bootstrap"; //import the Card and Button components from react bootstrap
import { useMutation, gql } from "@apollo/client"; //import the useMutation hook from apollo client
import { Link } from "react-router-dom"; //import the Link component
import { DELETE_JOURNAL_ENTRY } from "../graphQL/mutations/mutations"; //import the delete journal entry mutation

//This component is used to display the journal entries on the home page
function JournalCard({ data, user }) {
  //function to convert the mood score to an emoji
  const scoreToEmoji = (score) => {
    const emojiSadToHappy = ["😀", "😐", "😭", "😠", "🤬"];
    return emojiSadToHappy[score];
  };
  //function to convert the timestamp to a date
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp)).toLocaleDateString();
    return toString(date);
  };

  //useMutation hook to delete journal entries
  const [deleteJournalEntry] = useMutation(DELETE_JOURNAL_ENTRY, {
    context: {
      headers: {
        authorization: `${user.token}`,
      },
    },
    //update the cache to remove the deleted journal entry
    update(cache) {
      cache.modify({
        fields: {
          //remove the deleted journal entry from the journalEntries array
          //existingEntries is the array of journal entries
          //readField is a function that reads a field from the cache
          journalEntries(existingEntries = [], { readField }) {
            //find the journal entry that was deleted and remove it from the array
            return existingEntries.filter(
              (entryRef) => data.id !== readField("id", entryRef)
            );
          },
        },
      });
    },
  });

  //handle delete function for journal entries
  const handleDelete = async () => {
    console.log(data.id);
    try {
      //delete the journal entry
      //deleteJournalEntryId is the id of the journal entry to be deleted
      const result = await deleteJournalEntry({
        variables: { deleteJournalEntryId: data.id },
      });
      if (result.errors) {
        //if there are errors, throw an error
        throw new Error(result.errors[0].message);
      }
    } catch (error) {
      console.error(`Failed to delete journal entry: ${error.message}`);
    }
  };

  return (
    <Card className={`shadow bg-${data.mood} text-white m-3`}>
      <Card.Body>
        <div className="d-flex">
          {/* Displays the mood emoji */}
          <div className="emoji display-6 me-2 p-2 rounded-circle inner-shadow-emoji">
            {scoreToEmoji(data.mood)}
          </div>
          {/* /Displays the mood emoji */}
          {/* Displays the title and date of the journal entry */}
          <div className="title">
            <Card.Title className="bold">{data.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <i className="bi bi-calendar-event"></i>{" "}
              {new Date(parseInt(data.createdAt)).toLocaleString()}
            </Card.Subtitle>
          </div>
          {/* /Displays the title and date of the journal entry */}
          {/* Displays the edit and delete buttons */}
          <div className="ms-auto">
            <Link
              to={`journal/edit/${data.id}`}
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
              onClick={handleDelete}
            >
              <i className="bi bi-trash2-fill text-white"></i>
            </Button>
            {/* /Displays the edit and delete buttons */}
          </div>
        </div>
        {/* Displays the body of the journal entry */}
        <Card.Text className="mt-2">{data.body}</Card.Text>
        {/* /Displays the body of the journal entry */}
      </Card.Body>
    </Card>
  );
}

export default JournalCard;
