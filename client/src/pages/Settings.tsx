import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeroImageUpload from '@/components/HeroImageUpload';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

export default function Settings() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Verificar se é admin
  if (user?.role !== 'admin') {
    setLocation('/admin');
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold heading">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie as configurações do seu marketplace</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Imagem da Hero</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imagem da Hero Section</CardTitle>
              <CardDescription>
                Faça upload de uma imagem customizada para a seção hero do seu marketplace. 
                Se nenhuma imagem for definida, será exibido o design padrão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeroImageUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Configurações gerais do seu marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Nome da Empresa</label>
                  <p className="text-muted-foreground">C.N.V. Personalizados</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Localização</label>
                  <p className="text-muted-foreground">Sinop-MT</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">WhatsApp</label>
                  <p className="text-muted-foreground">(66) 9-9606-6814</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
