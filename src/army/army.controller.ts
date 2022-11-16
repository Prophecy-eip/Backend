import { Controller, HttpCode, HttpStatus, Get, Param, NotFoundException } from "@nestjs/common"

import { ArmyService } from "./army.service";
import { ArmyDTO } from "./army.dto";
import { Army } from "./army.entity";
import { ArmyCredentialsDTO } from "./army-creadetials.dto";

@Controller("armies")
export class ArmyController {
    constructor(
        private readonly armyService: ArmyService,
    ) {}

    @Get("lookup")
    @HttpCode(HttpStatus.OK)
    async lookup() {
        const armies: Army[] =  await this.armyService.getAll();
        let arr: ArmyCredentialsDTO[] = [];

        for (const army of armies) {
            arr.push(new ArmyCredentialsDTO(army.id, army.name));
        }
        return arr;
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get(@Param("id") id: string) {
        let army: Army = await this.armyService.findOneById(id);

        if (army === null) {
            throw new NotFoundException();
        }
        await army.load();
        return new ArmyDTO(army);
    }
}
