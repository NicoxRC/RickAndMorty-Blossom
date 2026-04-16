import cron from 'node-cron';
import axios from 'axios';
import {
  Character,
  CharacterStatus,
  CharacterGender,
} from '../models/character.model';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api/character';
const SEED_COUNT = 15;

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
  return valid.includes(val as CharacterStatus) ? (val as CharacterStatus) : 'unknown';
}

function toCharacterGender(val: string): CharacterGender {
  const valid: CharacterGender[] = ['Female', 'Male', 'Genderless', 'unknown'];
  return valid.includes(val as CharacterGender) ? (val as CharacterGender) : 'unknown';
}

export async function syncCharacters(): Promise<void> {
  try {
    console.log(`[CharacterSyncJob] Starting sync at ${new Date().toISOString()}`);

    const { data } = await axios.get<ApiResponse>(`${RICK_AND_MORTY_API}?page=1`);
    const characters = data.results.slice(0, SEED_COUNT);

    for (const char of characters) {
      await Character.upsert({
        externalId: char.id,
        name: char.name,
        status: toCharacterStatus(char.status),
        species: char.species,
        gender: toCharacterGender(char.gender),
        image: char.image,
        origin: char.origin.name,
        location: char.location.name,
      });
    }

    console.log(`[CharacterSyncJob] Sync completed at ${new Date().toISOString()} — ${characters.length} characters updated.`);
  } catch (err) {
    console.error('[CharacterSyncJob] Sync failed:', err);
    throw err;
  }
}

export function startCharacterSyncJob(): void {
  cron.schedule('0 */12 * * *', () => {
    syncCharacters().catch((err) => console.error('[CharacterSyncJob] Scheduled sync error:', err));
  });
  console.log('[CharacterSyncJob] Scheduled every 12 hours.');
}
