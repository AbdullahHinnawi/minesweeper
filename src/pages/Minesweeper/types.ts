
export type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborCount: number
}

export type Board = Cell[][]