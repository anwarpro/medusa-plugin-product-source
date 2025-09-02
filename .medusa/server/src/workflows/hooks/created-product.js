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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlZC1wcm9kdWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy9jcmVhdGVkLXByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFJcUM7QUFDckMscUVBQWlFO0FBQ2pFLHFEQUErRTtBQUUvRSxpREFBcUQ7QUFHckQsbUNBQXNCLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FDMUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNyRCxJQUFJLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSw0QkFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxtQkFBbUIsR0FDdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxzQkFBYSxDQUFDLENBQUM7SUFDbkMsTUFBTSxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFNBQW1CLENBQUMsQ0FBQztJQUU5RSxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ25ELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0MsTUFBTSxLQUFLLEdBQXFCLEVBQUUsQ0FBQztJQUVuQyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDVCxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDakIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2FBQ3ZCO1lBQ0QsQ0FBQyxzQkFBYSxDQUFDLEVBQUU7Z0JBQ2YsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJ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