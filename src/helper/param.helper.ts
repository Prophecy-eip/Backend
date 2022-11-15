export class ParamHelper {
    static isValid(param: any): boolean {
        return !(param === null || param === undefined);
    }
}
