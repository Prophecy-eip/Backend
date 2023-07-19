import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SpecialRule } from "@army/special-rule/special-rule.entity";

@Injectable()
class SpecialRuleService {

    constructor(
        @InjectRepository(SpecialRule)
        private repository: Repository<SpecialRule>
    ) {}

    async findOneById(id: number): Promise<SpecialRule> {
        return this.repository.findOneBy([{ id: id }]);
    }
}

export default SpecialRuleService;
