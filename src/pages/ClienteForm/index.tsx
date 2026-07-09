import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Save, Plus, Trash2 } from "lucide-react";
import { clienteService } from "../../services/clienteService";
import { maskCPF, maskCEP, maskPhone, unmask } from "../../utils/masks";
import { PageHeader } from "../../components/layout/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { appConfig } from "../../config/env";

const clienteSchema = z.object({
  nome: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(100, "Máximo de 100 caracteres")
    .regex(/^[a-zA-Z0-9À-ÿ\s]+$/, "Apenas letras, números e espaços"),
  cpf: z.string().min(14, "CPF incompleto"),
  endereco: z.object({
    cep: z.string().min(9, "CEP incompleto"),
    logradouro: z.string().min(1, "Logradouro obrigatório"),
    bairro: z.string().min(1, "Bairro obrigatório"),
    cidade: z.string().min(1, "Cidade obrigatória"),
    uf: z.string().length(2, "UF deve ter 2 letras"),
    complemento: z.string().optional(),
  }),
  emailsForm: z
    .array(z.object({ email: z.string().email("E-mail inválido") }))
    .min(1, "Ao menos um e-mail é obrigatório"),
  telefones: z
    .array(
      z.object({
        numero: z.string().min(14, "Número incompleto"),
        tipo: z.enum(["RESIDENCIAL", "COMERCIAL", "CELULAR"]),
      }),
    )
    .min(1, "Ao menos um telefone é obrigatório"),
});

type ClienteFormInputs = z.infer<typeof clienteSchema>;

