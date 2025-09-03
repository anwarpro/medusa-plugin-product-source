import {StepResponse} from "@medusajs/framework/workflows-sdk";
import {Modules} from "@medusajs/framework/utils";

export const productDeletedHookHandler =async ({ ids }, { container }) => {
  const remoteLink = container.resolve("remoteLink");
  ids.forEach(async (id) => {
    const res = await remoteLink.delete({
      [Modules.PRODUCT]: {
        product_id: id,
      },
    });
  });

  return new StepResponse([]);
}