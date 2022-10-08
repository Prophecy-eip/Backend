import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Option } from "./option.entity"

@Injectable()
export class OptionService {
    constructor(
        @InjectRepository(Option)
        private repository: Repository<Option>
    ) {}

    async findFromIds(ids: string[]): Promise<Option[]> {
        let options: Option[] = []

        console.log(ids);
        for (const id of ids) {
            console.log(id);
            const o = await this.repository.findOneBy([{id: id}]);
            console.log(o);
            options.push(await this.repository.findOneBy([{id: id}]))
        }
        return options;
    }
}