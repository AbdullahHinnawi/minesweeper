
export type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborCount: number
}

export type Board = Cell[][]

export type GameStatus = 'PLAYING' | 'WON' | 'LOST'