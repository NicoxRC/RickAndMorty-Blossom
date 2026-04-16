import cron from 'node-cron';
import axios from 'axios';
import {
  Character,
  CharacterStatus,
  CharacterGender,
} from '../models/character.model';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api/character';

interface ApiCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
}

interface ApiResponse {
  info: { pages: number };
  results: ApiCharacter[];
}

function toCharacterStatus(val: string): CharacterStatus {
  const valid: CharacterStatus[] = ['Alive', 'Dead', 'unknown'];
  return valid.includes(val as CharacterStatus)
    ? (val as CharacterStatus)
    : 'unknown';
}

function toCharacterGender(val: string): CharacterGender {
  const valid: CharacterGender[] = ['Female', 'Male', 'Genderless', 'unknown'];
  return valid.includes(val as CharacterGender)
    ? (val as CharacterGender)
    : 'unknown';
}

export async function syncCharacters(): Promise<void> {
  try {
    const firstPage = await axios.get<ApiResponse>(
      `${RICK_AND_MORTY_API}?page=1`,
    );
    const totalPages = firstPage.data.info.pages;
    const firstPageResults = firstPage.data.results;

    const remainingPageNumbers = Array.from(
      { length: totalPages - 1 },
      (_, i) => i + 2,
    );
    const remainingPages = await Promise.all(
      remainingPageNumbers.map((page) =>
        axios
          .get<ApiResponse>(`${RICK_AND_MORTY_API}?page=${page}`)
          .then((res) => res.data.results),
      ),
    );

    const allCharacters: ApiCharacter[] = [
      firstPageResults,
      ...remainingPages,
    ].flat();

    await Promise.all(
      allCharacters.map((char) =>
        Character.upsert({
          externalId: char.id,
          name: char.name,
          status: toCharacterStatus(char.status),
          species: char.species,
          gender: toCharacterGender(char.gender),
          image: char.image,
          origin: char.origin.name,
          location: char.location.name,
        }),
      ),
    );

    console.log(
      `[CharacterSyncJob] Sync completed at ${new Date().toISOString()} — ${allCharacters.length} characters upserted.`,
    );
  } catch (err) {
    console.error('[CharacterSyncJob] Sync failed:', err);
    throw err;
  }
}

export function startCharacterSyncJob(): void {
  cron.schedule('0 */12 * * *', () => {
    syncCharacters().catch((err) =>
      console.error('[CharacterSyncJob] Error:', err),
    );
  });
  console.log('[CharacterSyncJob] Scheduled every 12 hours.');
}
