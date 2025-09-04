import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Board, Cell, GameStatus } from './types'

const ROWS = 8
const COLS = 8
const MINES = 10

const Minesweeper = () => {
  const [board, setBoard] = useState<Board>([])
  const [firstClick, setFirstClick] = useState<boolean>(false)
  const [mineCount, setMineCount] = useState<number>(MINES)
  const [gameStatus, setGameStatus] = useState('')

  useEffect(() => {
    setBoard(initializeBoard())
    setFirstClick(true)
    setGameStatus('PLAYING')
  }, [])

  const initializeBoard = (): Board => {
    const newBoard = []
    for (let r = 0; r < ROWS; r++) {
      const currentRow = []
      for (let c = 0; c < COLS; c++) {
        currentRow.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0,
        })
      }
      newBoard.push(currentRow)
    }
    return newBoard
  }

  const placeMinesRandomly = (board: Board, firstClickRow: number, firstClickCol: number) => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell }))) // create new object for each cell
    let minesPlaced = 0

    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)

      if ((row === firstClickRow && col === firstClickCol) || newBoard[row][col].isMine) {
        continue
      }

      newBoard[row][col].isMine = true
      minesPlaced++
    }
    return newBoard
  }

  const handleCellClick = (row: number, col: number) => {
    const cell = board[row][col]
    let newBoard = board.map((row) => row.map((cell) => ({ ...cell })))

    // Handle first click
    if (firstClick) {
      newBoard = placeMinesRandomly(newBoard, row, col)
      setFirstClick(false)
    }

    setBoard(newBoard)
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
    e.preventDefault() // Prevent opening right click menu

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
    const cell = newBoard[row][col]

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged
      const updatedMineCount = cell.isFlagged ? mineCount - 1 : mineCount + 1
      setMineCount(updatedMineCount)
    }

    setBoard(newBoard)
  }

  const getCellContent = (cell: Cell): string => {
    if (cell.isFlagged) return '🚩'
    if (cell.isMine) return '💣'
    if (!cell.isRevealed) return ''
    return cell.neighborCount.toString()
  }

  const handleRestartGame = () => {
    setBoard(initializeBoard())
    setFirstClick(true)
    setMineCount(MINES)
    setGameStatus('PLAYING')
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h1" sx={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center' }} gutterBottom>
        Minesweeper
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Grid size={4} textAlign="center">
          <Typography variant="h6">{mineCount}</Typography>
        </Grid>
        <Grid size={4} textAlign="center">
          <Typography variant="h6">{gameStatus}</Typography>
        </Grid>
        <Grid size={4} textAlign="center">
          <Typography variant="h6">Timer</Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 0.2, aspectRatio: '1 / 1' }}>
        {board.map((row: Cell[], rowIndex: number) =>
          row.map((cell: Cell, colIndex: number) => (
            <Paper
              key={`${rowIndex}-${colIndex}`}
              elevation={1}
              sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                userSelect: 'none',
                cursor: 'pointer',
                bgcolor: cell.isMine && cell.isRevealed ? 'red' : cell.isRevealed ? 'grey.200' : '#fff',
                '&:hover': {
                  bgcolor: cell.isMine && cell.isRevealed ? 'red' : cell.isRevealed ? 'grey.200' : 'grey.300',
                },
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
            >
              {getCellContent(cell)}
            </Paper>
          ))
        )}
      </Box>

      <Box textAlign="center" mt={3}>
        <Button variant="contained" onClick={handleRestartGame}>
          Restart
        </Button>
      </Box>
    </Container>
  )
}

export default Minesweeper
