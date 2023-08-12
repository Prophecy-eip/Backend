/**
 * @class ParamHelper
 * @brief Defines common functions for parameters management
 */

export class ParamHelper {
    /**
     * @brief Checks if a parameter is nether null or undefined
     * @param param The parameter to check
     */
    static isValid(param: any): boolean {
        return !(param === null || param === undefined);
    }
}
