const gql = require("graphql-tag");

const ToiletLocationType = gql`
  type toiletLocation {
    id: ID!
    name: String!
    female: Boolean!
    male: Boolean!
    wheelchair: Boolean!
    operator: String!
    baby_facil: Boolean!
    #     graphQL supports Float type, and MongoDB schema doesn't
    lon: Float!
    lat: Float!
  }

  input addToiletLocationInput {
    name: String!
    female: Boolean!
    male: Boolean!
    wheelchair: Boolean!
    operator: String!
    baby_facil: Boolean!
    lon: Float!
    lat: Float!
  }
  input updateToiletLocationInput {
    name: String
    female: Boolean
    male: Boolean
    wheelchair: Boolean
    operator: String
    baby_facil: Boolean
  # location can not be updated
  }

  type Query {
    toiletLocations: [toiletLocation]
    toiletLocation(id: ID!): toiletLocation
  }

  type Mutation {
    addToiletLocation(input: addToiletLocationInput): toiletLocation
    updateToiletLocation(id: ID!, input: updateToiletLocationInput): toiletLocation
    deleteToiletLocation(id: ID!): toiletLocation
  }
`;

module.exports = ToiletLocationType;
