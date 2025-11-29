"use client";

import { Category, deleteCategory } from "@/lib/actions/finance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { CreateCategoryDialog } from "@/components/finance/create-category-dialog";
import { toast } from "sonner";
import { useState } from "react";

interface CategorySettingsProps {
  categories: Category[];
}

export function CategorySettings({ categories }: CategorySettingsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;
    setIsLoading(id);
    try {
      await deleteCategory(id);
      toast.success("Kategori dihapus");
    } catch (error) {
      toast.error("Gagal menghapus kategori");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen Kategori</CardTitle>
          <CardDescription>
            Atur kategori pemasukan dan pengeluaran Anda.
          </CardDescription>
        </div>
        <CreateCategoryDialog trigger={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        } />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada kategori.</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(category.id)}
                  disabled={isLoading === category.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
