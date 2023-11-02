import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SpecialRuleUnitTroop } from "@army/unit/troop/special-rule/special-rule-unit-troop.entity";

@Injectable()
class SpecialRuleUnitTroopService {

    constructor(
        @InjectRepository(SpecialRuleUnitTroop)
        private repository: Repository<SpecialRuleUnitTroop>
    ) {}

    async findOneById(id: number): Promise<SpecialRuleUnitTroop> {
        return this.repository.findOneBy([{ id: id }]);
    }

    async findByIds(ids: number[]): Promise<SpecialRuleUnitTroop[]> {
        return Promise.all(ids.map(async (id: number): Promise<SpecialRuleUnitTroop> => this.repository.findOneBy([{ id: id }])));
    }
}

export default SpecialRuleUnitTroopService;
