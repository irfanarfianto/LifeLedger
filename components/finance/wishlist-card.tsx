"use client";

import { useState } from "react";
import { Wishlist, Wallet, deleteWishlist } from "@/lib/actions/finance";
import { AddSavingsDialog } from "./add-savings-dialog";
import { EditWishlistDialog } from "./edit-wishlist-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import { Target, MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WishlistCardProps {
  item: Wishlist;
  wallets: Wallet[];
}

export function WishlistCard({ item, wallets }: WishlistCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const calculateDailySaving = (targetAmount: number, savedAmount: number, targetDate: string | null) => {
    if (!targetDate) return null;
    
    const remainingAmount = targetAmount - savedAmount;
    if (remainingAmount <= 0) return 0;

    const daysRemaining = differenceInDays(new Date(targetDate), new Date());
    if (daysRemaining <= 0) return remainingAmount; // Should save all today if overdue

    return Math.ceil(remainingAmount / daysRemaining);
  };

  const handleDelete = async () => {
    try {
      await deleteWishlist(item.id);
      toast.success("Item wishlist berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus item wishlist");
      console.error(error);
    }
  };

  const progress = Math.min(100, (item.saved_amount / item.target_amount) * 100);
  const dailySaving = calculateDailySaving(item.target_amount, item.saved_amount, item.target_date);
  const isCompleted = item.saved_amount >= item.target_amount;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium capitalize">
              {item.item_name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            Rp {item.target_amount.toLocaleString("id-ID")}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Terkumpul: Rp {item.saved_amount.toLocaleString("id-ID")}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {dailySaving !== null && dailySaving > 0 && !isCompleted && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                Nabung Rp {dailySaving.toLocaleString("id-ID")}/hari lagi!
              </p>
            )}
            {isCompleted && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                Target tercapai! 🎉
              </p>
            )}
            
            {!isCompleted && (
              <AddSavingsDialog
                wishlistId={item.id}
                wishlistName={item.item_name}
                currentSaved={item.saved_amount}
                targetAmount={item.target_amount}
                wallets={wallets}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <EditWishlistDialog 
        wishlist={item} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Item wishlist ini akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
