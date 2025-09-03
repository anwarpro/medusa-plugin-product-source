"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCreatedHookHandler = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const source_1 = require("../../modules/source");
const productCreatedHookHandler = async ({ products, additional_data }, { container }) => {
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
};
exports.productCreatedHookHandler = productCreatedHookHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy9wcm9kdWN0LWNyZWF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQStEO0FBQy9ELHFEQUFrRDtBQUVsRCxpREFBbUQ7QUFHNUMsTUFBTSx5QkFBeUIsR0FBRyxLQUFLLEVBQUUsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUMsRUFBRSxFQUFFO0lBQ3hGLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDOUIsT0FBTyxJQUFJLDRCQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxNQUFNLG1CQUFtQixHQUNyQixTQUFTLENBQUMsT0FBTyxDQUFDLHNCQUFhLENBQUMsQ0FBQztJQUNyQyxNQUFNLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsU0FBbUIsQ0FBQyxDQUFDO0lBRTlFLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUzQyxNQUFNLEtBQUssR0FBcUIsRUFBRSxDQUFDO0lBRW5DLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7UUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNQLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNmLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTthQUN6QjtZQUNELENBQUMsc0JBQWEsQ0FBQyxFQUFFO2dCQUNiLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUzthQUN2QztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0IsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBRXpDLE9BQU8sSUFBSSw0QkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUE7QUE5QlksUUFBQSx5QkFBeUIsNkJBOEJyQyJ9