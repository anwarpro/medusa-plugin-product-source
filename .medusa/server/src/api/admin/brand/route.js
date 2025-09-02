"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const brand_1 = require("../../../modules/brand");
const utils_1 = require("@medusajs/framework/utils");
const POST = async (req, res) => {
    const { name } = req.body;
    const brandModuleService = req.scope.resolve(brand_1.BRAND_MODULE);
    const query = req.scope.resolve("query");
    //
    const { data: brandExists } = await query.graph({
        entity: "brand",
        fields: ["*"],
        filters: {
            name: name,
        },
    });
    if (brandExists.length > 0) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Brand name with " + name + " already exists.");
    }
    const brand = await brandModuleService.createBrands(req.body);
    res.send({ brand });
};
exports.POST = POST;
const GET = async (req, res) => {
    const { created_at, updated_at, q, order, limit, offset } = req.query;
    const filterOptions = {
        created_at: {
            $gte: created_at?.["$gte"],
            $lte: created_at?.["$lte"],
        },
        updated_at: {
            $gte: updated_at?.["$gte"],
            $lte: updated_at?.["$lte"],
        },
        q: q && typeof q === "string" ? q : null,
        order: order && typeof order === "string" ? order : null,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : null,
    };
    const brandModuleService = req.scope.resolve(brand_1.BRAND_MODULE);
    const brandsWithProducts = await brandModuleService.getBrandsWithProducts(filterOptions);
    res.send(brandsWithProducts);
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2JyYW5kL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUFzRDtBQUd0RCxxREFBd0Q7QUFNakQsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUE0QyxFQUM1QyxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDMUIsTUFBTSxrQkFBa0IsR0FDdEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsb0JBQVksQ0FBQyxDQUFDO0lBRWxDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLEVBQUU7SUFDRixNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUM5QyxNQUFNLEVBQUUsT0FBTztRQUNmLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNiLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxJQUFJO1NBQ1g7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDM0IsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDOUIsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLGtCQUFrQixDQUMvQyxDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sa0JBQWtCLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5RCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN0QixDQUFDLENBQUM7QUExQlcsUUFBQSxJQUFJLFFBMEJmO0FBRUssTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFFdEUsTUFBTSxhQUFhLEdBQUc7UUFDcEIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDO1NBQzNCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDO1NBQzNCO1FBQ0QsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUN4QyxLQUFLLEVBQUUsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ3hELEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUMvQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0tBQ25ELENBQUM7SUFDRixNQUFNLGtCQUFrQixHQUN0QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxvQkFBWSxDQUFDLENBQUM7SUFDbEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGtCQUFrQixDQUFDLHFCQUFxQixDQUN2RSxhQUFhLENBQ2QsQ0FBQztJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUF4QlcsUUFBQSxHQUFHLE9Bd0JkIn0=