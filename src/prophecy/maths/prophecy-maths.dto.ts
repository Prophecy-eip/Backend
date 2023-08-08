import { UnitCharacteristic } from "@army/unit/unit.entity";
import { TroopCharacteristics } from "@army/unit/troop/troop.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import {
    ArmyListUnitMagicStandard
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import {
    ArmyListUnitTroopEquipment
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";

export class ProphecyModelStatsMathsDTO {
    constructor(unitCharacteristics: UnitCharacteristic, troopCharacteristics: TroopCharacteristics | undefined) {
        this.advance = this._parseValue(unitCharacteristics.adv);
        this.march = this._parseValue(unitCharacteristics.mar);
        this.discipline = this._parseValue(unitCharacteristics.dis);
        this.health_points = this._parseValue(unitCharacteristics.hp);
        this.defense = this._parseValue(unitCharacteristics.def);
        this.resilience = this._parseValue(unitCharacteristics.res);
        this.armour = this._parseValue(unitCharacteristics.arm);
        this.aegis = this._parseValue(unitCharacteristics.aeg);
        this.attack = this._parseValue(troopCharacteristics?.att);
        this.offensive = this._parseValue(troopCharacteristics?.of);
        this.strength = this._parseValue(troopCharacteristics?.str);
        this.armour_penetration = this._parseValue(troopCharacteristics?.ap);
        this.agility = this._parseValue(troopCharacteristics?.agi);
    }

    private _parseValue(value: any): number {
        if (value === null || value === undefined) {
            return 0;
        }
        if (typeof value === "string") {
            const str: string = value as string;
            let val: number = 0;

            for (const c of str) {
                if (c >= "0" && c <= "9") {
                    val = val * 10 + (+c);
                }
            }
            return val;
        }
        return +value;
    }

    public advance: number;
    public march: number;
    public discipline: number;
    public health_points: number;
    public defense: number;
    public resilience: number;
    public armour: number;
    public aegis: number;
    public attack: number;
    public offensive: number;
    public strength: number;
    public armour_penetration: number;
    public agility: number;
}

export class ProphecyModelMathsDTO {

    constructor(unit: ArmyListUnit) {
        let pos: number = unit.formation.indexOf("x");

        this.stats = new ProphecyModelStatsMathsDTO(unit.unit.characteristics, unit.troops[0]?.characteristics);
        this.modifiers = this._convertArmyListUnitsModifiers(unit);
        this.nb_rows = +unit.formation.substring(pos + 1);
        this.nb_cols = +unit.formation.substring(0, pos);
        this.nb_models = unit.quantity;
    }

    public stats: ProphecyModelStatsMathsDTO;
    public modifiers: string[];
    public nb_rows: number;
    public nb_cols: number;
    public nb_models: number;

    private _convertArmyListUnitsModifiers(unit: ArmyListUnit): string[] {
        return unit.options.map((o: ArmyListUnitOption): string => o.option?.name)
            .concat(unit.magicItems.map((i: ArmyListUnitMagicItem): string => i.magicItem?.name))
            .concat(unit.magicStandards.map((s: ArmyListUnitMagicStandard): string => s.magicStandard?.name))
            .concat(unit.equipmentTroops.map((e: ArmyListUnitTroopEquipment): string => e.equipment?.name))
            .concat(unit.specialRuleTroops.map((r: ArmyListUnitTroopSpecialRule): string => r.rule?.name));
    }
}
