export interface Abbreviation {
    id: number,
    name: string,
    user?: {
        id: number,
        username: string
    }
}