export default function ClienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const manualAddressEditRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormInputs>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      emailsForm: [{ email: "" }],
      telefones: [{ numero: "", tipo: "CELULAR" }],
      endereco: {
        uf: "",
        cidade: "",
        bairro: "",
        logradouro: "",
        complemento: "",
      },
    },
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: "emailsForm" });
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "telefones" });

  useEffect(() => {
    if (isEditMode && id) {
      const carregarCliente = async () => {
        try {
          const cliente = await clienteService.findById(id);
          reset({
            nome: cliente.nome,
            cpf: cliente.cpf,
            endereco: cliente.endereco,
            telefones: cliente.telefones,
            emailsForm: cliente.emails.map((email) => ({ email: email ?? "" })),
          });
        } catch {
          alert("Erro ao carregar os dados do cliente.");
          navigate("/dashboard");
        }
      };
      carregarCliente();
    }
  }, [id, isEditMode, reset, navigate]);

  const buscarCep = async (cepBuscado: string) => {
    const cepLimpo = unmask(cepBuscado);
    if (cepLimpo.length !== 8) return;

    try {
      const response = await axios.get(
        `${appConfig.viaCepBaseUrl}/${cepLimpo}/json/`,
      );
      if (!response.data.erro && !manualAddressEditRef.current) {
        setValue("endereco.logradouro", response.data.logradouro, {
          shouldValidate: true,
        });
        setValue("endereco.bairro", response.data.bairro, {
          shouldValidate: true,
        });
        setValue("endereco.cidade", response.data.localidade, {
          shouldValidate: true,
        });
        setValue("endereco.uf", response.data.uf, { shouldValidate: true });
      }
    } catch {}
  };

  const handleCepChange = (value: string) => {
    const cepMask = maskCEP(value);
    setValue("endereco.cep", cepMask, { shouldValidate: true });
    manualAddressEditRef.current = false;
  };

  const marcarEnderecoEditado = () => {
    manualAddressEditRef.current = true;
  };

  const onSubmit = async (data: ClienteFormInputs) => {
    const payload = {
      nome: data.nome.trim(),
      cpf: unmask(data.cpf),
      endereco: {
        cep: unmask(data.endereco.cep),
        logradouro: data.endereco.logradouro.trim(),
        bairro: data.endereco.bairro.trim(),
        cidade: data.endereco.cidade.trim(),
        uf: data.endereco.uf.trim().toUpperCase(),
        ...(data.endereco.complemento?.trim()
          ? { complemento: data.endereco.complemento.trim() }
          : {}),
      },
      emails: data.emailsForm
        .map((e) => e.email.trim())
        .filter(Boolean)
        .map((email) => ({ email })),
      telefones: data.telefones.map((t) => ({
        numero: unmask(t.numero),
        tipo: t.tipo,
      })),
    };

    try {
      if (isEditMode) {
        await clienteService.update(id!, payload as any);
      } else {
        await clienteService.save(payload as any);
      }
      navigate("/dashboard");
    } catch (error: any) {
      const detail = error?.response?.data?.message || error?.message;
      alert(
        detail
          ? `Erro ao salvar os dados: ${detail}`
          : "Erro ao salvar os dados. Verifique o console.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title={isEditMode ? "Editar Cliente" : "Novo Cliente"}
          subtitle="Preencha os dados abaixo para manter o cadastro atualizado."
          onBack={() => navigate("/dashboard")}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionCard title="Dados Pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nome Completo *"
                type="text"
                name="nome"
                register={(name) => register(name)}
                error={errors.nome?.message}
              />
              <InputField
                label="CPF *"
                type="text"
                name="cpf"
                register={(name) => register(name)}
                error={errors.cpf?.message}
                onChange={(e) => {
                  e.target.value = maskCPF(e.target.value);
                  setValue("cpf", e.target.value, { shouldValidate: true });
                }}
                maxLength={14}
              />
            </div>
          </SectionCard>

          <SectionCard title="Endereço">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="CEP *"
                type="text"
                name="endereco.cep"
                register={(name) => register(name)}
                error={errors.endereco?.cep?.message}
                onChange={(e) => {
                  handleCepChange(e.target.value);
                }}
                onBlur={(e) => buscarCep(e.target.value)}
                maxLength={9}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Logradouro *"
                  type="text"
                  name="endereco.logradouro"
                  register={(name) => register(name)}
                  onChange={marcarEnderecoEditado}
                />
              </div>
              <InputField
                label="Bairro *"
                type="text"
                name="endereco.bairro"
                register={(name) => register(name)}
                onChange={marcarEnderecoEditado}
              />
              <InputField
                label="Cidade *"
                type="text"
                name="endereco.cidade"
                register={(name) => register(name)}
                onChange={marcarEnderecoEditado}
              />
              <InputField
                label="UF *"
                type="text"
                name="endereco.uf"
                register={(name) => register(name)}
                onChange={marcarEnderecoEditado}
              />
              <div className="md:col-span-3">
                <InputField
                  label="Complemento (Opcional)"
                  type="text"
                  name="endereco.complemento"
                  register={(name) => register(name)}
                  onChange={marcarEnderecoEditado}
                />
              </div>
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard
              title="Telefones"
              subtitle="Adicione um ou mais números de contato."
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => appendPhone({ numero: "", tipo: "CELULAR" })}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </button>
              </div>
              <div className="space-y-4">
                {phoneFields.map((field, index) => {
                  const tipoAtual = watch(`telefones.${index}.tipo`);
                  return (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-3">
                        <SelectField
                          label="Tipo"
                          name={`telefones.${index}.tipo`}
                          register={(name) => register(name)}
                          options={[
                            { value: "CELULAR", label: "Celular" },
                            { value: "RESIDENCIAL", label: "Residencial" },
                            { value: "COMERCIAL", label: "Comercial" },
                          ]}
                        />
                        <InputField
                          label="Número"
                          type="text"
                          name={`telefones.${index}.numero`}
                          register={(name) => register(name)}
                          error={errors.telefones?.[index]?.numero?.message}
                          onChange={(e) => {
                            e.target.value = maskPhone(
                              e.target.value,
                              tipoAtual === "CELULAR",
                            );
                            setValue(
                              `telefones.${index}.numero`,
                              e.target.value,
                              { shouldValidate: true },
                            );
                          }}
                          maxLength={tipoAtual === "CELULAR" ? 15 : 14}
                          placeholder="Número"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removePhone(index)}
                          className="mt-11 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="E-mails"
              subtitle="Inclua pelo menos um endereço válido."
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => appendEmail({ email: "" })}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </button>
              </div>
              <div className="space-y-4">
                {emailFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        E-mail
                      </label>
                      <input
                        type="email"
                        {...register(`emailsForm.${index}.email`)}
                        defaultValue={field.email ?? ""}
                        placeholder="exemplo@email.com"
                        className={`mt-1 block w-full rounded-md border p-2 shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                          errors.emailsForm?.[index]?.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.emailsForm?.[index]?.email && (
                        <span className="text-xs text-red-500">
                          {errors.emailsForm[index]?.email?.message}
                        </span>
                      )}
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "A salvar..." : "Salvar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
