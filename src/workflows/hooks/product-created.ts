import {StepResponse} from "@medusajs/framework/workflows-sdk";
import {Modules} from "@medusajs/framework/utils";
import {LinkDefinition} from "@medusajs/framework/types";
import {SOURCE_MODULE} from "../../modules/source";
import SourceModuleService from "../../modules/source/service";

export const productCreatedHookHandler = async ({products, additional_data}, {container}) => {
    if (!additional_data?.source_id) {
        return new StepResponse([], []);
    }

    const sourceModuleService: SourceModuleService =
        container.resolve(SOURCE_MODULE);
    await sourceModuleService.retrieveSource(additional_data.source_id as string);

    const remoteLink = container.resolve("remoteLink");
    const logger = container.resolve("logger");

    const links: LinkDefinition[] = [];

    for (const product of products) {
        links.push({
            [Modules.PRODUCT]: {
                product_id: product.id,
            },
            [SOURCE_MODULE]: {
                source_id: additional_data.source_id,
            },
        });
    }

    await remoteLink.create(links);

    logger.info("Linked source to products");

    return new StepResponse(links, links);
}