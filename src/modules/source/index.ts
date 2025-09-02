import { Module } from "@medusajs/framework/utils"
import SourceModuleService from "./service"

export const SOURCE_MODULE = "source"

export default Module(SOURCE_MODULE, {
    service: SourceModuleService,
})