import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("magic_standards")
export class MagicStandard {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column({ name: "army_id" })
    public armyId: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column()
    public infos: string;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @Column()
    public max: number;

    @Column({ type: "varchar", array: true })
    public availabilities: string[];
}
