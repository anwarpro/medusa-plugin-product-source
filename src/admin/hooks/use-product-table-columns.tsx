import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

import { HttpTypes } from "@medusajs/types";
import {
  ProductCell,
  ProductHeader,
} from "../routes/brands/detail/components/product/product-cell";
import {
  CollectionCell,
  CollectionHeader,
} from "../routes/brands/detail/components/product/collection-cell";
import {
  SalesChannelHeader,
  SalesChannelsCell,
} from "../routes/brands/detail/components/product/sales-channels-cell";
import {
  VariantCell,
  VariantHeader,
} from "../routes/brands/detail/components/product/variant-cell";
import {
  ProductStatusCell,
  ProductStatusHeader,
} from "../routes/brands/detail/components/product/product-status-cell";

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>();

export const useProductTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => <ProductCell product={row.original} />,
      }),
      columnHelper.accessor("collection", {
        header: () => <CollectionHeader />,
        cell: ({ row }) => (
          <CollectionCell collection={row.original.collection} />
        ),
      }),
      columnHelper.accessor("sales_channels", {
        header: () => <SalesChannelHeader />,
        cell: ({ row }) => (
          <SalesChannelsCell salesChannels={row.original.sales_channels} />
        ),
      }),
      columnHelper.accessor("variants", {
        header: () => <VariantHeader />,
        cell: ({ row }) => <VariantCell variants={row.original.variants} />,
      }),
      columnHelper.accessor("status", {
        header: () => <ProductStatusHeader />,
        cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      }),
    ],
    []
  );
};
