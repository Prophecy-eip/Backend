import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UnitProfile } from "./unit-profile.entity";

@Injectable()
export class UnitProfileService {
    constructor(
        @InjectRepository(UnitProfile)
        private repository: Repository<UnitProfile>
    ) {}

    async findByOwner(ownerId: string): Promise<UnitProfile[]> {
        return this.repository.findBy([{ ownerId: ownerId}])
    }
}
