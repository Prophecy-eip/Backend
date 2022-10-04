import {Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn, ManyToOne} from "typeorm";

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