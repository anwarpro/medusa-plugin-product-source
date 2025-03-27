import { Container, Heading } from "@medusajs/ui";
import { Brand } from "../../../list/page";
import { BrandRowActions } from "../../../list/brand-row-actions";

type BrandGeneralSectionProps = {
  brand: Brand;
};

export const BrandGeneralSection = ({ brand }: BrandGeneralSectionProps) => {
  return (
    <Container className="flex items-center justify-between">
      <Heading>{brand.name}</Heading>
      <BrandRowActions brand={brand} />
    </Container>
  );
};
