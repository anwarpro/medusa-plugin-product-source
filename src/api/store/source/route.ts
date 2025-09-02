import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { SOURCE_MODULE } from "../../../modules/source";
import SourceModuleService from "../../../modules/source/service";

type PostAdminCreateSourceType = {
  name: string;
};

export const POST = async (
  req: MedusaRequest<PostAdminCreateSourceType>,
  res: MedusaResponse
) => {
  const sourceModuleService: SourceModuleService =
    req.scope.resolve(SOURCE_MODULE);

  const source = await sourceModuleService.createSources(req.body);
  res.send({ source });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const { data: sources } = await query.graph({
    entity: "source",
    fields: ["*", "products.*"],
  });
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["*", "source.*"],
  });

  res.send({ sources });
};
