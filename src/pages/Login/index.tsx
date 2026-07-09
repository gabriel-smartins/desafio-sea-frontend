import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../services/authService";
import { InputField } from "../../components/ui/InputField";
import { storageKeys } from "../../config/env";

const loginSchema = z.object({
  username: z.string().min(1, "O campo usuário é obrigatório"),
  password: z.string().min(1, "O campo senha é obrigatório"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setErrorMessage(null);

      const response = await authService.login(data);

      localStorage.setItem(storageKeys.token, response.token);
      localStorage.setItem(storageKeys.role, response.role);

      navigate("/dashboard", { replace: true });
    } catch {
      setErrorMessage("Credenciais inválidas. Verifique o usuário e a senha.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Acesso Restrito
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Insira suas credenciais para gerenciar os clientes
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Usuário"
            type="text"
            name="username"
            placeholder="admin ou user"
            register={(name) => register(name)}
            error={errors.username?.message}
          />

          <InputField
            label="Senha"
            type="password"
            name="password"
            placeholder="Sua senha de acesso"
            register={(name) => register(name)}
            error={errors.password?.message}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Autenticando..." : "Entrar no sistema"}
          </button>
        </form>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium">Usuários disponíveis:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <span className="font-semibold">admin</span> / 123qwe!@#
            </li>
            <li>
              <span className="font-semibold">user</span> / 123qwe123
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
