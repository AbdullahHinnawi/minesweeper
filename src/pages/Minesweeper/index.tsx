import { Container, Typography } from '@mui/material'
import React from 'react'

const Minesweeper = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h1" sx={{fontSize: '48px', fontWeight: 'bold', textAlign: 'center'}} gutterBottom>Minesweeper</Typography>
    </Container>
  )
}

export default Minesweeper