import { UnitCharacteristic } from "@army/unit/unit.entity";
import { TroopCharacteristics } from "@army/unit/troop/troop.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { EquipmentUnitTroop } from "@army/unit/troop/equipment/equipment-unit-troop.entity";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";
import { SpecialRuleUnitTroop } from "@army/unit/troop/special-rule/special-rule-unit-troop.entity";
import UnitOptionService from "@army/unit/option/unit-option.service";
import MagicItemService from "@army/magic-item/magic-item.service";
import EquipmentUnitTroopService from "@army/unit/troop/equipment/equipment-unit-troop.service";
import MagicStandardService from "@army/magic-standard/magic-standard.service";
import SpecialRuleUnitTroopService from "@army/unit/troop/special-rule/special-rule-unit-troop.service";

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

    constructor(stats: ProphecyModelStatsMathsDTO, modifiers: string[], nb_rows: number, nb_cols: number, nb_models: number) {
        this.stats = stats;
        this.modifiers = modifiers;
        this.nb_rows = nb_rows;
        this.nb_cols = nb_cols;
        this.nb_models = nb_models;
    }

    public static async create(unit: ArmyListUnit): Promise<ProphecyModelMathsDTO> {
        let pos: number = unit.formation.indexOf("x");
        let modifiers: string[] = await this._convertArmyListUnitsModifiers(unit);

        return new ProphecyModelMathsDTO(
            new ProphecyModelStatsMathsDTO(unit.unit.characteristics, unit.troops[0]?.characteristics),
            modifiers,
            +unit.formation.substring(pos + 1),
            +unit.formation.substring(0, pos),
            unit.quantity
        );
    }

    public stats: ProphecyModelStatsMathsDTO;
    public modifiers: string[];
    public nb_rows: number;
    public nb_cols: number;
    public nb_models: number;

    private static readonly optionService: UnitOptionService;
    private static readonly magicItemService: MagicItemService;
    private static readonly equipmentTroopService: EquipmentUnitTroopService;
    private static readonly magicStandardService: MagicStandardService;
    private static readonly specialRuleUnitTroopService: SpecialRuleUnitTroopService;

    private static async _convertArmyListUnitsModifiers(unit: ArmyListUnit): Promise<string[]> {
        let arr: string[] = [];

        console.log(unit);

        for (const o of unit.options)
            arr.push(await this.optionService.findOneById(o.optionId).then((res: UnitOption) => res.name));
        for (const i of unit.magicItems) {
            console.log(i.magicItemId);
            arr.push(await this.magicItemService.findOneById(i.magicItemId).then((res: MagicItem) => res.name));

        }
        for (const e of unit.equipmentTroops)
            arr.push(await this.equipmentTroopService.findOneById(e.equipmentId).then((res: EquipmentUnitTroop) => res.name));
        for (const m of unit.magicStandards)
            arr.push(await this.magicStandardService.findOneById(m.magicStandardId).then((res: MagicStandard) => res.name));
        for (const r of unit.specialRuleTroops)
            arr.push(await this.specialRuleUnitTroopService.findOneById(r.ruleId).then((res: SpecialRuleUnitTroop) => res.name));
        return arr;
    }
}
