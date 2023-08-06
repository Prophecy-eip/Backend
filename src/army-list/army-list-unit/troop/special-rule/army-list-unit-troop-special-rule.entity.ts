import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { SpecialRule } from "@army/special-rule/special-rule.entity";

@Entity("army_list_unit_troop_special_rules")
export class ArmyListUnitTroopSpecialRule {
    @PrimaryColumn()
    public id: string;

    @ManyToOne(() => ArmyListUnit, (armyListUnit: ArmyListUnit) => armyListUnit.specialRuleTroops)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;

    @Column({ name: "troop_id" })
    public troopId: number;

    @ManyToOne(() => SpecialRule)
    @JoinColumn({ name: "special_rule_id" })
    public rule: SpecialRule;
}
