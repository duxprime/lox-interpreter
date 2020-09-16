export type LiteralValue = string | number | boolean | null;

export function isNumber(value:unknown):value is number{
    return typeof value === 'number';
}

export function isString(value:unknown):value is string {
    return typeof value === 'string';
}

/**
 * Coerce an object to a boolean value to determine its 'truthiness.'
 * 
 * The JavaScript values `null` and `undefined` are considered falsey,
 * while boolean values are taken as-is. All other values
 * are considered truthy.
 */
export function coerceTruthiness(obj:unknown):boolean{
    if(obj === null || typeof obj === 'undefined'){
        return false;
    }
    
    if(typeof obj === 'boolean'){
        return obj;
    }

    if(isNumber(obj) && obj === 0){
        return false;
    }

    return true;
}

export function isEqual(a:LiteralValue, b:LiteralValue){
    if(a === null && b === null){
        return true;
    }
    if(a === NaN && b === NaN){
        return true;
    }
    if(typeof a === typeof b && a === b){
        return true;
    }

    return false;
}