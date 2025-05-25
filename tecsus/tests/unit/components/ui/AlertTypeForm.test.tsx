import { render, screen } from '@testing-library/react'
import { AlertTypeForm } from '../../../../src/components/ui/AlertTypeForm'

describe('AlertTypeForm', () => {
  it('renderiza o formulário com título', () => {
    const mockOnSubmit = jest.fn()
    const mockStations: any[] = []
    const mockParameters: any[] = []
    const mockSetParameters = jest.fn()

    render(
      <AlertTypeForm
        onSubmit={mockOnSubmit}
        stations={mockStations}
        parameters={mockParameters}
        setParameters={mockSetParameters}
      />
    )

    expect(screen.getByText(/tipo de alerta/i)).toBeInTheDocument()
  })
})
