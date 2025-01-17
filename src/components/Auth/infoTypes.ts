export interface InfoData {
  users: number
  tools: number
  categories: Category[]
  transports: Transport[]
}

export interface Category {
  id: number
  name: string
}

export interface Transport {
  id: number
  name: string
}
