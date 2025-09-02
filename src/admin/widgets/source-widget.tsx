import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Badge, Container, Tooltip } from "@medusajs/ui";
import { SectionRow } from "../components/common/section";
import { Link, useParams } from "react-router-dom";
import { sdk } from "../utils/sdk";
import { useQuery } from "@tanstack/react-query";
import { HttpTypes } from "@medusajs/framework/types";
import AddProductSource from "../routes/sources/detail/components/add-product-source";

const SourceWidget = () => {
  const params = useParams();

  const { data } = useQuery<HttpTypes.AdminProduct | any>({
    queryFn: () =>
      sdk.client.fetch(`/admin/products/${params?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          query: {
            fields: "source.*",
          },
        }
      ),
    queryKey: ["products"],
    refetchOnMount: "always",
  });

  return (
    <Container className="divide-y p-0">
      <AddProductSource />
      <SectionRow
        title={"Source"}
        value={
          data?.product?.source?.name ? (
            <OrganizationTag label={data?.product?.source.name} to={`/sources`} />
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

export default SourceWidget;
