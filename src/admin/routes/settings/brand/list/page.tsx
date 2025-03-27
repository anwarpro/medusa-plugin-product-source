import {
  createDataTableColumnHelper,
  useDataTable,
  DataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { sdk } from "../../../../utils/sdk";
import { BrandRowActions } from "./brand-row-actions";
import { useNavigate } from "react-router-dom";

export interface Brand {
  [x: string]: any;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const BrandList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch(`/admin/brand`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    queryKey: ["brand"],
    refetchOnMount: "always",
  });

  const brandData = useMemo(() => {
    return ((data as any)?.brands as any[]) || [];
  }, [(data as any)?.brands]);

  const columnHelper = createDataTableColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      enableSorting: true,
    }),
    columnHelper.accessor("created_at", {
      header: "Created",
      enableSorting: true,
      cell({ row }) {
        const createdAt = new Date(
          (row?.original as any)?.created_at
        ).toDateString();
        return createdAt;
      },
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated",
      enableSorting: true,
      cell({ row }) {
        const updatedAt = new Date(
          (row?.original as any)?.updated_at
        ).toDateString();
        return updatedAt;
      },
    }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <BrandRowActions
            brand={row.original as unknown as any}
            // setBrands={setBrands}
          />
        );
      },
    }),
  ];

  const table = useDataTable({
    columns: columns as unknown as any,
    data: brandData,
    rowCount: brandData.length,
    isLoading,
    pagination: {
      onPaginationChange: () => {},
      state: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
    onRowClick: (event, row) => {
      navigate(`/settings/brand/detail`, {
        state: row.original,
      });
    },
  });

  return (
    <DataTable instance={table}>
      <DataTable.Table
        emptyState={{
          empty: {
            heading: "No Products",
            description: "There are no products to display.",
          },
        }}
      />
    </DataTable>
  );
};

export default BrandList;
