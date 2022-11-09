import { Controller, HttpCode, HttpStatus, Get, Param, NotFoundException } from "@nestjs/common"

import { ArmyService } from "./army.service";
import { ArmyDTO } from "./army.dto";
import { Army } from "./army.entity";

@Controller("armies")
export class ArmyController {
    constructor(
        private readonly armyService: ArmyService,
    ) {}

    @Get("lookup")
    @HttpCode(HttpStatus.OK)
    async lookup() {
        // const a =  await this.armyService.getAll();
        // return(a);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get(@Param("id") id: string) {
        const army: Army = await this.armyService.findOneById(id);
        if (army === null) {
            throw new NotFoundException();
        }
        return new ArmyDTO(army);
    }
}
