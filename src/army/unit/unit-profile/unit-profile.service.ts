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


    async findByIdArray(ids: string[]): Promise<UnitProfile[]> {
        let profiles: UnitProfile[] = []

        for (const id of ids) {
            const p = await this.repository.findOneBy([{ id: id }]);

            if (p === null) {
                continue;
            }
            profiles.push(p);
        }
        return profiles;
    }
}
