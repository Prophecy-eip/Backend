import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { Repository } from "typeorm";

@Injectable()
class UnitOptionService {

    constructor(
        @InjectRepository(UnitOption)
        private repository: Repository<UnitOption>
    ) {}

    async findOneById(id: number): Promise<UnitOption> {
        return this.repository.findOneBy([{ id: id }]);
    }

    async findByIds(ids: number[]): Promise<UnitOption[]> {
        return Promise.all(ids.map(async (id: number): Promise<UnitOption> => this.repository.findOneBy([{ id: id }])));
    }
}

export default UnitOptionService;
