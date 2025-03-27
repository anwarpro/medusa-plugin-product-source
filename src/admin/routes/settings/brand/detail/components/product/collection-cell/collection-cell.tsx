import { HttpTypes } from "@medusajs/types";
import { PlaceholderCell } from "../../../../../../../components/common/placeholder-cell";

type CollectionCellProps = {
  collection?: HttpTypes.AdminCollection | null;
};

export const CollectionCell = ({ collection }: CollectionCellProps) => {
  if (!collection) {
    return <PlaceholderCell />;
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{collection.title}</span>
    </div>
  );
};

export const CollectionHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span>Collection</span>
    </div>
  );
};
