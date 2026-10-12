import { ValidationIssue } from '../ValidationIssue';
import { LN_CLASS_ENUM } from '../Helpers/Enums';

const selectorAnyLN = [
    ':root > IED > AccessPoint > LN',
    ':root > IED > AccessPoint > Server > LDevice > LN0',
    ':root > IED > AccessPoint > Server > LDevice > LN',
];

// Rule: LN_lnClass_required
export function ln_lnClass_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selectorAnyLN.join(', ')))
        .filter((element) => !element.getAttribute('lnClass'))
        .map((element) => ({
            severity: 'ERROR',
            id: 'LN_lnClass_required',
            filename: docName,
            message: 'lnClass attribute shall be present in AnyLN',
            element: element,
        }));
}

// Rule: LN_lnClass_valid
export function ln_lnClass_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selectorAnyLN.join(', ')))
        .filter((element) => {
            const lnClass = element.getAttribute('lnClass');
            return lnClass !== null && !isValidSclLNClass(lnClass);
        })
        .map((element) => ({
            severity: 'ERROR',
            id: 'LN_lnClass_valid',
            filename: docName,
            message: 'lnClass attribute shall be valid in AnyLN',
            element: element,
        }));
}

// Rule: LN_inst_required
export function ln_inst_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selectorAnyLN.join(', ')))
        .filter((element) => element.getAttribute('inst') === null)
        .map((element) => ({
            severity: 'ERROR',
            id: 'LN_inst_required',
            filename: docName,
            message: 'inst attribute shall be present in AnyLN',
            element: element,
        }));
}

// Rule: AnyLn_lnType_required
export function anyLn_lnType_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selectorAnyLN.join(', ')))
        .filter((element) => element.getAttribute('lnType') === null)
        .map((element) => ({
            severity: 'ERROR',
            id: 'AnyLN_lnType_required',
            filename: docName,
            message: 'lnType attribute shall be present in AnyLN',
            element: element,
        }));
}

// Rule: AnyLn_lnType_valid
export function anyLn_lnType_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selectorAnyLN.join(', ')))
        .filter((element) => {
            const lnType = element.getAttribute('lnType');
            return lnType !== null && !isValidSclName(lnType);
        })
        .map((element) => ({
            severity: 'ERROR',
            id: 'AnyLN_lnType_valid',
            filename: docName,
            message: 'lnType attribute shall be valid in AnyLN',
            element: element,
        }));
}

function isValidSclLNClass(lnClass: string): boolean {
    // OCL: validSclLNClassEnum(s) = validSclPredefinedLNClassEnum(s) OR validSclExtensionLNClassEnum(s)
    // Predefined: check against LN_CLASS_ENUM
    // Extension: exactly 4 uppercase letters
    return LN_CLASS_ENUM.has(lnClass) || /^[A-Z]{4}$/.test(lnClass);
}

function isValidSclName(name: string): boolean {
    return name.length > 0 && name.length <= 128;
}
