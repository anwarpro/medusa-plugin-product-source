import { PencilSquare, Trash } from "@medusajs/icons";
import { Brand } from "./page";
import { useNavigate } from "react-router-dom";
import { useDeleteBrandAction } from "../../../hooks/use-delete-brand-action";
import { ActionMenu } from "../../../components/common/action-menu";

type BrandRowActionsProps = {
  brand: Brand;
};

export const BrandRowActions = ({ brand }: BrandRowActionsProps) => {
  const navigate = useNavigate();

  const handleDelete = useDeleteBrandAction(brand.id, brand.name);

  const handleEdit = async () => {
    navigate("/brands/edit", { state: brand });
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: "Edit",
              icon: <PencilSquare />,
              onClick: handleEdit,
            },
          ],
        },
        {
          actions: [
            {
              label: "Delete",
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  );
};
