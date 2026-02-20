import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import ColorBadges from "./ColorBadges";
import { Loader2, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductsTableProps {
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export default function ProductsTable({ onEdit, onDelete, refreshTrigger }: ProductsTableProps) {
  const { data: products, isLoading, refetch } = trpc.products.all.useQuery();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId !== null) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
      setTimeout(() => refetch(), 500);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  // Calcular paginação
  const paginationData = useMemo(() => {
    if (!products) return { paginatedProducts: [], totalPages: 0, totalItems: 0 };
    
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return { paginatedProducts, totalPages, totalItems };
  }, [products, currentPage, itemsPerPage]);

  const { paginatedProducts, totalPages, totalItems } = paginationData;

  // Reset para página 1 quando mudar itens por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Validar página atual
  const validCurrentPage = Math.min(currentPage, totalPages || 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-accent" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Controles de paginação - Topo */}
        <div className="flex items-center justify-between bg-secondary/5 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Exibindo <span className="font-semibold text-foreground">{paginatedProducts.length}</span> de <span className="font-semibold text-foreground">{totalItems}</span> produtos
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1 border border-border rounded text-sm bg-background"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/5">
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Cores</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-secondary/5">
                    <TableCell>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl.split('|')[0]}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-secondary rounded flex items-center justify-center text-xs text-muted-foreground">
                          Sem imagem
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? "text-red-500 font-semibold" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ColorBadges colorString={product.colors} />
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Controles de paginação - Rodapé */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-secondary/5 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Página <span className="font-semibold text-foreground">{validCurrentPage}</span> de <span className="font-semibold text-foreground">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Botão Anterior */}
              <Button
                onClick={() => setCurrentPage(Math.max(1, validCurrentPage - 1))}
                disabled={validCurrentPage === 1}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {/* Números de página */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Mostrar apenas páginas próximas
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= validCurrentPage - 1 && page <= validCurrentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={page === validCurrentPage ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    (page === validCurrentPage - 2 && validCurrentPage > 3) ||
                    (page === validCurrentPage + 2 && validCurrentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={page} className="px-2 py-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Botão Próxima */}
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, validCurrentPage + 1))}
                disabled={validCurrentPage === totalPages}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
