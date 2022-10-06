import {Controller, HttpCode, HttpStatus, Get } from "@nestjs/common"

import { ArmyService } from "./army.service";

@Controller("armies")
export class ArmyController {
    constructor(
    private readonly armyService: ArmyService,
    ) {}

    @Get("lookup")
    @HttpCode(HttpStatus.OK)
    async lookup() {
        return await this.armyService.getAll();
    }
}