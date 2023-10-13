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

  input createToiletLocationInput {
    name: String
    female: Boolean
    male: Boolean
    wheelchair: Boolean
    operator: String
    baby_facil: Boolean
    lon: Float
    lat: Float
  }
  
  input updateToiletLocationInput {
    name: String
    female: Boolean
    male: Boolean
    wheelchair: Boolean
    operator: String
    baby_facil: Boolean
    lon: Float
    lat: Float
  }

  type Query {
    toiletLocations: [toiletLocation]
    toiletLocation(id: ID!): toiletLocation
    toiletLocationByName(name: String!): [toiletLocation]
  }

  type Mutation {
    createToiletLocation(input: createToiletLocationInput!): toiletLocation
    updateToiletLocation(
      id: ID!
      input: updateToiletLocationInput
    ): toiletLocation
    deleteToiletLocation(id: ID!): toiletLocation
  }
`;

module.exports = ToiletLocationType;
