import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

const sdl = `
  enum CharacterStatus {
    Alive
    Dead
    unknown
  }

  enum CharacterGender {
    Female
    Male
    Genderless
    unknown
  }

  type Character {
    id: Int!
    externalId: Int!
    name: String!
    status: CharacterStatus!
    species: String!
    gender: CharacterGender!
    image: String!
    origin: String!
    location: String!
    deletedAt: String
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
    isFavorite: Boolean!
  }

  type Comment {
    id: Int!
    characterId: Int!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  type Favorite {
    id: Int!
    characterId: Int!
    createdAt: String!
  }

  type ToggleFavoriteResult {
    added: Boolean!
  }

  input CharacterFiltersInput {
    name: String
    status: CharacterStatus
    species: String
    gender: CharacterGender
    origin: String
  }

  type Query {
    characters(filters: CharacterFiltersInput): [Character!]!
    character(id: Int!): Character
  }

  type Mutation {
    addComment(characterId: Int!, content: String!): Comment!
    toggleFavorite(characterId: Int!): ToggleFavoriteResult!
    softDeleteCharacter(id: Int!): Boolean!
  }
`;

export const typeDefs: DocumentNode = parse(sdl);
