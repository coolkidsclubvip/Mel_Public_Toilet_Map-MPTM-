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

//  Option 1: search by name
export const GET_TOILET_LOCATION_BY_NAME = gql`
  query toiletLocationByName($toiletLocationName: String!) {
    toiletLocationByName(name: $toiletLocationName) {
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
//  Option 2: search by ID
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
