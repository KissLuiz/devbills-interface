import { useEffect } from "react";
import { useNavigate } from "react-router";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { signWithGoogle, authState } = useAuth();

  const handleLogin = async () => {
    try {
      await signWithGoogle();
    } catch (err) {
      console.error("Erro ao fazer login com o Google", err);
    }
  };

  useEffect(() => {
    if (authState.user && !authState.loading) {
      navigate("/dashboard");
    }
  }, [authState.user, authState.loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <header>
          <h1 className="text-gray-900 text-center text-3xl font-extrabold">
            DevBills
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gerencie suas finanças de forma simples e eficiente.
          </p>
        </header>

        <main className="mt-8 bg-white px-4 py-8 shadow-md rounded-lg sm:px-10 space-y-6">
          <section className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Faça login para continuar
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Acesse sua conta para começar a gerenciar suas finanças.
            </p>
          </section>

          <GoogleLoginButton onClick={handleLogin} isLoading={false} />

          {authState.error && (
            <div className="bg-red-50 text-center text-red-700 mt-4">
              <p>{authState.error} Erro no sistema!</p>
            </div>
          )}

          <footer className="mt-6">
            <p className="mt-1 text-sm text-gray-600">
              Ao fazer login, você concorda com nossos{" "}
              <span className="text-primary-600 cursor-pointer">Termos de Serviço</span> e{" "}
              <span className="text-primary-600 cursor-pointer">Política de Privacidade</span>.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Login;
