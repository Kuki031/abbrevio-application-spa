import { Meaning } from "./meaning"

export interface Abbreviation {
    id: number,
    name: string,
    user?: {
        id: number,
        username: string
    }
    meanings: Meaning[]
}
