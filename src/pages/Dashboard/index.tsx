import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clienteService } from "../../services/clienteService";
import { authService } from "../../services/authService";
import type { Cliente } from "../../types";
import { Plus, User } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/layout/PageHeader";
import { storageKeys } from "../../config/env";

export default function Dashboard() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const userRole = localStorage.getItem(storageKeys.role);
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    async function carregarClientes() {
      try {
        setLoading(true);
        const dados = await clienteService.findAll();
        setClientes(dados);
      } catch {
        setErro("Não foi possível carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    }

    carregarClientes();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppLayout role={userRole} onLogout={handleLogout}>
      <PageHeader
        title="Clientes Cadastrados"
        subtitle="Visualização e gestão dos registros do sistema."
        action={
          isAdmin ? (
            <button
              onClick={() => navigate("/clientes/novo")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Novo Cliente
            </button>
          ) : (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-xs">
              A sua conta atual possui permissão apenas de{" "}
              <strong>visualização</strong>.
            </div>
          )
        }
      />

      {loading && (
        <div className="text-center py-12 text-gray-500 font-medium">
          Carregando clientes...
        </div>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 mb-6">
          {erro}
        </div>
      )}

      {!loading && !erro && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Nome
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    CPF
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Localidade
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contato Principal
                  </th>
                  {isAdmin && <th className="relative px-6 py-3.5"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {!clientes || clientes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      Nenhum cliente cadastrado até ao momento.
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {cliente.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {cliente.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {cliente.endereco.cidade} / {cliente.endereco.uf} (
                        {cliente.endereco.cep})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {cliente.telefones?.[0]
                          ? `${cliente.telefones[0].numero} (${cliente.telefones[0].tipo})`
                          : cliente.emails?.[0] || "N/A"}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/clientes/editar/${cliente.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 font-semibold"
                          >
                            Editar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
