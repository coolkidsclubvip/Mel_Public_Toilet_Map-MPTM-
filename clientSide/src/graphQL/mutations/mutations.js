import { gql } from "@apollo/client";

export const DELETE_TOILET_LOCATION = gql`
  mutation DeleteToiletLocation($deleteToiletLocationId: ID!) {
    deleteToiletLocation(id: $deleteToiletLocationId) {
      id
      name
   
    }
  }
`;

export const CREATE_TOILET_LOCATION = gql`
  mutation CreateToiletLocation($input: ToiletLocationInput!) {
    createToiletLocation(input: $input) {
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

export const UPDATE_TOILET_LOCATION = gql`
  mutation UpdateToiletLocation(
    $updateToiletLocationId: ID!
    $input: ToiletLocationInput!
  ) {
    updateToiletLocation(id: $updateToiletLocationId, input: $input) {
      name
      female
      male
      wheelchair
      operator
      baby_facil
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
      isAdmin
    }
  }
`;
