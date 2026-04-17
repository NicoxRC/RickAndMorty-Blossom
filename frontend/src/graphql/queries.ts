import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($filters: CharacterFiltersInput) {
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
      isFavorite
    }
  }
`;

export const GET_CHARACTER_DETAIL = gql`
  query GetCharacterDetail($id: Int!) {
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
      isFavorite
      comments {
        id
        content
        createdAt
      }
    }
  }
`;
