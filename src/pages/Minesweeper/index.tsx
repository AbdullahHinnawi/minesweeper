import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Board } from './types'

const ROWS = 8
const COLS = 8
const MINES = 10

const Minesweeper = () => {

  const [board, setBoard] = useState<Board>([])

  useEffect(() => {
    setBoard(initializeBoard())
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
          neighborCount: 0
        })
      }
      newBoard.push(currentRow)
    }
    return newBoard
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h1" sx={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center' }} gutterBottom>
        Minesweeper
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Grid size={4} textAlign="center">
          <Typography variant="h6">Mine count</Typography>
        </Grid>
        <Grid size={4} textAlign="center">
          <Typography variant="h6">Game status</Typography>
        </Grid>
        <Grid size={4} textAlign="center">
          <Typography variant="h6">Timer</Typography>
        </Grid>
      </Grid>

      <Box
        sx={{ display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 0.2, aspectRatio: '1 / 1',
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
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
                cursor: 'pointer'
              }}
              onClick={() => ''}
            >
              {rowIndex}-{colIndex}
            </Paper>
          ))
        )}
      </Box>

    </Container>
  )
}

export default Minesweeper
