import {
  createProductsWorkflow,
  deleteProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { BRAND_MODULE } from "../../modules/brand";
import BrandModuleService from "../../modules/brand/service";

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    if (!additional_data?.brand_id) {
      return new StepResponse([], []);
    }

    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);
    await brandModuleService.retrieveBrand(additional_data.brand_id as string);

    const remoteLink = container.resolve("remoteLink");
    const logger = container.resolve("logger");

    const links: LinkDefinition[] = [];

    for (const product of products) {
      links.push({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [BRAND_MODULE]: {
          brand_id: additional_data.brand_id,
        },
      });
    }

    await remoteLink.create(links);

    logger.info("Linked brand to products");

    return new StepResponse(links, links);
  }
);

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container }) => {
    if (additional_data?.brand_id) {
      const brandModuleService: BrandModuleService =
        container.resolve(BRAND_MODULE);
      await brandModuleService.retrieveBrand(
        additional_data.brand_id as string
      );

      const remoteLink = container.resolve("remoteLink");
      const logger = container.resolve("logger");

      const links: LinkDefinition[] = [];
      if (additional_data.old_brand_id) {
        await remoteLink.dismiss({
          [Modules.PRODUCT]: {
            product_id: products.map((product) => product.id),
          },
          [BRAND_MODULE]: {
            brand_id: additional_data.old_brand_id as unknown as string,
          },
        });
      }

      for (const product of products) {
        links.push({
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
          [BRAND_MODULE]: {
            brand_id: additional_data.brand_id,
          },
        });
      }

      await remoteLink.create(links);

      logger.info("Linked brand to products");

      return new StepResponse(links, links);
    }
    const query = container.resolve("query");
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);

    for (let product of products) {
      const { data: prod } = await query.graph({
        entity: "product",
        fields: ["*", "sales_channels.*"],
        filters: {
          id: product.id,
        },
      });
      const { data: store } = await query.graph({
        entity: "store",
        fields: ["*", "default_sales_channel_id"],
      });
      if (
        !prod[0].sales_channels?.some(
          (e) => store[0].default_sales_channel_id == e?.id
        )
      ) {
        const links = {
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: store[0].default_sales_channel_id,
          },
        };
        const createdLinks = await remoteLink.create(links);
      }
    }
  }
);

deleteProductsWorkflow.hooks.productsDeleted(async ({ ids }, { container }) => {
  const remoteLink = container.resolve("remoteLink");
  ids.forEach(async (id) => {
    const res = await remoteLink.delete({
      [Modules.PRODUCT]: {
        product_id: id,
      },
    });
  });

  return new StepResponse([]);
});
