import { PencilSquare, Trash } from "@medusajs/icons";
import { Source } from "./page";
import { useNavigate } from "react-router-dom";
import { useDeleteSourceAction } from "../../../hooks/use-delete-source-action";
import { ActionMenu } from "../../../components/common/action-menu";

type SourceRowActionsProps = {
  source: Source;
};

export const SourceRowActions = ({ source }: SourceRowActionsProps) => {
  const navigate = useNavigate();

  const handleDelete = useDeleteSourceAction(source.id, source.name);

  const handleEdit = async () => {
    navigate("/sources/edit", { state: source });
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
