import { toast } from "@medusajs/ui";

const editBrand = async (brandId: string, brandData: any) => {
  try {
    const response = await fetch(`/admin/brand/${brandId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brandData),
    });
    const res = response;
    return res;
  } catch (error) {
    throw error;
  }
};

export const useEditBrandAction = async (
  id: string,
  brandData: any
): Promise<void> => {
  try {
    await editBrand(id, brandData);
    toast.success("Brand edited successfully");
  } catch (error) {
    throw error;
  }
};
