import { Container, Heading } from "@medusajs/ui";
import { Source } from "../../../list/page";
import { SourceRowActions } from "../../../list/source-row-actions";

type SourceGeneralSectionProps = {
  source: Source;
};

export const SourceGeneralSection = ({ source }: SourceGeneralSectionProps) => {
  return (
    <Container className="flex items-center justify-between">
      <Heading>{source.name}</Heading>
      <SourceRowActions source={source} />
    </Container>
  );
};
