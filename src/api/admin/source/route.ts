import { SOURCE_MODULE } from "../../../modules/source";
import SourceModuleService from "../../../modules/source/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";

type PostAdminCreateSourceType = {
  name: string;
};

export const POST = async (
  req: MedusaRequest<PostAdminCreateSourceType>,
  res: MedusaResponse
) => {
  const { name } = req.body;
  const sourceModuleService: SourceModuleService =
    req.scope.resolve(SOURCE_MODULE);

  const query = req.scope.resolve("query");
  //
  const { data: sourceExists } = await query.graph({
    entity: "source",
    fields: ["*"],
    filters: {
      name: name,
    },
  });
  if (sourceExists.length > 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Source name with " + name + " already exists."
    );
  }

  const source = await sourceModuleService.createSources(req.body);
  res.send({ source });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { created_at, updated_at, q, order, limit, offset } = req.query;

  const filterOptions = {
    created_at: {
      $gte: created_at?.["$gte"],
      $lte: created_at?.["$lte"],
    },
    updated_at: {
      $gte: updated_at?.["$gte"],
      $lte: updated_at?.["$lte"],
    },
    q: q && typeof q === "string" ? q : null,
    order: order && typeof order === "string" ? order : null,
    limit: limit ? parseInt(limit as string) : null,
    offset: offset ? parseInt(offset as string) : null,
  };
  const sourceModuleService: SourceModuleService =
    req.scope.resolve(SOURCE_MODULE);
  const sourcesWithProducts = await sourceModuleService.getSourcesWithProducts(
    filterOptions
  );

  res.send(sourcesWithProducts);
};
