import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
  mutation AddComment($characterId: Int!, $content: String!, $userId: Int) {
    addComment(characterId: $characterId, content: $content, userId: $userId) {
      id
      characterId
      userId
      content
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($characterId: Int!, $userId: Int!) {
    toggleFavorite(characterId: $characterId, userId: $userId) {
      added
    }
  }
`;

export const SOFT_DELETE_CHARACTER = gql`
  mutation SoftDeleteCharacter($id: Int!, $userId: Int!) {
    softDeleteCharacter(id: $id, userId: $userId)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $role: Role!) {
    createUser(name: $name, role: $role) {
      id
      name
      role
      createdAt
      updatedAt
    }
  }
`;
