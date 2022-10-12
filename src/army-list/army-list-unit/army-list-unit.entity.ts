import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "../../army/unit/unit.entity";
import { Option } from "../../army/option/option.entity";
import { Upgrade } from "../../army/upgrade/upgrade.entity";

@Entity("army_list_units")
export class ArmyListUnit {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "units", referencedColumnName: "id" })
    public unit: Unit;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "options", referencedColumnName: "id" })
    public options: Option[]

    @Column({ type: "varchar" })
    @JoinColumn({ name: "upgrades", referencedColumnName: "id" })
    public upgrades: Upgrade[]
}
