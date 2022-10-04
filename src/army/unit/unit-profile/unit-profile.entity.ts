import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("unit_profiles")
export class UnitProfile {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public characteristics: string;

    @Column({ name: "is_shared" })
    public isShared: boolean;

    @Column({ name: "owner_id" })
    public ownerId: string;

    @Column({ name: "owner_type" })
    public ownerType: string;
}
