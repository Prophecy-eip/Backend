import { Injectable} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import {Rule} from "./rule.entity";

@Injectable()
export class RuleService {
    constructor(
        @InjectRepository(Rule)
        private repository: Repository<Rule>
    ) {}

    async findOneById(id: string): Promise<Rule> {
        return this.repository.findOneBy([{ id: id }]);
    }

    async findByIds(ids: string[]): Promise<Rule[]> {
        let array: Rule[] = [];

        for (const id of ids) {
            array.push(await this.repository.findOneBy([{ id: id }]));
        }
        return array;
    }
}