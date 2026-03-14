import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
// import { categories } from '@/lib/products';
import type { Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import LogoDisplay from '@/components/LogoDisplay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ShoppingCart, Instagram } from 'lucide-react';
import ColorBadges from '@/components/ColorBadges';
import { useCart } from '@/contexts/CartContext';
import CartPanel from '@/components/CartPanel';

// Componente para exibir imagem do banner
function BannerImageDisplay() {
  // Query para carregar banner do banco
  const { data: bannerUrl } = trpc.upload.getBannerUrl.useQuery();

  if (bannerUrl) {
    return (
      <img
        src={bannerUrl}
        alt="Banner personalizado"
        className="max-w-full max-h-full object-contain"
      />
    );
  }

  return (
    <p className="text-white/40 text-center text-sm">Nenhuma imagem configurada</p>
  );
}



export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Usar ID em vez de nome
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Buscar produtos do banco de dados via tRPC
  const { data: products = [], isLoading } = trpc.products.list.useQuery();

  // Carregar categorias visíveis da API
  const { data: dbCategories = [] } = trpc.categories.list.useQuery();

  // Filtrar produtos baseado no selectedCategoryId
  const filteredProducts =
    selectedCategoryId === null
      ? products // "Todos" - mostrar todos os produtos
      : products.filter((p) => {
          // Filtrar por categoryId se disponível
          if (p.categoryId !== null && p.categoryId !== undefined) {
            return Number(p.categoryId) === Number(selectedCategoryId);
          }
          // Fallback para compatibilidade com produtos antigos (sem categoryId)
          return false;
        });

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
        <div className="container py-3 flex items-center justify-between gap-6">
          {/* Logo - Lado Esquerdo */}
          <div className="flex-shrink-0">
            <LogoDisplay />
          </div>
          
          {/* Botões e Informações - Lado Direito */}
          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            {/* Botão Instagram */}
            <a
              href="https://www.instagram.com/cnv_personalizados/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:border-accent hover:text-accent transition-colors text-sm text-foreground"
              title="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
              <span>Instagram</span>
            </a>
            
            {/* Botão WhatsApp */}
            <a
              href="https://wa.me/5566996066814"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:border-accent hover:text-accent transition-colors text-sm text-foreground"
              title="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.227l-.356.214-3.71-.973.992 3.63-.235.374a9.861 9.861 0 001.516 5.394c.732 1.092 1.771 2.041 2.926 2.712 1.154.671 2.478 1.025 3.826 1.025 2.04 0 3.972-.78 5.423-2.008 1.45-1.228 2.26-2.896 2.26-4.648 0-1.227-.237-2.44-.682-3.572-.445-1.132-1.119-2.112-1.973-2.878a9.87 9.87 0 00-3.051-1.852m0 0C12 2 6.477 2 6.477 2s-5.523 0-5.523 5.477c0 5.477 5.523 5.523 5.523 5.523s5.523.046 5.523-5.477C11.977 2 12 2 12 2z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            
            {/* Telefone */}
            <div className="hidden md:flex flex-col items-end">
              <a
                href="https://wa.me/5566996066814"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                (66) 9-9606-6814
              </a>
              <span className="text-xs text-muted-foreground">Sinop-MT</span>
            </div>
            
            {/* Botão Carrinho */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/10 transition-colors ml-2"
              title="Carrinho de compras"
            >
              <ShoppingCart className="w-5 h-5 text-accent" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="text-sm font-medium text-foreground hidden sm:inline">Carrinho</span>
            </button>
          </div>

          {/* Cart Panel */}
          {isCartOpen && <CartPanel onClose={() => setIsCartOpen(false)} />}
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
                onClick={() => setSelectedCategoryId(null)}
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

          {/* Right Decorative Element with Banner Image */}
          <div className="relative h-96 hidden md:block">
            <div className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-6" />
            <div className="absolute inset-4 bg-accent/10 rounded-2xl transform -rotate-3 flex items-center justify-center overflow-hidden">
              <BannerImageDisplay />
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
            value={selectedCategoryId === null ? 'all' : String(selectedCategoryId)}
            className="mb-12"
          >
            <TabsList className="bg-secondary/10 border border-border">
              <TabsTrigger 
                value="all" 
                onClick={() => setSelectedCategoryId(null)}
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                Todos
              </TabsTrigger>
              {dbCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={String(category.id)}
                  onClick={() => setSelectedCategoryId(Number(category.id))}
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  {category.name}
                  {category.productCount > 0 && (
                    <span className="ml-2 text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                      {category.productCount}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Products Grid */}
            <TabsContent value={selectedCategoryId === null ? 'all' : String(selectedCategoryId)} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => {
                  const productData = {
                    id: String(product.id),
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.imageUrl || '',
                    imageUrl: product.imageUrl || '',
                    description: product.description || '',
                    colors: product.colors || '',
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
