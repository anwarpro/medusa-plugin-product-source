"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const source_1 = require("../../../modules/source");
const POST = async (req, res) => {
    const sourceModuleService = req.scope.resolve(source_1.SOURCE_MODULE);
    const source = await sourceModuleService.createSources(req.body);
    res.send({ source });
};
exports.POST = POST;
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { data: sources } = await query.graph({
        entity: "source",
        fields: ["*", "products.*"],
    });
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["*", "source.*"],
    });
    res.send({ sources });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NvdXJjZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxvREFBd0Q7QUFPakQsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUE2QyxFQUM3QyxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxtQkFBbUIsR0FDdkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsc0JBQWEsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sTUFBTSxHQUFHLE1BQU0sbUJBQW1CLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFUVyxRQUFBLElBQUksUUFTZjtBQUVLLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV6QyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDO0tBQzVCLENBQUMsQ0FBQztJQUNILE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzNDLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUM7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBYlcsUUFBQSxHQUFHLE9BYWQifQ==