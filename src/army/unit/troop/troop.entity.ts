import { Entity, PrimaryColumn, Column } from "typeorm";

class Characteristics {
    public M: string;
    public WS: string;
    public BS: string;
    public S: string;
    public T: string;
    public W: string;
    public I: string;
    public A: string;
    public LD: string;
    public E: string;
    public type: string;
    public size: number;
    public att: string;
    public of: string;
    public str: string;
    public ap: string;
    public agi: string;
    public type_id: string;
    public type_name: string;
}

@Entity("troops")
export class Troop {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "unit_id" })
    public unit_id: number;

    @Column()
    public name: string;

    @Column({ type: "varchar"})
    public characteristics: Characteristics[];
}