import { Injectable } from "@nestjs/common";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import UnitOptionService from "@army/unit/option/unit-option.service";
import MagicItemService from "@army/magic-item/magic-item.service";
import EquipmentUnitTroopService from "@army/unit/troop/equipment/equipment-unit-troop.service";
import MagicStandardService from "@army/magic-standard/magic-standard.service";

import SpecialRuleUnitTroopService from "@army/unit/troop/special-rule/special-rule-unit-troop.service";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { EquipmentUnitTroop } from "@army/unit/troop/equipment/equipment-unit-troop.entity";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";
import { SpecialRuleUnitTroop } from "@army/unit/troop/special-rule/special-rule-unit-troop.entity";
import ProphecyArmyService from "@prophecy/army/prophecy-army.service";

const WEBSITE_URL = process.env.WEBSITE_URL;
const _MATHS_UNITS_REQUEST_URL: string = `${WEBSITE_URL}/maths/units`;
const MATHS_ARMIES_REQUEST_URL: string = `${WEBSITE_URL}/maths/armies`;
const MATHS_KEY: string = process.env.MATHS_KEY;

type ProphecyArmyUnitMathRequestDTO = {
    name: string;
    modifiers: string[];
}

type ProphecyArmyMathRequestDTO = {
    key: string;
    first_player: ProphecyArmyUnitMathRequestDTO[];
    second_player: ProphecyArmyUnitMathRequestDTO[];
}

export type ProphecyArmyMathResponseDTO = {
    first_player_score: number;
    second_player_score: number;
}

@Injectable()
class ProphecyService {

    constructor(
        private readonly optionService: UnitOptionService,
        private readonly magicItemService: MagicItemService,
        private readonly equipmentTroopService: EquipmentUnitTroopService,
        private readonly magicStandardService: MagicStandardService,
        private readonly specialRuleUnitTroopService: SpecialRuleUnitTroopService,
        private readonly prophecyArmyService: ProphecyArmyService
    ) {}

    public async requestArmiesProphecy(armyList1Units: ArmyListUnit[], armyList2Units: ArmyListUnit[]): Promise<ProphecyArmyMathResponseDTO> {
        const player1Modifiers: string[] =  await this._convertArmyListUnitsModifiers(armyList1Units);
        const player2Modifiers: string[] =  await this._convertArmyListUnitsModifiers(armyList2Units);
        let request: ProphecyArmyMathRequestDTO = {
            key: MATHS_KEY,
            first_player: armyList1Units.map((unit: ArmyListUnit) => ({
                name: unit.unit.name,
                modifiers: player1Modifiers
            })),
            second_player: armyList2Units.map((unit: ArmyListUnit) => ({
                name: unit.unit.name,
                modifiers: player2Modifiers
            }))
        };
        const content: string = JSON.stringify(request);
        const response: Response = await fetch(MATHS_ARMIES_REQUEST_URL, {
            method: "POST",
            body: content,
            headers: {"Content-Type": "application/json"}
        });
        // TODO: check math response code
        return (await response.json()) as ProphecyArmyMathResponseDTO;
    }

    private async _convertArmyListUnitsModifiers(armyListUnits: ArmyListUnit[]): Promise<string[]> {
        let arr: string[] = [];

        for (const unit of armyListUnits) {
            for (const o of unit.options)
                arr.push(await this.optionService.findOneById(o.optionId).then((res: UnitOption) => res.name));
            for (const i of unit.magicItems)
                arr.push(await this.magicItemService.findOneById(i.magicItemId).then((res: MagicItem) => res.name));
            for (const e of unit.equipmentTroops)
                arr.push(await this.equipmentTroopService.findOneById(e.equipmentId).then((res: EquipmentUnitTroop) => res.name));
            for (const m of unit.magicStandards)
                arr.push(await this.magicStandardService.findOneById(m.magicStandardId).then((res: MagicStandard) => res.name));
            for (const r of unit.specialRuleTroops)
                arr.push(await this.specialRuleUnitTroopService.findOneById(r.ruleId).then((res: SpecialRuleUnitTroop) => res.name));
        }
        return arr;
    }
}

export default ProphecyService;
