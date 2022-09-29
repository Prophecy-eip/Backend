import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn } from "typeorm";
import {Unit} from "../unit.entity";

@Entity("units_profiles")
export class UnitProfile {
    @PrimaryColumn()
    public name: string;

    @Column()
    public data: string;

    @Column()
    public isShared: boolean;

    @OneToMany(() => Unit, (unit) => unit.profiles)
    @Column()
    public unit: Unit;


}
