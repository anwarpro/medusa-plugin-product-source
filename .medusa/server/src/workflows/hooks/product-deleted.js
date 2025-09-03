"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productDeletedHookHandler = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const productDeletedHookHandler = async ({ ids }, { container }) => {
    const remoteLink = container.resolve("remoteLink");
    ids.forEach(async (id) => {
        const res = await remoteLink.delete({
            [utils_1.Modules.PRODUCT]: {
                product_id: id,
            },
        });
    });
    return new workflows_sdk_1.StepResponse([]);
};
exports.productDeletedHookHandler = productDeletedHookHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1kZWxldGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy9wcm9kdWN0LWRlbGV0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQStEO0FBQy9ELHFEQUFrRDtBQUUzQyxNQUFNLHlCQUF5QixHQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RSxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ25ELEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUNsQyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDakIsVUFBVSxFQUFFLEVBQUU7YUFDZjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxJQUFJLDRCQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFBO0FBWFksUUFBQSx5QkFBeUIsNkJBV3JDIn0=