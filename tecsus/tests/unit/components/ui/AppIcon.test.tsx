import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import AppIcon from '../../../../src/components/ui/AppIcon'

describe('AppIcon', () => {
  it('renderiza o ícone especificado', () => {
    const { container } = render(<AppIcon name="Home" />)
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('não renderiza ícone inexistente', () => {
    const { container } = render(<AppIcon name="IconeQueNaoExiste" />)
    expect(container.firstChild).toBeNull()
  })
})
