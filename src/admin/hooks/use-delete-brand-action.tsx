import { toast, usePrompt } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";

const deleteBrand = async (brandId: string) => {
  try {
    const response = await fetch(`/admin/brand/${brandId}`, {
      method: "DELETE",
    });
    const res = response;
    return res;
  } catch (error) {
    throw error;
  }
};

const handleDeleteBrand = async (brandId: string): Promise<void> => {
  try {
    await deleteBrand(brandId);
    toast.success("Brand deleted successfully");
  } catch (error: any) {
    toast.error(error?.message || "Failed to delete brand. Please try again.");
  }
};

export const useDeleteBrandAction = (id: string, name: string) => {
  const prompt = usePrompt();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await prompt({
      title: "Are you sure?",
      description: `You are about to delete the product type ${name}. This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!result) {
      return;
    }
    await handleDeleteBrand(id);
    navigate(0);
  };

  return handleDelete;
};
