import { gql } from "@apollo/client";

export const DELETE_TOILET_LOCATION = gql`
  mutation deleteToiletLocation($deleteToiletLocationId: ID!) {
    deleteToiletLocation(id: $deleteToiletLocationId) {
      id
      name
    }
  }
`;

export const CREATE_TOILET_LOCATION = gql`
  mutation createToiletLocation($input: createToiletLocationInput!) {
    createToiletLocation(input: $input) {
      # id
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

export const UPDATE_TOILET_LOCATION = gql`
  mutation updateToiletLocation(
    $updateToiletLocationId: ID!
    $input: updateToiletLocationInput!
  ) {
    updateToiletLocation(id: $updateToiletLocationId, input: $input) {
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

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
      createdAt
      email
      id
      token
      username
      isAdmin
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
      isAdmin
    }
  }
`;
