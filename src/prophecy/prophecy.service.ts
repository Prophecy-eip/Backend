import { Injectable } from "@nestjs/common";
import UnitOptionService from "@army/unit/option/unit-option.service";
import MagicItemService from "@army/magic-item/magic-item.service";
import EquipmentUnitTroopService from "@army/unit/troop/equipment/equipment-unit-troop.service";
import MagicStandardService from "@army/magic-standard/magic-standard.service";
import SpecialRuleUnitTroopService from "@army/unit/troop/special-rule/special-rule-unit-troop.service";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";

@Injectable()
class ProphecyService {
    constructor(
        private readonly optionService: UnitOptionService,
        private readonly magicItemService: MagicItemService,
        private readonly equipmentTroopService: EquipmentUnitTroopService,
        private readonly magicStandardService: MagicStandardService,
        private readonly specialRuleUnitTroopService: SpecialRuleUnitTroopService
    ) {}

    async convertArmyListUnitsModifiers(unit: ArmyListUnit): Promise<string[]> {
        console.log(unit);

        return await Promise.all(unit.options.map(async (o: ArmyListUnitOption): Promise<string> =>
                await this.optionService.findOneById(o.option.id).then((res: UnitOption) => res.name)
            )
        );
    }
}

export default ProphecyService;
