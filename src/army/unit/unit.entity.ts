import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { Army } from "../army.entity";
import { Organisation } from "../organisation/organisation.entity";

@Entity("units")
export class Unit {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    // @OneToOne((type) => Army)
    // @JoinColumn({name: "army_id", referencedColumnName: "id"})
    // @Column()
    // public army: Army;
    //
    // @OneToOne((type) => Organisation)
    // @JoinColumn({name: "organisation_id", referencedColumnName: "id"})
    // @Column()
    // public organisation: Organisation
    
}