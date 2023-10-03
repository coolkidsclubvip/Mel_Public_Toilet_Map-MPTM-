const gql = require('graphql-tag');

const JournalEntryType = gql`
  type JournalEntry {
    id: ID!
    title: String!
    body: String!
    mood: Int!
    createdAt: String!
    updatedAt: String!
    user: ID!
  }

  input JournalEntryInput {
    title: String!
    body: String!
    mood: Int!
    user: ID!
  }

  type JournalEntryMutationResponse {
    id: ID!
    title: String!
    body: String!
    mood: Int!
    createdAt: String!
    updatedAt: String!
    user: ID!
  }

  type Query {
    journalEntry(id: ID!): JournalEntry
    journalEntries: [JournalEntry]
    searchJournalEntries(title: String!): [JournalEntry]
  }

  type Mutation {
    createJournalEntry(input: JournalEntryInput!): JournalEntryMutationResponse!
    updateJournalEntry(id: ID!, input: JournalEntryInput!): JournalEntryMutationResponse!
    deleteJournalEntry(id: ID!): JournalEntryMutationResponse!
  }
`;

module.exports = JournalEntryType;