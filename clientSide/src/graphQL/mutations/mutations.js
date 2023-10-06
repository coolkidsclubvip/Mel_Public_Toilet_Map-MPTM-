import { gql } from '@apollo/client';

export const DELETE_JOURNAL_ENTRY = gql`
  mutation DeleteJournalEntry($deleteJournalEntryId: ID!) {
    deleteJournalEntry(id: $deleteJournalEntryId) {
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

export const CREATE_JOURNAL_ENTRY = gql`
mutation CreateJournalEntry($input: JournalEntryInput!) {
  createJournalEntry(input: $input) {
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

export const UPDATE_JOURNAL_ENTRY = gql`
  mutation UpdateJournalEntry($updateJournalEntryId: ID!, $input: JournalEntryInput!) {
    updateJournalEntry(id: $updateJournalEntryId, input: $input) {
      id
      title
      body
      mood
    }
  }
`;

export const LOGIN_USER = gql`
mutation Login($input: LoginInput!) {
  loginUser(input: $input) {
    createdAt
    email
    id
    token
    username
  }
}
`;
export const CREATE_USER = gql`
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    createdAt
    token
  }
}
`;