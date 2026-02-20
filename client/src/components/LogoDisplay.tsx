import { useState, useEffect } from 'react';

export default function LogoDisplay() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Carregar logo do localStorage
    const savedLogo = localStorage.getItem('logoUrl');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }

    // Escutar evento de atualização de logo
    const handleLogoUpdate = () => {
      const updatedLogo = localStorage.getItem('logoUrl');
      if (updatedLogo) {
        setLogoUrl(updatedLogo);
      }
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
  }, []);

  if (!logoUrl) {
    // Logo padrão (emoji smiley)
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
