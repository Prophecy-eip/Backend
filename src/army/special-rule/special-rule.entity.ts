import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("special_rules")
export class SpecialRule {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "type_lvl" })
    public typeLvl: string;
}
