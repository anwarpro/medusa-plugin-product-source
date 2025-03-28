/* eslint-disable prettier/prettier */

import {
  Container,
  createDataTableColumnHelper,
  DataTable,
  Heading,
  useDataTable,
} from "@medusajs/ui";

import { Brand } from "../../../list/page";
import { sdk } from "../../../../../../utils/sdk";
import { useQuery } from "@tanstack/react-query";
import { HttpTypes } from "@medusajs/framework/types";
import { useProductTableColumns } from "../../../../../../hooks/use-product-table-columns";

type BrandProductSectionProps = {
  brand: Brand;
};

type ProductsData = {
  products: HttpTypes.AdminProduct[];
};

export const BrandProductSection = ({ brand }: BrandProductSectionProps) => {
  const {
    data: productsData,
    isError,
    error,
  } = useQuery<ProductsData>({
    queryFn: () =>
      sdk.client.fetch(`/admin/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        query: {
          id: brand.product_ids?.length ? brand.product_ids : [""],
        },
      }),
    queryKey: ["products"],
    refetchOnMount: "always",
  });

  const columns = useProductTableColumns();

  const table = useDataTable({
    columns,
    data: productsData?.products || [],
    getRowId: (product) => product.id,
    rowCount: productsData?.products?.length,
    isLoading: false,
    pagination: {
      onPaginationChange: () => {},
      state: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  });

  if (isError) {
    throw error;
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Products</Heading>
      </div>
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
    </Container>
  );
};
