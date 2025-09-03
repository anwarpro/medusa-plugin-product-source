import SourceModuleService from "../../modules/source/service";
import {SOURCE_MODULE} from "../../modules/source";
import {LinkDefinition} from "@medusajs/framework/types";
import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils";
import {StepResponse} from "@medusajs/framework/workflows-sdk";

export const productUpdatedHookHandler = async ({products, additional_data}, {container}) => {
    if (additional_data?.source_id) {
        const sourceModuleService: SourceModuleService =
            container.resolve(SOURCE_MODULE);
        await sourceModuleService.retrieveSource(
            additional_data.source_id as string
        );

        const remoteLink = container.resolve("remoteLink");
        const logger = container.resolve("logger");

        const links: LinkDefinition[] = [];
        if (additional_data.old_source_id) {
            await remoteLink.dismiss({
                [Modules.PRODUCT]: {
                    product_id: products.map((product) => product.id),
                },
                [SOURCE_MODULE]: {
                    source_id: additional_data.old_source_id as unknown as string,
                },
            });
        }

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

    const query = container.resolve("query");
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);

    for (let product of products) {
        const {data: prod} = await query.graph({
            entity: "product",
            fields: ["*", "sales_channels.*"],
            filters: {
                id: product.id,
            },
        });
        const {data: store} = await query.graph({
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