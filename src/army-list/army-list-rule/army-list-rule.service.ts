import { Injectable } from "@nestjs/common";

import { ArmyListRule } from "./army-list-rule.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { randomUUID } from "crypto";
import loader from "ts-loader";

@Injectable()
export class ArmyListRuleService {
    constructor(
        @InjectRepository(ArmyListRule)
        private repository: Repository<ArmyListRule>
    ) {}

    async create(list: string, rule: string): Promise<ArmyListRule> {
        const id: string = randomUUID();
        return this.repository.create({ id, list, rule });
    }

    async save(rule: ArmyListRule): Promise<ArmyListRule> {
        return this.repository.save(rule);
    }
}