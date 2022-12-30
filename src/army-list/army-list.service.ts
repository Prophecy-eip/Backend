import { Injectable} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyList } from "./army-list.entity";

@Injectable()
export class ArmyListService {
    constructor(
        @InjectRepository(ArmyList)
        private repository: Repository<ArmyList>
    ) {}

    async create(name: string, owner: string, armyId: number, valuePoints: number, isShared: boolean,
        isFavourite: boolean): Promise<ArmyList> {
        const id: string = randomUUID();

        return this.repository.create({ id, name, owner, armyId, valuePoints, isShared, isFavourite });
    }

    save(list: ArmyList): Promise<ArmyList> {
        return this.repository.save(list);
    }

    async findByOwner(username: string): Promise<ArmyList[]> {
        return this.repository.findBy({ owner: username });
    }

    async findOneById(id: string): Promise<ArmyList> {
        return this.repository.findOneBy({ id: id });
    }

    async findOneByOwnerAndId(username: string, id: string): Promise<ArmyList> {
        return this.repository.findOneBy([{ id: id }, { owner: username }]);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async update(id: string, name: string, armyId: number, valuePoints: number, isShared: boolean, isFavourite: boolean) {
        await this.repository.update({ id: id }, { name: name, armyId: armyId,
            valuePoints: valuePoints, isShared: isShared, isFavourite: isFavourite });
    }
}
