import { trpc } from '@/lib/trpc';

export default function LogoDisplay() {
  // Query para carregar logo do banco
  const { data: logoUrl } = trpc.upload.getLogoUrl.useQuery();
  
  // Expandir logo horizontalmente com espaço maior
  const logoContainerClass = "flex-1 max-w-xs";

  if (!logoUrl) {
    // Logo padrão (letra C)
    return (
      <div className={`${logoContainerClass} h-12 bg-accent rounded-lg flex items-center justify-center px-4`}>
        <span className="text-accent-foreground font-bold text-xl">C</span>
      </div>
    );
  }

  return (
    <div className={logoContainerClass}>
      <img
        src={logoUrl}
        alt="Logo"
        className="h-12 object-contain"
        style={{ maxWidth: '200px' }}
      />
    </div>
  );
}
