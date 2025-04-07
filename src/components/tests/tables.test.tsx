import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataTable from "../DataTable";
import StationTable from "../StationsTable";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../services/api", () => ({
  links: {
    listStations: jest.fn().mockResolvedValue({
      success: true,
      data: {
        data: [
          {
            id: 1,
            name_station: "Estação Alpha",
            uid: "UID123",
            address: ["Rua A", "Bairro B"],
            latitude: -23.5,
            longitude: -46.6,
            create_date: "2024-01-01",
          },
        ],
      },
    }),
  },
}));

beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => "fake-token");
});

describe("DataTable", () => {
  const mockData = [
    {
      id: 1,
      name: "Alerta A",
      status: "G",
      create_date: "2024-04-07T00:00:00Z",
    },
  ];

  const mockColumns = [
    { key: "name" as const, label: "Nome" },
    { key: "status" as const, label: "Status" },
    { key: "create_date" as const, label: "Data" },
  ];

  it("renderiza dados e paginação", () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    expect(screen.getByText("Alerta A")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("altera número de linhas por página", () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    const select = screen.getByLabelText("Rows per page:");
    fireEvent.change(select, { target: { value: "5" } });
    expect(select).toHaveValue("5");
  });
});

describe("StationTable", () => {
  it("renderiza filtros e dados da estação", async () => {
    render(
      <MemoryRouter>
        <StationTable />
      </MemoryRouter>
    );

    expect(screen.getByText(/Buscar por nome/i)).toBeInTheDocument();
    expect(screen.getByText(/UID da estação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ativo/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Estação Alpha")).toBeInTheDocument();
      expect(screen.getByText("UID123")).toBeInTheDocument();
    });
  });

  it("renderiza botão de cadastrar se logado", () => {
    render(
      <MemoryRouter>
        <StationTable />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cadastrar/i)).toBeInTheDocument();
  });
});
