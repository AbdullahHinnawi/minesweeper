import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Board, Cell, GameStatus } from './types'

const ROWS = 8
const COLS = 8
const MINES = 10

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Board>([])
  const [firstClick, setFirstClick] = useState<boolean>(false)
  const [mineCount, setMineCount] = useState<number>(MINES)
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING')

  useEffect(() => {
    setBoard(initializeBoard())
    setFirstClick(true)
    setGameStatus('PLAYING')
  }, [])

  useEffect(() => {
    if (board.length === 0 || firstClick) return;

    let revealedCount = 0;
    let correctFlags = 0;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {

        const cell = board[row][col];

        if (cell.isFlagged && cell.isMine) correctFlags++;
        if (cell.isRevealed && !cell.isMine) revealedCount++;
      }
    }

    if (revealedCount === ROWS * COLS - MINES) {
      setGameStatus('WON');
    }
  }, [board, firstClick]);

  const getNeighborPositions = (row: number, col: number): Array<[number, number]> => {
    const directions = [-1, 0, 1] // Relative positions: up, same, down

    return directions
      .flatMap((r) => directions.map((c) => [row + r, col + c] as [number, number]))
      .filter(([r, c]) => {
        return (r !== row || c !== col) && r >= 0 && r < ROWS && c >= 0 && c < COLS
      })
  }

  // Calculate the count of neighbor mines
  const calculateMineNeighborCounts = (board: Board) => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))

    const nonMineCells: { cell: Cell; rowIndex: number; colIndex: number }[] = newBoard
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
      .filter(({ cell }) => !cell.isMine)

    nonMineCells.forEach(({ cell, rowIndex, colIndex }) => {
      const neighborPositions: [number, number][] = getNeighborPositions(rowIndex, colIndex)
      cell.neighborCount = neighborPositions.filter(([r, c]) => newBoard[r][c].isMine).length
    })

    return newBoard
  }

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
    return calculateMineNeighborCounts(newBoard)
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

  const revealEmptyCells = (board: Board, row: number, col: number): Board => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const stack: Array<[number, number]> = [[row, col]];

    while (stack.length > 0) {
      const lastElement = stack.pop() // Removes the last element from an array and returns it.
      if(!lastElement) break;

      const [currentRow, currentCol] = lastElement;

      if (currentRow < 0 || currentRow >= ROWS || currentCol < 0 || currentCol >= COLS) {
        continue;
      }

      const cell = newBoard[currentRow][currentCol];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) {
        continue;
      }

      cell.isRevealed = true;

      if (cell.neighborCount === 0) {
        const neighbors = getNeighborPositions(currentRow, currentCol);
        stack.push(...neighbors);
      }
    }

    return newBoard;
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'PLAYING') return

    const cell = board[row][col]
    let newBoard = board.map((row) => row.map((cell) => ({ ...cell })))

    // Handle first click
    if (firstClick) {
      newBoard = placeMinesRandomly(newBoard, row, col)
      newBoard = calculateMineNeighborCounts(newBoard)
      setFirstClick(false)
    }

    // If clicked on mine, set game status to lost and reveal all the mines
    if (newBoard[row][col].isMine) {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true
          }
        }
      }
      setGameStatus('LOST')
    }

    // Reveal cells
    if (newBoard[row][col].neighborCount === 0) {
      newBoard = revealEmptyCells(newBoard, row, col);
    } else {
      newBoard[row][col].isRevealed = true;
    }

    setBoard(newBoard)
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
    e.preventDefault() // Prevent opening right click menu
    if (gameStatus !== 'PLAYING') return

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
    if (!cell.isRevealed) return ''
    if (cell.isMine) return '💣'
    if(cell.neighborCount === 0) return ''
    return cell.neighborCount.toString()
  }

  const handleRestartGame = () => {
    setBoard(initializeBoard())
    setFirstClick(true)
    setMineCount(MINES)
    setGameStatus('PLAYING')
  }

  const getGameStatusEmoji = (gameStatus: GameStatus | undefined): string => {
    switch (gameStatus) {
      case 'WON':
        return '😎';
      case 'LOST':
        return '😔'
      case 'PLAYING':
        return '😀'
      default:
        return '😀'
    }
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
          <Typography sx={{fontSize: '36px'}}>{getGameStatusEmoji(gameStatus)}</Typography>
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
                bgcolor: cell.isMine && cell.isRevealed ? '#bc0000' : cell.isRevealed ? 'grey.200' : '#fff',
                '&:hover': {
                  bgcolor: cell.isMine && cell.isRevealed ? '#bc0000' : cell.isRevealed ? 'grey.200' : 'grey.300',
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
