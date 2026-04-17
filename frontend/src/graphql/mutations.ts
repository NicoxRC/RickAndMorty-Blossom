import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
  mutation AddComment($characterId: Int!, $content: String!) {
    addComment(characterId: $characterId, content: $content) {
      id
      characterId
      content
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($characterId: Int!) {
    toggleFavorite(characterId: $characterId) {
      added
    }
  }
`;

export const SOFT_DELETE_CHARACTER = gql`
  mutation SoftDeleteCharacter($id: Int!) {
    softDeleteCharacter(id: $id)
  }
`;
