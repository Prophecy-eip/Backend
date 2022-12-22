import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Unit } from "./unit.entity";

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private repository: Repository<Unit>
    ) {}

    async findOneById(id: string): Promise<Unit> {
        return await this.repository.findOneBy([{ id: id }]);
    }
}
