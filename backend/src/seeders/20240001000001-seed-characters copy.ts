import axios from 'axios';
import { QueryInterface } from 'sequelize';

import type { ApiResponse } from '@/types/rickmorty-api.types';
import type { CharacterRow } from '@/types/character.types';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const response = await axios.get<ApiResponse>(
      `${process.env.RICK_MORTY_API_URL}?page=1`,
    );

    const characters: CharacterRow[] = response.data.results
      .slice(0, 15)
      .map((char) => ({
        external_id: char.id,
        name: char.name,
        status: char.status,
        species: char.species,
        gender: char.gender,
        image: char.image,
        origin: char.origin.name,
        location: char.location.name,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }));

    await queryInterface.bulkInsert('characters', characters, {});
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const externalIds = Array.from({ length: 15 }, (_, i) => i + 1);

    await queryInterface.bulkDelete(
      'characters',
      { external_id: externalIds } as Record<string, unknown>,
      {},
    );
  },
};
