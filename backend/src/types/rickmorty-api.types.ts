export interface ApiCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
}

export interface ApiResponse {
  info: { pages: number };
  results: ApiCharacter[];
}
