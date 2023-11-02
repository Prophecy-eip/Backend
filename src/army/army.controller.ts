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
    async lookup(): Promise<ArmyCredentialsDTO[]> {
        const armies: Army[] =  await this.armyService.getAll();

        return armies.map((army: Army) => new ArmyCredentialsDTO(army));
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get(@Param("id") id: number): Promise<ArmyDTO> {
        try {
            let army: Army = await this.armyService.findOneById(id, { loadUnits: true });
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
