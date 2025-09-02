import { model } from "@medusajs/framework/utils"

export const Source = model.define("source", {
    id: model.id().primaryKey(),
    name: model.text(),
})