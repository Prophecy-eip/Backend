import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UnitCategory } from "./unit-category.entity";

@Injectable()
export class UnitCategoryService {
    constructor(
        @InjectRepository(UnitCategory)
        private repository: Repository<UnitCategory>
    ) {}

    async findAllByArmy(armyId: string): Promise<UnitCategory[]> {
        return await this.repository.findBy([{ army: armyId }]);
    }
}