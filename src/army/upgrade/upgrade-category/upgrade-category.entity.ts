import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("upgrade_categories")
export class UpgradeCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ name: "is_collective"})
    public isCollective: boolean;

    @Column()
    public limits: string

    @Column({ type: "varchar"})
    public army: string
}
