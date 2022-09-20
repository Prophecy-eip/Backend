import { Column, Entity, JoinTable, PrimaryColumn } from "typeorm"


@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;
}