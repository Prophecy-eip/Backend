import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column({ name: "category_id" })
    public categoryId: number;

    @Column()
    public source: string;
}
