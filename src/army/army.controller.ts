import { BadRequestException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param } from "@nestjs/common";

import { Army } from "./army.entity";
import { ArmyCredentialsDTO } from "./army-credentials.dto";
import { ArmyDTO } from "./army.dto";

import { ArmyService } from "./army.service";

@Controller("armies")
export class ArmyController {
    constructor(
        private readonly armyService: ArmyService,
    ) {}

    @Get("")
    @HttpCode(HttpStatus.OK)
    async lookup() {
        const armies: Army[] =  await this.armyService.getAll();
        let arr: ArmyCredentialsDTO[] = [];

        for (const army of armies) {
            arr.push(new ArmyCredentialsDTO(army));
        }
        return arr;
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get(@Param("id") id: number) {
        try {
            let army: Army = await this.armyService.findOneById(id);
            if (army === null) {
                throw new NotFoundException();
            }
            await army.load();
            return new ArmyDTO(army);
        } catch (error) {
            if (error.message.includes("out of range for type integer")) {
                throw new BadRequestException("Invalid id type");
            }
            if (error instanceof NotFoundException) {
                throw new NotFoundException();
            }

        }
    }
}
