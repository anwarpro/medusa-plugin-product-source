"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdatedHookHandler = void 0;
const source_1 = require("../../modules/source");
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const productUpdatedHookHandler = async ({ products, additional_data }, { container }) => {
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
};
exports.productUpdatedHookHandler = productUpdatedHookHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC11cGRhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy9wcm9kdWN0LXVwZGF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaURBQW1EO0FBRW5ELHFEQUE2RTtBQUM3RSxxRUFBK0Q7QUFFeEQsTUFBTSx5QkFBeUIsR0FBRyxLQUFLLEVBQUUsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUMsRUFBRSxFQUFFO0lBQ3hGLElBQUksZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sbUJBQW1CLEdBQ3JCLFNBQVMsQ0FBQyxPQUFPLENBQUMsc0JBQWEsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sbUJBQW1CLENBQUMsY0FBYyxDQUNwQyxlQUFlLENBQUMsU0FBbUIsQ0FDdEMsQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQyxNQUFNLEtBQUssR0FBcUIsRUFBRSxDQUFDO1FBQ25DLElBQUksZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDckIsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ2YsVUFBVSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7aUJBQ3BEO2dCQUNELENBQUMsc0JBQWEsQ0FBQyxFQUFFO29CQUNiLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBa0M7aUJBQ2hFO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7WUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDZixVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUU7aUJBQ3pCO2dCQUNELENBQUMsc0JBQWEsQ0FBQyxFQUFFO29CQUNiLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUztpQkFDdkM7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUV6QyxPQUFPLElBQUksNEJBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVyRSxLQUFLLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzNCLE1BQU0sRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ25DLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQztZQUNqQyxPQUFPLEVBQUU7Z0JBQ0wsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2FBQ2pCO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsTUFBTSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDcEMsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUM7U0FDNUMsQ0FBQyxDQUFDO1FBQ0gsSUFDSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUN6QixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixJQUFJLENBQUMsRUFBRSxFQUFFLENBQ3BELEVBQ0gsQ0FBQztZQUNDLE1BQU0sS0FBSyxHQUFHO2dCQUNWLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNmLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTtpQkFDekI7Z0JBQ0QsQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ3JCLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyx3QkFBd0I7aUJBQ3REO2FBQ0osQ0FBQztZQUNGLE1BQU0sWUFBWSxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUMsQ0FBQTtBQXZFWSxRQUFBLHlCQUF5Qiw2QkF1RXJDIn0=