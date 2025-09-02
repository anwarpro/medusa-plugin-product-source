import { Container } from "@medusajs/ui";
import { useLocation } from "react-router-dom";
import { SourceGeneralSection } from "./components/source-general-section";
import { SourceProductSection } from "./components/source-product-section";

const SourceDetail = () => {
  const { state } = useLocation();

  return (
    <Container className="flex flex-col gap-4">
      <SourceGeneralSection source={state} />
      <SourceProductSection source={state} />
    </Container>
  );
};

export default SourceDetail;
