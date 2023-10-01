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

    /**
     * @brief Checks if the object's required properties are not undefined or null
     * @param object The object to check
     * @param requiredProperties The properties that must not be null or undefined
     * @param objectName The name of the object
     * @return An empty array if everything is fine, an array of Error otherwise
     */
    static checkParamProperties(object: Object, requiredProperties: string[] , objectName: string): Error[] {
        return requiredProperties.map((p: string): Error[] => {
            if (!this.isValid(object[p])) {
                return [new Error(`Invalid ${p} in ${objectName} object (null or undefined)`)];
            }
            return [];
        }).flat();
    }
}
