import type { Options } from 'swagger-jsdoc';
import swaggerJsdoc from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rick & Morty API',
      version: '1.0.0',
      description:
        'GraphQL API for Rick and Morty characters. All operations are sent as POST to /graphql with a JSON body containing the GraphQL query/mutation.',
    },
    servers: [{ url: 'http://localhost:4000' }],
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      timestamp: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/graphql': {
        post: {
          summary: 'GraphQL endpoint',
          description: 'Send GraphQL queries and mutations here.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: {
                      type: 'string',
                      description: 'GraphQL query or mutation string',
                    },
                    variables: {
                      type: 'object',
                      description: 'GraphQL variables',
                    },
                    operationName: {
                      type: 'string',
                      description: 'Operation name (optional)',
                    },
                  },
                },
                examples: {
                  characters: {
                    summary: 'Query: List characters',
                    value: {
                      query:
                        '{ characters { id name status species gender image origin location isFavorite } }',
                    },
                  },
                  charactersFiltered: {
                    summary: 'Query: Filter characters by status',
                    value: {
                      query:
                        'query GetCharacters($filters: CharacterFiltersInput) { characters(filters: $filters) { id name status } }',
                      variables: { filters: { status: 'Alive' } },
                    },
                  },
                  characterById: {
                    summary: 'Query: Get character by ID',
                    value: {
                      query:
                        'query GetCharacter($id: Int!) { character(id: $id) { id name status comments { id content } } }',
                      variables: { id: 1 },
                    },
                  },
                  addComment: {
                    summary: 'Mutation: Add comment',
                    value: {
                      query:
                        'mutation AddComment($characterId: Int!, $content: String!) { addComment(characterId: $characterId, content: $content) { id content } }',
                      variables: { characterId: 1, content: 'Great character!' },
                    },
                  },
                  toggleFavorite: {
                    summary: 'Mutation: Toggle favorite',
                    value: {
                      query:
                        'mutation ToggleFavorite($characterId: Int!) { toggleFavorite(characterId: $characterId) { added } }',
                      variables: { characterId: 1 },
                    },
                  },
                  softDelete: {
                    summary: 'Mutation: Soft delete character',
                    value: {
                      query:
                        'mutation SoftDelete($id: Int!) { softDeleteCharacter(id: $id) }',
                      variables: { id: 1 },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'GraphQL response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'object' },
                      errors: {
                        type: 'array',
                        items: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
