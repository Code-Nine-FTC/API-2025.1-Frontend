import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Searchbar from '../../../../src/components/ui/Searchbar'

describe('Searchbar', () => {
  it('renderiza o input de busca', () => {
    render(<Searchbar value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('dispara onChange ao digitar', async () => {
    const handleChange = jest.fn()
    render(<Searchbar value="" onChange={handleChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'teste')
    expect(handleChange).toHaveBeenCalled()
  })
})
