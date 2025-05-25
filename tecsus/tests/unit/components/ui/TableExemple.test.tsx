import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TableExemple  from '../../../../src/components/ui/TableExemple'

describe('TableExemple', () => {
  it('renderiza a tabela com cabeçalho', () => {
    render(<TableExemple />)
  expect(screen.getByRole('grid')).toBeInTheDocument()

  })
})
