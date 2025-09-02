import SourceModule, { SOURCE_MODULE } from "../modules/source";
import ProductModule from "@medusajs/medusa/product";
import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";

let link: DefineLinkExport | null = null;

link = defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  SourceModule.linkable.source
);

export default link;
