import { toast } from "@medusajs/ui";

const editSource = async (sourceId: string, sourceData: any) => {
  try {
    const response = await fetch(`/admin/source/${sourceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sourceData),
    });
    const res = response;
    return res;
  } catch (error) {
    throw error;
  }
};

export const useEditSourceAction = async (
  id: string,
  sourceData: any
): Promise<void> => {
  try {
    await editSource(id, sourceData);
    toast.success("Source edited successfully");
  } catch (error) {
    throw error;
  }
};
