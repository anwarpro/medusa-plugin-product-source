"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const utils_2 = require("@medusajs/framework/utils");
const brand_1 = require("./models/brand");
class BrandModuleService extends (0, utils_1.MedusaService)({
    Brand: brand_1.Brand,
}) {
    async getBrandsWithProducts(filters, sharedContext) {
        if (!sharedContext?.manager) {
            throw new Error("Shared context or manager is undefined.");
        }
        // Base query
        let query = `
           SELECT 
			b.id AS id,
			b.name AS name,
			b.created_at,
			b.updated_at,
			ARRAY_AGG(ppbb.product_id) AS product_ids 
		FROM 
			public.brand b
		LEFT JOIN 
			public.product_product_brand_brand ppbb ON b.id = ppbb.brand_id  AND ppbb.deleted_at IS NULL
		WHERE 
			b.deleted_at IS NULL
			${filters.created_at?.$gte ? `AND b.created_at >= '${filters.created_at?.$gte}'` : ""}
		${filters.created_at?.$lte ? `AND b.created_at <= '${filters.created_at?.$lte}'` : ""}
		${filters.updated_at?.$gte ? `AND b.updated_at >= '${filters.updated_at?.$gte}'` : ""}
		${filters.updated_at?.$lte ? `AND b.updated_at <= '${filters.updated_at?.$lte}'` : ""}
		${filters.q ? `AND b.name ILIKE '%${filters.q}%'` : ""}
		GROUP BY 
			b.id, b.name`;
        const sortOptions = filters.order || "created_at";
        const sortDirection = sortOptions.startsWith("-") ? "DESC" : "ASC";
        const sortField = sortOptions.replace("-", "");
        // Append ORDER BY clause
        query += ` ORDER BY ${sortField} ${sortDirection}`;
        const countQuery = `SELECT COUNT(*) FROM (${query}) AS subquery`;
        const countResult = await sharedContext.manager.execute(countQuery);
        const totalCount = countResult[0].count;
        // Append LIMIT and OFFSET clauses
        if (filters.limit !== null) {
            query += ` LIMIT ${filters.limit}`;
        }
        if (filters.offset !== null) {
            query += ` OFFSET ${filters.offset}`;
        }
        // Execute the query
        const result = await sharedContext.manager.execute(query);
        return {
            brands: result,
            count: parseInt(totalCount),
            offset: filters.offset,
            limit: filters.limit,
        };
    }
}
__decorate([
    (0, utils_2.InjectManager)(),
    __param(1, (0, utils_2.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrandModuleService.prototype, "getBrandsWithProducts", null);
exports.default = BrandModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2JyYW5kL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFBMEQ7QUFDMUQscURBQXlFO0FBR3pFLDBDQUF1QztBQWlCdkMsTUFBTSxrQkFBbUIsU0FBUSxJQUFBLHFCQUFhLEVBQUM7SUFDOUMsS0FBSyxFQUFMLGFBQUs7Q0FDTCxDQUFDO0lBRUssQUFBTixLQUFLLENBQUMscUJBQXFCLENBQzFCLE9BQXNCLEVBQ0wsYUFBeUM7UUFFMUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELGFBQWE7UUFDYixJQUFJLEtBQUssR0FBRzs7Ozs7Ozs7Ozs7OztLQWFULE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwRixPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsd0JBQXdCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDbkYsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ25GLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNuRixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFOztnQkFFeEMsQ0FBQztRQUNmLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDO1FBQ2xELE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25FLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRS9DLHlCQUF5QjtRQUN6QixLQUFLLElBQUksYUFBYSxTQUFTLElBQUksYUFBYSxFQUFFLENBQUM7UUFDbkQsTUFBTSxVQUFVLEdBQUcseUJBQXlCLEtBQUssZUFBZSxDQUFDO1FBQ2pFLE1BQU0sV0FBVyxHQUFHLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEUsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN4QyxrQ0FBa0M7UUFDbEMsSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzVCLEtBQUssSUFBSSxVQUFVLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzdCLEtBQUssSUFBSSxXQUFXLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUQsT0FBTztZQUNOLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUM7WUFDM0IsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3RCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztTQUNwQixDQUFDO0lBQ0gsQ0FBQztDQUNEO0FBdkRNO0lBREwsSUFBQSxxQkFBYSxHQUFFO0lBR2QsV0FBQSxJQUFBLHFCQUFhLEdBQUUsQ0FBQTs7OzsrREFvRGhCO0FBR0Ysa0JBQWUsa0JBQWtCLENBQUMifQ==