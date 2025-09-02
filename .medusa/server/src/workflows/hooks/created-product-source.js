"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const source_1 = require("../../modules/source");
core_flows_1.createProductsWorkflow.hooks.productsCreated(async ({ products, additional_data }, { container }) => {
    if (!additional_data?.source_id) {
        return new workflows_sdk_1.StepResponse([], []);
    }
    const sourceModuleService = container.resolve(source_1.SOURCE_MODULE);
    await sourceModuleService.retrieveSource(additional_data.source_id);
    const remoteLink = container.resolve("remoteLink");
    const logger = container.resolve("logger");
    const links = [];
    for (const product of products) {
        links.push({
            [utils_1.Modules.PRODUCT]: {
                product_id: product.id,
            },
            [source_1.SOURCE_MODULE]: {
                source_id: additional_data.source_id,
            },
        });
    }
    await remoteLink.create(links);
    logger.info("Linked source to products");
    return new workflows_sdk_1.StepResponse(links, links);
});
core_flows_1.updateProductsWorkflow.hooks.productsUpdated(async ({ products, additional_data }, { container }) => {
    if (additional_data?.source_id) {
        const sourceModuleService = container.resolve(source_1.SOURCE_MODULE);
        await sourceModuleService.retrieveSource(additional_data.source_id);
        const remoteLink = container.resolve("remoteLink");
        const logger = container.resolve("logger");
        const links = [];
        if (additional_data.old_source_id) {
            await remoteLink.dismiss({
                [utils_1.Modules.PRODUCT]: {
                    product_id: products.map((product) => product.id),
                },
                [source_1.SOURCE_MODULE]: {
                    source_id: additional_data.old_source_id,
                },
            });
        }
        for (const product of products) {
            links.push({
                [utils_1.Modules.PRODUCT]: {
                    product_id: product.id,
                },
                [source_1.SOURCE_MODULE]: {
                    source_id: additional_data.source_id,
                },
            });
        }
        await remoteLink.create(links);
        logger.info("Linked source to products");
        return new workflows_sdk_1.StepResponse(links, links);
    }
    const query = container.resolve("query");
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
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
        if (!prod[0].sales_channels?.some((e) => store[0].default_sales_channel_id == e?.id)) {
            const links = {
                [utils_1.Modules.PRODUCT]: {
                    product_id: product.id,
                },
                [utils_1.Modules.SALES_CHANNEL]: {
                    sales_channel_id: store[0].default_sales_channel_id,
                },
            };
            const createdLinks = await remoteLink.create(links);
        }
    }
});
core_flows_1.deleteProductsWorkflow.hooks.productsDeleted(async ({ ids }, { container }) => {
    const remoteLink = container.resolve("remoteLink");
    ids.forEach(async (id) => {
        const res = await remoteLink.delete({
            [utils_1.Modules.PRODUCT]: {
                product_id: id,
            },
        });
    });
    return new workflows_sdk_1.StepResponse([]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlZC1wcm9kdWN0LXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3MvaG9va3MvY3JlYXRlZC1wcm9kdWN0LXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDREQUlxQztBQUNyQyxxRUFBaUU7QUFDakUscURBQStFO0FBRS9FLGlEQUFxRDtBQUdyRCxtQ0FBc0IsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUMxQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDaEMsT0FBTyxJQUFJLDRCQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxNQUFNLG1CQUFtQixHQUN2QixTQUFTLENBQUMsT0FBTyxDQUFDLHNCQUFhLENBQUMsQ0FBQztJQUNuQyxNQUFNLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsU0FBbUIsQ0FBQyxDQUFDO0lBRTlFLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUzQyxNQUFNLEtBQUssR0FBcUIsRUFBRSxDQUFDO0lBRW5DLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7UUFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNULENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNqQixVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUU7YUFDdkI7WUFDRCxDQUFDLHNCQUFhLENBQUMsRUFBRTtnQkFDZixTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVM7YUFDckM7U0FDRixDQUFDLENB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