import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StationForm } from "../StationForm";
import { ParameterTypeForm } from "../ParameterTypeForm";
import { AlertTypeForm } from "../AlertTypeForm";

jest.mock("../../services/api", () => ({
  links: {
    listParameterTypes: jest.fn().mockResolvedValue({
      success: true,
      data: [{ id: 1, name: "Temperatura" }],
    }),
    removeParameterFromStation: jest.fn().mockResolvedValue({ success: true }),
    getParametersByStation: jest.fn().mockResolvedValue({
      success: true,
      data: [{ id: 1, name_station: "Estação 1" }],
    }),
  },
}));

jest.mock("../../services/authContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));

describe("StationForm", () => {
  it("preenche e envia o formulário", async () => {
    const onSubmit = jest.fn();

    render(<StationForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome da estação/i), { target: { value: "Estação Teste" } });
    fireEvent.change(screen.getByLabelText(/UID/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/País/i), { target: { value: "Brasil" } });
    fireEvent.change(screen.getByLabelText(/Cidade/i), { target: { value: "Natal" } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: "RN" } });
    fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: "-5.8" } });
    fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: "-35.2" } });

    await waitFor(() => {
      expect(screen.getByText("Temperatura")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Estação Teste",
          uid: "123456",
          country: "Brasil",
          city: "Natal",
          state: "RN",
          latitude: "-5.8",
          longitude: "-35.2",
          parameter_types: [],
        })
      );
    });
  });
});

describe("ParameterTypeForm", () => {
  it("preenche e envia o formulário", () => {
    const onSubmit = jest.fn();

    render(<ParameterTypeForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome do Parâmetro/i), { target: { value: "Temp" } });
    fireEvent.change(screen.getByLabelText(/Unidade de Medida/i), { target: { value: "°C" } });
    fireEvent.change(screen.getByLabelText(/Casas Decimais/i), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText(/Offset/i), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText(/Fator/i), { target: { value: "1.2" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Temp",
      measure_unit: "°C",
      qnt_decimals: "2",
      offset: "0.5",
      factor: "1.2",
    });
  });
});

describe("AlertTypeForm", () => {
  it("preenche e envia o formulário", async () => {
    const onSubmit = jest.fn();

    render(<AlertTypeForm onSubmit={onSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Tipo de Parâmetro/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Tipo de Parâmetro/i), { target: { value: "1" } });

    await waitFor(() => {
      expect(screen.getByLabelText(/Estações/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Estações/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Alerta Teste" } });
    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText(/Sinal Matemático/i), { target: { value: ">" } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: "R" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        parameter_id: 1,
        station_id: 1,
        name: "Alerta Teste",
        value: 30,
        math_signal: ">",
        status: "R",
      });
    });
  });
});
