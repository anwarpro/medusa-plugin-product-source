import { toast, usePrompt } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";

const deleteSource = async (sourceId: string) => {
  try {
    const response = await fetch(`/admin/source/${sourceId}`, {
      method: "DELETE",
    });
    const res = response;
    return res;
  } catch (error) {
    throw error;
  }
};

const handleDeleteSource = async (sourceId: string): Promise<void> => {
  try {
    await deleteSource(sourceId);
    toast.success("Source deleted successfully");
  } catch (error: any) {
    toast.error(error?.message || "Failed to delete source. Please try again.");
  }
};

export const useDeleteSourceAction = (id: string, name: string) => {
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
    await handleDeleteSource(id);
    navigate(0);
  };

  return handleDelete;
};
