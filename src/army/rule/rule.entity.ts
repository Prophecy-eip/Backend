import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("rules")
export class Rule {
    @PrimaryColumn()
    public name: string;

    @Column()
    public description: string;
}