import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UnitCategory } from "./unit-category.entity";

@Injectable()
export class UnitCategoryService {
    constructor(
        @InjectRepository(UnitCategory)
        private repository: Repository<UnitCategory>
    ) {}

}