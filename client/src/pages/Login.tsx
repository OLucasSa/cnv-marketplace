import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Redirect to OAuth login
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground via-secondary to-foreground flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-lg mb-4 shadow-lg">
            <span className="text-accent-foreground font-bold text-2xl">C</span>
          </div>
          <h1 className="text-3xl font-bold heading text-white mb-2">C.N.V.</h1>
          <p className="text-accent font-semibold tracking-wide">Personalizados</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold heading text-foreground">Bem-vindo</h2>
            <p className="text-muted-foreground mt-2">Acesse seu painel administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Username Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email ou Usuário
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoFocus
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Lembrar de mim
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Acesso restrito a colaboradores autorizados</p>
            <a href="/" className="text-accent hover:text-accent/80 transition-colors font-semibold">
              Voltar ao marketplace
            </a>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-xs text-white/60">
          <p>🔒 Sua conexão é segura e criptografada</p>
        </div>
      </div>
    </div>
  );
}
