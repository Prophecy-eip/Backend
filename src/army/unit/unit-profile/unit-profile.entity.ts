import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn } from "typeorm";
import {Unit} from "../unit.entity";

@Entity("unit_profiles")
export class UnitProfile {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public characteristics: string;

    @Column()
    public is_shared: boolean;

    @Column()
    public owner: string;
}
