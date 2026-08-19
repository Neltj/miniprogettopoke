export interface PokemonResult {
  name: string
  url: string
}

export interface PokemonListItem {
  name: string
  url: string
  image: string | null
  shinyImage: string | null
  types: string[]
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonResult[]
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonDetailsResponse {
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    front_shiny: string | null
  }
  types: PokemonType[]
  abilities: PokemonAbility[]
  stats: PokemonStat[]
}

export interface PokemonAbility {
  is_hidden: boolean
  slot: number
  ability: {
    name: string
    url: string
  }
}

export interface PokemonFlavorTextEntry {
  flavor_text: string
  language: {
    name: string
    url: string
  }
  version: {
    name: string
    url: string
  }
}

export interface PokemonGenusEntry {
  genus: string
  language: {
    name: string
    url: string
  }
}

export interface PokemonSpeciesResponse {
  name: string
  flavor_text_entries: PokemonFlavorTextEntry[]
  genera: PokemonGenusEntry[]
  evolution_chain: {
    url: string
  }
}

export interface EvolutionNode {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionNode[]
}

export interface EvolutionChainResponse {
  chain: EvolutionNode
}
