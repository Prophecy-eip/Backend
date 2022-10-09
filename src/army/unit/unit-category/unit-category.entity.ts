import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Army} from "../../army.entity";

@Entity("unit_categories")
export class UnitCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    public limits: string;

    @Column({name: "target_id"})
    public targetId: string;
}
