import { gql } from '@apollo/client';

export const GET_JOURNAL_ENTRIES = gql`
query JournalEntries {
  journalEntries {
    id
    title
    body
    mood
    createdAt
    updatedAt
    user
  }
}
`;

export const GET_JOURNAL_ENTRY = gql`
  query JournalEntry($journalEntryId: ID!) {
    journalEntry(id: $journalEntryId) {
      id
      title
      body
      mood
    }
  }
`;
