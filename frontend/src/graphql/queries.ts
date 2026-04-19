import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($filters: CharacterFiltersInput, $userId: Int!) {
    characters(filters: $filters) {
      id
      name
      status
      species
      gender
      image
      origin
      location
      deletedAt
      isFavorite(userId: $userId)
    }
  }
`;

export const GET_CHARACTER_DETAIL = gql`
  query GetCharacterDetail($id: Int!, $userId: Int!) {
    character(id: $id) {
      id
      externalId
      name
      status
      species
      gender
      image
      origin
      location
      deletedAt
      createdAt
      updatedAt
      isFavorite(userId: $userId)
      comments {
        id
        userId
        userName
        content
        createdAt
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    userById(id: $id) {
      id
      name
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_NAME = gql`
  query GetUserByName($name: String!) {
    userByName(name: $name) {
      id
      name
      role
      createdAt
      updatedAt
    }
  }
`;
