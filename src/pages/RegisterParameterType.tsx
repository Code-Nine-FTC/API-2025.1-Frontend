import { ParameterTypeForm } from "@components/ParameterTypeForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";

const CadastrarTipoParametro = () => {
  const handleCreate = async (form: any) => {
    try {
      await links.createParameterType({
        name: form.name,
        measure_unit: form.measure_unit,
        qnt_decimals: parseInt(form.qnt_decimals),
        offset: form.offset ? parseFloat(form.offset) : undefined,
        factor: form.factor ? parseFloat(form.factor) : undefined
      });
      alert("Tipo de parâmetro cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao cadastrar tipo de parâmetro:", err);
      alert("Erro ao cadastrar tipo de parâmetro");
    }
  };

  return (
    <LoggedLayout>
      <ParameterTypeForm 
        onSubmit={handleCreate} 
        title="Cadastrar Tipo de Parâmetro" 
        submitLabel="Cadastrar" 
      />
    </LoggedLayout>
  );
};

export default CadastrarTipoParametro;