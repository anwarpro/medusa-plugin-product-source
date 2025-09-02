"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const source_1 = require("../../../modules/source");
const utils_1 = require("@medusajs/framework/utils");
const POST = async (req, res) => {
    const { name } = req.body;
    const sourceModuleService = req.scope.resolve(source_1.SOURCE_MODULE);
    const query = req.scope.resolve("query");
    //
    const { data: sourceExists } = await query.graph({
        entity: "source",
        fields: ["*"],
        filters: {
            name: name,
        },
    });
    if (sourceExists.length > 0) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Source name with " + name + " already exists.");
    }
    const source = await sourceModuleService.createSources(req.body);
    res.send({ source });
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
    const sourceModuleService = req.scope.resolve(source_1.SOURCE_MODULE);
    const sourcesWithProducts = await sourceModuleService.getSourcesWithProducts(filterOptions);
    res.send(sourcesWithProducts);
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NvdXJjZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBd0Q7QUFHeEQscURBQXdEO0FBTWpELE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBNkMsRUFDN0MsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQzFCLE1BQU0sbUJBQW1CLEdBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHNCQUFhLENBQUMsQ0FBQztJQUVuQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxFQUFFO0lBQ0YsTUFBTSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDL0MsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLElBQUk7U0FDWDtLQUNGLENBQUMsQ0FBQztJQUNILElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QixNQUFNLElBQUksbUJBQVcsQ0FDbkIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUM5QixtQkFBbUIsR0FBRyxJQUFJLEdBQUcsa0JBQWtCLENBQ2hELENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQTFCVyxRQUFBLElBQUksUUEwQmY7QUFFSyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUV0RSxNQUFNLGFBQWEsR0FBRztRQUNwQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDM0I7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDM0I7UUFDRCxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ3hDLEtBQUssRUFBRSxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDeEQsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQy9DLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7S0FDbkQsQ0FBQztJQUNGLE1BQU0sbUJBQW1CLEdBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHNCQUFhLENBQUMsQ0FBQztJQUNuQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sbUJBQW1CLENBQUMsc0JBQXNCLENBQzFFLGFBQWEsQ0FDZCxDQUFDO0lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQztBQXhCVyxRQUFBLEdBQUcsT0F3QmQifQ==