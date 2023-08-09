import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import ProphecyArmyService from "@prophecy/army/prophecy-army.service";
import { ProphecyArmyMathRequestDTO, ProphecyArmyMathResponseDTO } from "@prophecy/maths/prophecy-army-maths.dto";
import { ProphecyUnitMathsRequestDTO, ProphecyUnitMathsResponseDTO } from "@prophecy/maths/prophecy-unit-maths.dto";

const WEBSITE_URL = process.env.WEBSITE_URL;

const MATHS_UNITS_REQUEST_URL: string = `${WEBSITE_URL}/maths/units`;
const MATHS_ARMIES_REQUEST_URL: string = `${WEBSITE_URL}/maths/armies`;
const MATHS_KEY: string = process.env.MATHS_KEY;


@Injectable()
class ProphecyMathsService {

    constructor(
        private readonly prophecyArmyService: ProphecyArmyService
    ) {}

    public async requestUnitsProphecy(
        attackingRegimentUnit: ArmyListUnit,
        defendingRegimentUnit: ArmyListUnit,
        attackingPosition: string): Promise<ProphecyUnitMathsResponseDTO> {
        let request: ProphecyUnitMathsRequestDTO = new ProphecyUnitMathsRequestDTO(MATHS_KEY, attackingRegimentUnit,
            defendingRegimentUnit, attackingPosition);
        const content: string = JSON.stringify(request);
        const response: Response = await fetch(MATHS_UNITS_REQUEST_URL, {
            method: "POST",
            body: content,
            headers: {"Content-Type": "application/json"}
        });

        if (response.status === HttpStatus.BAD_REQUEST || response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
            console.error(response);
            throw new BadRequestException();
        }

        if (response.status !== HttpStatus.OK) {
            throw new Error(`Maths error: ${await response.text()}`);
        }
        return (await response.json()) as ProphecyUnitMathsResponseDTO;
    }

    public async requestArmiesProphecy(armyList1Units: ArmyListUnit[], armyList2Units: ArmyListUnit[]): Promise<ProphecyArmyMathResponseDTO> {
        let request: ProphecyArmyMathRequestDTO = new ProphecyArmyMathRequestDTO(MATHS_KEY, armyList1Units, armyList2Units);
        const content: string = JSON.stringify(request);
        const response: Response = await fetch(MATHS_ARMIES_REQUEST_URL, {
            method: "POST",
            body: content,
            headers: {"Content-Type": "application/json"}
        });

        if (response.status !== HttpStatus.OK) {
            throw new Error(`Maths error: ${await response.text()}`);
        }
        return (await response.json()) as ProphecyArmyMathResponseDTO;
    }

}

export default ProphecyMathsService;
