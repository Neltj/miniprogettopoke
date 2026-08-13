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

export interface PokemonDetailsResponse {
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    front_shiny: string | null
  }
  types: PokemonType[]
}
