import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_list_unit_troop_special_rules")
export class ArmyListUnitTroopSpecialRule {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "army_list_unit_id" })
    public armyListUnitId: string;

    @Column({ name: "troop_id" })
    public troopId: number;

    @Column({ name: "special_rule_id" })
    public ruleId: number;
}
