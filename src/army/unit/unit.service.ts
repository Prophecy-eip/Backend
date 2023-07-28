import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Unit } from "@army/unit/unit.entity";
import { Repository } from "typeorm";

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private readonly repository: Repository<Unit>
    ) {}

    async findOneById(id: number): Promise<Unit> { // TODO: add options
        return this.repository.findOneBy([{ id: id }]);
    }
}
