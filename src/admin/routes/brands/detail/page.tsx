import { Container } from "@medusajs/ui";
import { useLocation } from "react-router-dom";
import { BrandGeneralSection } from "./components/brand-general-section";
import { BrandProductSection } from "./components/brand-product-section";

const BrandDetail = () => {
  const { state } = useLocation();

  return (
    <Container className="flex flex-col gap-4">
      <BrandGeneralSection brand={state} />
      <BrandProductSection brand={state} />
    </Container>
  );
};

export default BrandDetail;
