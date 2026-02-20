import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImageUploadProps {
  onImageUpload: (url: string, key: string) => void;
  currentImageUrl?: string;
}

export default function ImageUpload({ onImageUpload, currentImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = trpc.upload.image.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione uma imagem");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        try {
          const result = await uploadMutation.mutateAsync({
            base64,
            fileName: file.name,
          });
          onImageUpload(result.url, result.key);
          toast.success("Imagem carregada com sucesso!");
          setFile(null);
        } catch (error) {
          toast.error("Erro ao fazer upload da imagem");
          console.error(error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao processar imagem");
      console.error(error);
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
  };

  const handleSelectClick = () => {
    const input = document.getElementById("image-input") as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-4">
      <Label>Imagem do Produto</Label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Clique ou arraste uma imagem aqui
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="image-input"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectClick}
          >
            Selecionar Imagem
          </Button>
        </div>
      )}

      {file && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Enviando..." : "Fazer Upload"}
        </Button>
      )}
    </div>
  );
}
