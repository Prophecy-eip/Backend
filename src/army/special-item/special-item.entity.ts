import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("special_items")
export class SpecialItem {
    @PrimaryColumn()
    public id: string

    @Column()
    public name: string;

    @Column({ name: "is_collective"})
    public isCollective: boolean;

    @Column()
    public type: string;

    @Column()
    public limits: string;

    @Column()
    public cost: string;

    @Column()
    public category: string;
}