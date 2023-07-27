import { Injectable } from "@nestjs/common";
import { FindOptionsRelations, QueryBuilder, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnit } from "./army-list-unit.entity";
import { ArmyList } from "@army-list/army-list.entity";
import { Unit } from "@army/unit/unit.entity";
import { UnitService } from "@army/unit/troop/unit.service";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import { query } from "express";
import {
    ArmyListUnitMagicStandard
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { Troop } from "@army/unit/troop/troop.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import {
    ArmyListUnitTroopEquipment
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import { ArmyListUnitDTO } from "@army-list/army-list-unit/army-list-unit.dto";

export type ArmyListUnitServiceOptions = {
    loadAll?: boolean;
    loadUnit?: boolean;
    loadMagicItems?: boolean;
    loadMagicStandards?: boolean;
    loadOptions?: boolean;
    loadTroops?: boolean;
    loadSpecialRules?: boolean;
    loadEquipment?: boolean;
}

type ArmyListUnitOptionType = ArmyListUnitMagicItem | ArmyListUnitMagicStandard | ArmyListUnitOption | Troop | ArmyListUnitTroopSpecialRule | ArmyListUnitTroopEquipment;

@Injectable()
export class ArmyListUnitService {
    constructor(
        @InjectRepository(ArmyListUnit)
        private readonly repository: Repository<ArmyListUnit>,
        private readonly unitService: UnitService
    ) {}

    async create(unitId: number, quantity: number, formation: string, troopIds: number[], magicItems: ArmyListUnitMagicItem[], armyList?: ArmyList): Promise<ArmyListUnit> {
        const id: string = randomUUID();
        const unit: Unit = await this.unitService.findOneById(unitId);

        return this.repository.create({ id, unit, quantity, formation, troopIds, armyList, magicItems: ([] as ArmyListUnitMagicItem[])});
    }

    async save(unit: ArmyListUnit): Promise<ArmyListUnit> {
        return this.repository.save(unit);
    }

    // async addMagicItem(unit: ArmyListUnit, item: ArmyListUnitMagicItem): Promise<void> {
    //     await this.repository.createQueryBuilder().relation(ArmyListUnit, "magicItems").of(unit).add(item);
    // }

    async addOption(unit: ArmyListUnit, option: ArmyListUnitOptionType): Promise<void> {
        await this.repository.createQueryBuilder().relation(ArmyListUnit, this._getRelation(option)).of(unit).add(option);
    }

    async findByArmyList(listId: string, options?: ArmyListUnitServiceOptions): Promise<ArmyListUnit[]> {
        return this.repository.find({
            where: { armyList: { id: listId }},
            relations: {
                unit: (options?.loadAll === true || options?.loadUnit === true),
                magicItems: (options?.loadAll === true || options?.loadMagicItems === true),
                magicStandards: (options?.loadAll === true || options?.loadMagicStandards === true)
        }});
    }

    async deleteByArmyList(listId: string): Promise<void> {
        await this.repository.delete({ armyList: { id : listId }});
    }

    // TODO: add tests
    private _getRelation(option: ArmyListUnitOptionType): string {
        switch (option.constructor) {
            case ArmyListUnitMagicItem:
                return "magicItems";
            case ArmyListUnitMagicStandard:
                return "magicStandards";
            case ArmyListUnitOption:
                return "options";
            case Troop:
                return "troops";
            case ArmyListUnitTroopSpecialRule:
                return "specialRuleTroops";
            case ArmyListUnitTroopEquipment:
                return "equipmentTroops";
        }
    }
}
