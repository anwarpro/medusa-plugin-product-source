"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = __importDefault(require("../modules/source"));
const product_1 = __importDefault(require("@medusajs/medusa/product"));
const utils_1 = require("@medusajs/framework/utils");
let link = null;
link = (0, utils_1.defineLink)({
    linkable: product_1.default.linkable.product,
    isList: true,
}, source_1.default.linkable.source);
exports.default = link;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlua3MvcHJvZHVjdC1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrREFBZ0U7QUFDaEUsdUVBQXFEO0FBQ3JELHFEQUF5RTtBQUV6RSxJQUFJLElBQUksR0FBNEIsSUFBSSxDQUFDO0FBRXpDLElBQUksR0FBRyxJQUFBLGtCQUFVLEVBQ2Y7SUFDRSxRQUFRLEVBQUUsaUJBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTztJQUN4QyxNQUFNLEVBQUUsSUFBSTtDQUNiLEVBQ0QsZ0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUM3QixDQUFDO0FBRUYsa0JBQWUsSUFBSSxDQUFDIn0=