import { Column, Entity, JoinColumn, PrimaryColumn, OneToOne } from "typeorm";

import { Army } from "../army.entity";

@Entity("organisations")
export class Organisation {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public limit: string;

    @OneToOne((type) => Army)
    @JoinColumn({ name: "army_id", referencedColumnName: "id" })
    public army: Army
}