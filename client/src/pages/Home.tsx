import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { categories } from '@/lib/products';
import type { Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import ColorBadges from '@/components/ColorBadges';



export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Buscar produtos do banco de dados via tRPC
  const { data: products = [], isLoading } = trpc.products.list.useQuery();

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/cnv-logo.png" alt="C.N.V. Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold heading text-foreground">C.N.V.</h1>
              <p className="text-xs text-muted-foreground">Personalizados</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5566996066814"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              (66) 9-9606-6814
            </a>
            <span className="text-xs text-muted-foreground">Sinop-MT</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground via-secondary to-foreground py-20 md:py-32">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 z-10">
            <div>
              <p className="text-accent uppercase tracking-widest text-sm font-bold mb-4">
                Bem-vindo ao Studio
              </p>
              <h2 className="display text-white mb-4">
                Personalize Sua Arte
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Transformamos seus produtos em obras-primas únicas através de gravação a laser de alta precisão. Canecas, garrafas, facas e muito mais.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setSelectedCategory('all')}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Explorar Catálogo
              </Button>
              <a
                href="https://wa.me/5566996066814"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Solicitar Orçamento
                </Button>
              </a>
            </div>
          </div>

          {/* Right Decorative Element */}
          <div className="relative h-96 hidden md:block">
            <div className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-6" />
            <div className="absolute inset-4 bg-accent/10 rounded-2xl transform -rotate-3 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-white/20 heading">C.N.V</p>
                <p className="text-white/30 mt-4 text-lg">Gravação a Laser Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-white"
          style={{
            clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12">
            <p className="text-accent uppercase tracking-widest text-sm font-bold mb-2">
              Nossos Produtos
            </p>
            <h2 className="text-4xl font-bold heading text-foreground mb-4">
              Catálogo Completo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore nossa coleção de produtos personalizáveis. Cada item pode ser customizado com sua arte, logo ou mensagem especial.
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="mb-12"
          >
            <TabsList className="bg-secondary/10 border border-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Todos
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Products Grid */}
            <TabsContent value={selectedCategory} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => {
                  const productData = {
                    id: String(product.id),
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.imageUrl || '',
                    description: product.description || '',
                    colors: [],
                    sizes: [],
                    specifications: {
                      material: 'Personalizado',
                      features: product.features ? product.features.split(',') : [],
                    },
                    line: 'premium' as const,
                  };
                  return (
                    <div
                      key={product.id}
                      className="animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <ProductCard
                        product={productData}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  );
                })}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Nenhum produto encontrado nesta categoria.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container">
          <div className="mb-12">
            <p className="text-accent uppercase tracking-widest text-sm font-bold mb-2">
              Como Funciona
            </p>
            <h2 className="text-4xl font-bold heading text-foreground">
              Seu Processo de Personalização
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Escolha o Produto',
                description: 'Selecione o item que deseja personalizar de nosso catálogo.',
              },
              {
                step: '02',
                title: 'Personalize',
                description: 'Envie sua arte, logo ou mensagem. Sem limite de cores ou designs.',
              },
              {
                step: '03',
                title: 'Aprovação',
                description: 'Revise o design até 3 vezes antes de finalizarmos a gravação.',
              },
              {
                step: '04',
                title: 'Entrega',
                description: 'Receba seu produto personalizado pronto para presentear ou usar.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white border-2 border-border rounded-lg p-6 hover:border-accent transition-colors">
                  <div className="text-4xl font-bold heading text-accent/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold heading text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-accent/20 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold heading mb-4">
            Pronto para Personalizar?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco via WhatsApp para discutir seu projeto. Personalização mínima de 01 unidade, sem custo adicional de arte.
          </p>
          <a
            href="https://wa.me/5566996066814"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 px-8">
              Enviar Mensagem no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold heading mb-4">C.N.V. Personalizados</h3>
              <p className="text-white/70">
                Gravação a laser de alta precisão para seus produtos especiais.
              </p>
            </div>
            <div>
              <h4 className="font-bold heading mb-4">Contato</h4>
              <p className="text-white/70 mb-2">
                <a
                  href="https://wa.me/5566996066814"
                  className="hover:text-accent transition-colors"
                >
                  (66) 9-9606-6814
                </a>
              </p>
              <p className="text-white/70">Sinop-MT</p>
            </div>
            <div>
              <h4 className="font-bold heading mb-4">Políticas</h4>
              <ul className="space-y-2 text-white/70">
                <li>Personalização mínima: 01 unidade</li>
                <li>Até 3 alterações de arte</li>
                <li>Valores sob consulta</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>&copy; 2026 C.N.V. Personalizados. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
