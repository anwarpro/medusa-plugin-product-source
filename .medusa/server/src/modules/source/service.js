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
const source_1 = require("./models/source");
class SourceModuleService extends (0, utils_1.MedusaService)({
    Source: source_1.Source,
}) {
    async getSourcesWithProducts(filters, sharedContext) {
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
			public.source b
		LEFT JOIN 
			public.product_product_source_source ppbb ON b.id = ppbb.source_id  AND ppbb.deleted_at IS NULL
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
            sources: result,
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
], SourceModuleService.prototype, "getSourcesWithProducts", null);
exports.default = SourceModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3NvdXJjZS9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEscURBQTBEO0FBQzFELHFEQUF5RTtBQUd6RSw0Q0FBeUM7QUFpQnpDLE1BQU0sbUJBQW9CLFNBQVEsSUFBQSxxQkFBYSxFQUFDO0lBQy9DLE1BQU0sRUFBTixlQUFNO0NBQ04sQ0FBQztJQUVLLEFBQU4sS0FBSyxDQUFDLHNCQUFzQixDQUMzQixPQUFzQixFQUNMLGFBQXlDO1FBRTFELElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxhQUFhO1FBQ2IsSUFBSSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7Ozs7S0FhVCxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsd0JBQXdCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDcEYsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ25GLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNuRixPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsd0JBQXdCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDbkYsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTs7Z0JBRXhDLENBQUM7UUFDZixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLFlBQVksQ0FBQztRQUNsRCxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNuRSxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUvQyx5QkFBeUI7UUFDekIsS0FBSyxJQUFJLGFBQWEsU0FBUyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ25ELE1BQU0sVUFBVSxHQUFHLHlCQUF5QixLQUFLLGVBQWUsQ0FBQztRQUNqRSxNQUFNLFdBQVcsR0FBRyxNQUFNLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDeEMsa0NBQWtDO1FBQ2xDLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM1QixLQUFLLElBQUksVUFBVSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM3QixLQUFLLElBQUksV0FBVyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUVELG9CQUFvQjtRQUNwQixNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELE9BQU87WUFDTixPQUFPLEVBQUUsTUFBTTtZQUNmLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQzNCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN0QixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7U0FDcEIsQ0FBQztJQUNILENBQUM7Q0FDRDtBQXZETTtJQURMLElBQUEscUJBQWEsR0FBRTtJQUdkLFdBQUEsSUFBQSxxQkFBYSxHQUFFLENBQUE7Ozs7aUVBb0RoQjtBQUdGLGtCQUFlLG1CQUFtQixDQUFDIn0=