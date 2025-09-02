import { SOURCE_MODULE } from "../../../../modules/source";
import SourceModuleService from "../../../../modules/source/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const sourceModuleService: SourceModuleService =
    req.scope.resolve(SOURCE_MODULE);
  const { id } = req.params;

  const query = req.scope.resolve("query");
  const { data: sources } = await query.graph({
    entity: "source",
    fields: ["*", "products.*"],
    filters: {
      id: id,
    },
  });
  if (!sources) {
    throw new Error("Source not found");
  }

  if (sources[0].products && sources[0].products.length > 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Source is associated with products. Cannot delete."
    );
  }

  await sourceModuleService.deleteSources(id);
  const sourceDeleted = await sourceModuleService.listSources();
  res
    .status(200)
    .json({ source: sourceDeleted, message: "Source deleted successfully" });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const sourceModuleService: SourceModuleService =
    req.scope.resolve(SOURCE_MODULE);
  const { id } = req.params;
  if (!id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Source ID is required."
    );
  }
  if (
    typeof req.body !== "object" ||
    req.body === null ||
    !req.body.hasOwnProperty("name")
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid request body. 'name' property is required."
    );
  }
  const { name } = req.body as { name: string };
  const query = req.scope.resolve("query");
  const { data: sourceExists } = await query.graph({
    entity: "source",
    fields: ["*"],
    filters: {
      name: name,
    },
  });
  if (sourceExists.length > 0 && sourceExists[0].id !== id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Source name with " + name + " already exists."
    );
  }
  const source = await sourceModuleService.updateSources({ id, name });

  res.send({ source });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const query = req.scope.resolve("query");

  const { data: sources } = await query.graph({
    entity: "source",
    fields: ["*", "products.*"],
    filters: {
      id: id,
    },
  });
  if (!sources) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Source not found");
  }
  res.send(sources[0]);
};
