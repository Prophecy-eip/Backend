import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Unit } from "@army/unit/unit.entity";
import { Repository } from "typeorm";
import { TroopService } from "@army/unit/troop/troop.service";
import SpecialRuleUnitTroopService from "@army/unit/troop/special-rule/special-rule-unit-troop.service";
import EquipmentUnitTroopService from "@army/unit/troop/equipment/equipment-unit-troop.service";
import UnitOptionService from "@army/unit/option/unit-option.service";

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private readonly unitRepository: Repository<Unit>,
        private readonly troopService: TroopService,
        private readonly ruleService: SpecialRuleUnitTroopService,
        private readonly equipmentService: EquipmentUnitTroopService,
        private readonly optionService: UnitOptionService
    ) {}

    async findOneById(id: number): Promise<Unit> { // TODO: add options
        const unit: Unit = await this.unitRepository.findOneBy([{ id: id }]);

        if (unit !== null && unit !== undefined) {
            unit.troops = await this.troopService.findByIds(unit.troopIds);
            unit.specialRuleUnitTroops = await this.ruleService.findByIds(unit.specialRuleUnitTroopIds);
            unit.equipmentUnitTroops = await this.equipmentService.findByIds(unit.equipmentUnitTroopIds);
            unit.unitOptions = await this.optionService.findByIds(unit.unitOptionIds);
        }
        return unit;
    }
}
