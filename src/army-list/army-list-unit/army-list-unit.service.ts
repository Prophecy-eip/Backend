import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnit } from "./army-list-unit.entity";
import { ArmyList } from "@army-list/army-list.entity";
import { Unit } from "@army/unit/unit.entity";
import { UnitService } from "@army/unit/unit.service";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
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
import { TroopService } from "@army/unit/troop/troop.service";
import { ArmyListUnitMagicItemService } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.service";
import {
    ArmyListUnitMagicStandardService
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.service";
import { ArmyListUnitOptionService } from "@army-list/army-list-unit/option/army-list-unit-option.service";
import {
    ArmyListUnitTroopSpecialRuleService
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.service";
import {
    ArmyListUnitTroopEquipmentService
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.service";
import { ArmyListUnitMagicItemDTO } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.dto";
import {
    ArmyListUnitMagicStandardDTO
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.dto";
import { ArmyListUnitOptionDTO } from "@army-list/army-list-unit/option/army-list-unit-option.dto";
import {
    ArmyListUnitTroopSpecialRuleDTO
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.dto";
import {
    ArmyListUnitTroopEquipmentDTO
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.dto";
import { ArmyListUnitCredentialsDTO } from "@army-list/army-list-unit/army-list-unit-credentials.dto";

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
        private readonly unitService: UnitService,
        private readonly troopService: TroopService,
        private readonly armyListUnitMagicItemService: ArmyListUnitMagicItemService,
        private readonly armyListUnitMagicStandardService: ArmyListUnitMagicStandardService,
        private readonly armyListUnitOptionService: ArmyListUnitOptionService,
        private readonly armyListUnitTroopSpecialRuleService: ArmyListUnitTroopSpecialRuleService,
        private readonly armyListUnitTroopEquipmentService: ArmyListUnitTroopEquipmentService,
    ) {}

    async createAndSaveWithRelations(
        credentials: ArmyListUnitCredentialsDTO,
        armyList?: ArmyList
    ): Promise<ArmyListUnit> {
        const id: string = randomUUID();
        const unit: Unit = await this.unitService.findOneById(credentials.unitId);

        if (unit === null) {
            throw new NotFoundException(`Unit ${credentials.unitId} not found.`);
        }
        const troops: Troop[] = await this.troopService.findByIds(credentials.troopIds);
        const armyListUnit: ArmyListUnit = await this.repository.save(await this.repository.create({
            id,
            unit,
            quantity: credentials.quantity,
            formation: credentials.formation,
            troops,
            armyList,
            magicItems: ([] as ArmyListUnitMagicItem[]),
            magicStandards: ([] as ArmyListUnitMagicStandard[]),
            options: ([] as ArmyListUnitOption[]),
            specialRuleTroops: ([] as ArmyListUnitTroopSpecialRule[]),
            equipmentTroops: ([] as ArmyListUnitTroopEquipment[])
        }));

        armyListUnit.magicItems = await Promise.all(credentials.magicItems.map(
            async (item: ArmyListUnitMagicItemDTO): Promise<ArmyListUnitMagicItem> => await this.armyListUnitMagicItemService.save(
                await this.armyListUnitMagicItemService.create(armyListUnit, item)
        )));
        armyListUnit.magicStandards = await Promise.all(credentials.magicStandards.map(
            async (standard: ArmyListUnitMagicStandardDTO): Promise<ArmyListUnitMagicStandard> => await this.armyListUnitMagicStandardService.save(
                await this.armyListUnitMagicStandardService.create(armyListUnit, standard)
            )
        ));
        armyListUnit.options = await Promise.all(credentials.options.map(
            async (option: ArmyListUnitOptionDTO): Promise<ArmyListUnitOption> => await this.armyListUnitOptionService.save(
                await this.armyListUnitOptionService.create(armyListUnit, option)
        )));
        armyListUnit.specialRuleTroops = await Promise.all(credentials.specialRuleTroops.map(
            async (rule: ArmyListUnitTroopSpecialRuleDTO): Promise<ArmyListUnitTroopSpecialRule> => await this.armyListUnitTroopSpecialRuleService.save(
                await this.armyListUnitTroopSpecialRuleService.create(armyListUnit, rule)
        )));
        armyListUnit.equipmentTroops = await Promise.all(credentials.equipmentTroops.map(
            async (equipment: ArmyListUnitTroopEquipmentDTO): Promise<ArmyListUnitTroopEquipment> => await this.armyListUnitTroopEquipmentService.save(
                await this.armyListUnitTroopEquipmentService.create(armyListUnit, equipment)
            )
        ));
        return this.repository.save(armyListUnit);
    }

    async save(unit: ArmyListUnit): Promise<ArmyListUnit> {
        return this.repository.save(unit);
    }

    async addOption(unit: ArmyListUnit, option: ArmyListUnitOptionType): Promise<void> {
        await this.repository.createQueryBuilder().relation(ArmyListUnit, this._getRelation(option)).of(unit).add(option);
    }

    async findByArmyList(listId: string, options?: ArmyListUnitServiceOptions): Promise<ArmyListUnit[]> {
        return this.repository.find({
            where: { armyList: { id: listId }},
            relations: {
                unit: (options?.loadAll === true || options?.loadUnit === true),
                magicItems: (   options?.loadAll === true || options?.loadMagicItems === true),
                magicStandards: (options?.loadAll === true || options?.loadMagicStandards === true),
                options: (options?.loadAll === true || options?.loadOptions === true),
                specialRuleTroops: (options?.loadAll === true || options?.loadSpecialRules === true),
                equipmentTroops: (options?.loadAll === true || options?.loadEquipment === true),
                troops: (options?.loadAll === true || options?.loadTroops === true)
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
