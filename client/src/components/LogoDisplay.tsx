import { trpc } from '@/lib/trpc';

export default function LogoDisplay() {
  // Query para carregar logo do banco
  const { data: logoUrl } = trpc.upload.getLogoUrl.useQuery();

  if (!logoUrl) {
    // Logo padrão (letra C)
    return (
      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
        <span className="text-accent-foreground font-bold text-lg">C</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Logo"
      className="w-10 h-10 object-contain"
    />
  );
}
