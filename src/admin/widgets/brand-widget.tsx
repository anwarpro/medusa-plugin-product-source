import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Badge, Container, Tooltip } from "@medusajs/ui";
import { SectionRow } from "../components/common/section";
import { Link, useParams } from "react-router-dom";
import { sdk } from "../utils/sdk";
import { useQuery } from "@tanstack/react-query";
import { HttpTypes } from "@medusajs/framework/types";
import AddProductBrand from "./components/add-product-brand";

const BrandWidget = () => {
  const params = useParams();

  const { data } = useQuery<HttpTypes.AdminProduct | any>({
    queryFn: () =>
      sdk.client.fetch(`/admin/products/${params?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        query: {
          fields: "brand.*",
        },
      }),
    queryKey: ["products"],
    refetchOnMount: "always",
  });

  return (
    <Container className="divide-y p-0">
      <AddProductBrand />
      <SectionRow
        title={"Brand"}
        value={
          data?.product?.brand?.name ? (
            <OrganizationTag
              label={data?.product?.brand.name}
              to={`/settings/brand`}
            />
          ) : undefined
        }
      />
    </Container>
  );
};

const OrganizationTag = ({ label, to }: { label: string; to: string }) => {
  return (
    <Tooltip content={label}>
      <Badge size="2xsmall" className="block w-fit truncate" asChild>
        <Link to={to}>{label}</Link>
      </Badge>
    </Tooltip>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default BrandWidget;
