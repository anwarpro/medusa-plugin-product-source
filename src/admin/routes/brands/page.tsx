import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Text } from "@medusajs/ui";
import { Link } from "react-router-dom";
import BrandList from "./list/page";

const BrandPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Brand List</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Organize your Brands
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">Create</Link>
        </Button>
      </div>
      <BrandList />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Brand",
});

export default BrandPage;
