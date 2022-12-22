import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("special_rule_unit_troops")
export class SpecialRuleUnitTroop {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "troop_id" })
    public troopId: number;

    @Column()
    public info: string;

    @Column({ name: "special_rule_id" })
    public specialRuleId: number;

    @Column({ name: "type_lvl" })
    public typeLvl: string;

    @Column()
    public name: string;
}
