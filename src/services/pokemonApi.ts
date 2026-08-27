import type {
  PokemonDetailsResponse,
  PokemonListResponse,
  PokemonSpeciesResponse,
  EvolutionChainResponse,
} from '@/types/pokemonTypes'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'
const SPECIES_API_URL = 'https://pokeapi.co/api/v2/pokemon-species'

const pokemonListCache = new Map<string, PokemonListResponse>()
const pokemonDetailsCache = new Map<string, PokemonDetailsResponse>()
const pokemonSpeciesCache = new Map<string, PokemonSpeciesResponse>()
const evolutionChainCache = new Map<string, EvolutionChainResponse>()

export class PokemonApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)

    this.name = 'PokemonApiError'
    this.status = status
  }
}

export async function getPokemonList(
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListResponse> {
  const cacheKey = `${limit}:${offset}`
  const cachedList = pokemonListCache.get(cacheKey)

  if (cachedList) {
    return cachedList
  }

  const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: PokemonListResponse = await response.json()

  pokemonListCache.set(cacheKey, data)

  return data
}

export async function getPokemonDetails(name: string): Promise<PokemonDetailsResponse> {
  const cachedPokemon = pokemonDetailsCache.get(name)
  if (cachedPokemon) {
    return cachedPokemon
  }

  const response = await fetch(`${API_URL}/${name}`)
  if (!response.ok) {
    throw new PokemonApiError(`HTTP error: status ${response.status}`, response.status)
  }

  const data: PokemonDetailsResponse = await response.json()

  pokemonDetailsCache.set(name, data)

  return data
}

export async function getPokemonSpecies(name: string): Promise<PokemonSpeciesResponse> {
  const normalizedName = name.trim().toLowerCase()
  const cachedSpecies = pokemonSpeciesCache.get(normalizedName)

  if (cachedSpecies) {
    return cachedSpecies
  }

  const response = await fetch(`${SPECIES_API_URL}/${normalizedName}`)
  if (!response.ok) {
    throw new PokemonApiError(`HTTP error: status ${response.status}`, response.status)
  }

  const data: PokemonSpeciesResponse = await response.json()

  pokemonSpeciesCache.set(normalizedName, data)

  return data
}

export async function getEvolutionChain(url: string): Promise<EvolutionChainResponse> {
  const cachedChain = evolutionChainCache.get(url)
  if (cachedChain) {
    return cachedChain
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new PokemonApiError(`HTTP error: status ${response.status}`, response.status)
  }

  const data: EvolutionChainResponse = await response.json()

  evolutionChainCache.set(url, data)

  return data
}
export async function getPokemonDetailsWithSpecies(identifier: string): Promise<{
  pokemon: PokemonDetailsResponse
  species: PokemonSpeciesResponse
}> {
  const normalizedIdentifier = identifier.trim().toLowerCase()
  let pokemonData: PokemonDetailsResponse
  let speciesData: PokemonSpeciesResponse

  try {
    //Caso: identifier è gia un nome Pokemon valido
    pokemonData = await getPokemonDetails(normalizedIdentifier)

    //Ricaviamo il nome della specie dall'oggetto Pokemon
    speciesData = await getPokemonSpecies(pokemonData.species.name)
  } catch (err) {
    if (!(err instanceof PokemonApiError) || err.status !== 404) {
      throw err
    }

    //Caso identifier è un nome specie, ad esempio "Aegislash"
    speciesData = await getPokemonSpecies(normalizedIdentifier)

    const defaultVariety =
      speciesData.varieties.find((variety) => {
        return variety.is_default
      }) ?? speciesData.varieties[0]

    if (!defaultVariety) {
      throw new PokemonApiError(`Nessuna varietà trovata per ${normalizedIdentifier}`, 404)
    }

    pokemonData = await getPokemonDetails(defaultVariety.pokemon.name)
  }

  return {
    pokemon: pokemonData,
    species: speciesData,
  }
}
