import { gql } from "@apollo/client";

export const GET_TOILET_LOCATIONS = gql`
  query toiletLocations {
    toiletLocations {
      id
      name
      female
      male
      wheelchair
      operator
      baby_facil
      lon
      lat
    }
  }
`;

export const GET_TOILET_LOCATION = gql`
  query toiletLocation($toiletLocationId: ID!) {
    toiletLocation(id: $toiletLocationId) {
      id
      name
      female
      male
      wheelchair
      operator
      baby_facil
      lon
      lat
    }
  }
`;
