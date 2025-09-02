import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Text } from "@medusajs/ui";
import { Link } from "react-router-dom";
import SourceList from "./list/page";

const SourcePage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Source List</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Organize your Sources
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">Create</Link>
        </Button>
      </div>
      <SourceList />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Source",
});

export default SourcePage;
