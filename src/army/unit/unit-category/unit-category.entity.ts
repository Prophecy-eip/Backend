import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("unit_categories")
export class UnitCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    public limits: string;

    @Column({ type: "varchar"})
    public army: string;

    @Column({name: "target_id"})
    public targetId: string;
}
