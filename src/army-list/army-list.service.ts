import { Injectable} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitServiceOptions } from "@army-list/army-list-unit/army-list-unit.service";

export type ArmyListServiceOptions = {
    loadAll?: boolean;
    loadUnits?: boolean;
    armyListUnitOptions?: ArmyListUnitServiceOptions;
}

@Injectable()
export class ArmyListService {
    constructor(
        @InjectRepository(ArmyList)
        private repository: Repository<ArmyList>
    ) {}

    async create(name: string, owner: string, armyId: number, valuePoints: number, isShared: boolean,
        isFavorite: boolean, units: ArmyListUnit[]): Promise<ArmyList> {
        const id: string = randomUUID();

        return this.repository.create({ id, name, owner, armyId, valuePoints, isShared, isFavorite: isFavorite, units });
    }

    save(list: ArmyList): Promise<ArmyList> {
        return this.repository.save(list);
    }

    async findByOwner(username: string, options?: ArmyListServiceOptions): Promise<ArmyList[]> {
        return this.repository.find({
            where: { owner: username },
            relations: this._getRelations(options)
        });
    }

    async findOneById(id: string,  options?: ArmyListServiceOptions): Promise<ArmyList> {
        return this.repository.findOne({
            where: { id: id },
            relations: this._getRelations(options)
        });
    }

    async findOneByOwnerAndId(username: string, id: string, options?: ArmyListServiceOptions): Promise<ArmyList> {
        return this.repository.findOne({
            where: [{ id: id }, { owner: username }],
            relations: this._getRelations(options)
        });
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async update(id: string, name: string, armyId: number, valuePoints: number, isShared: boolean, isFavorite: boolean, units: ArmyListUnit[]): Promise<void> {
        await this.repository.update({ id: id }, { name: name, armyId: armyId,
            valuePoints: valuePoints, isShared: isShared, isFavorite: isFavorite});
        await this.repository.createQueryBuilder().relation(ArmyList, "units").of(id).add(units);
    }

    private _getRelations(options: ArmyListServiceOptions): string[] {
        let relations: string[] = [];

        if (options?.loadAll === true || options?.loadUnits === true)
            relations.push("units");
        if (options?.loadAll === true || options?.armyListUnitOptions?.loadUnit === true)
            relations.push("units.unit");
        if (options?.loadAll === true || options?.armyListUnitOptions?.loadMagicItems === true)
            relations.push("units.magicItems");
        if (options?.loadAll === true || options?.armyListUnitOptions?.loadMagicStandards === true)
            relations.push("units.magicStandards");
        return relations;
    }
}
