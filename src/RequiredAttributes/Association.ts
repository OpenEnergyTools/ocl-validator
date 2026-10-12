import { LN_CLASS_ENUM, validSclPrefix } from '../Helpers/Enums';
import { ValidationIssue } from '../ValidationIssue';

// Rule: association_kind_required
export function association_kind_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => !association.getAttribute('kind'))
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_kind_required',
            filename: docName,
            message: 'kind attribute shall be present in Association',
            element: association,
        }));
}

// Rule: association_associationID_valid
export function association_associationID_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const associationID = association.getAttribute('associationID');
            return associationID !== null && !isValidSclAssociationID(associationID);
        })
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_associationID_valid',
            filename: docName,
            message: 'associationID attribute shall be valid in Association',
            element: association,
        }));
}

// Rule: association_prefix_valid
export function association_prefix_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const prefix = association.getAttribute('prefix');
            return prefix !== null && !validSclPrefix(prefix);
        })
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_prefix_valid',
            filename: docName,
            message: 'prefix attribute shall be valid in Association',
            element: association,
        }));
}

// Rule: association_lnClass_required
export function association_lnClass_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => !association.getAttribute('lnClass'))
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_lnClass_required',
            filename: docName,
            message: 'lnClass attribute shall be present in Association',
            element: association,
        }));
}

// Rule: association_lnClass_valid
export function association_lnClass_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const lnClass = association.getAttribute('lnClass');
            return lnClass !== null && !isValidSclLNClass(lnClass);
        })
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_lnClass_valid',
            filename: docName,
            message: 'lnClass attribute shall be valid in Association',
            element: association,
        }));
}

// Rule: association_lnInst_required
export function association_lnInst_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => !association.getAttribute('lnInst'))
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_lnInst_required',
            filename: docName,
            message: 'lnInst attribute shall be present in Association',
            element: association,
        }));
}

// Rule: association_lnInst_valid
export function association_lnInst_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const lnInst = association.getAttribute('lnInst');
            return lnInst !== null && !isValidSclLNInstOrEmpty(lnInst);
        })
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_lnInst_valid',
            filename: docName,
            message: 'lnInst attribute shall be valid in Association',
            element: association,
        }));
}

// Rule: association_iedName_required
export function association_iedName_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => !association.getAttribute('iedName'))
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_iedName_required',
            filename: docName,
            message: 'iedName attribute shall be present in Association',
            element: association,
        }));
}

// Rule: association_iedName_valid
export function association_iedName_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const iedName = association.getAttribute('iedName');
            return iedName !== null && !isValidSclIEDName(iedName);
        })
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_iedName_valid',
            filename: docName,
            message: 'iedName attribute shall be valid in Association',
            element: association,
        }));
}

// Rule: association_ldInst_required
export function association_ldInst_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => !association.getAttribute('ldInst'))
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_ldInst_required',
            filename: docName,
            message: 'ldInst attribute shall be present in Association',
            element: association,
        }));
}

// Rule: association_ldInst_valid
export function association_ldInst_valid(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const ldInst = association.getAttribute('ldInst');
            return ldInst !== null && !isValidSclLDInst(ldInst);
        })
        .map((association) => ({
            severity: 'ERROR',
            id: 'Association_ldInst_valid',
            filename: docName,
            message: 'ldInst attribute shall be valid in Association',
            element: association,
        }));
}

function isValidSclAssociationID(id: string): boolean {
    return id.length >= 1 && id.length <= 128;
}

function isValidSclLNClass(lnClass: string): boolean {
    // OCL: validSclLNClassEnum(s) = validSclPredefinedLNClassEnum(s) OR validSclExtensionLNClassEnum(s)
    // Predefined: check against LN_CLASS_ENUM
    // Extension: exactly 4 uppercase letters
    return LN_CLASS_ENUM.has(lnClass) || /^[A-Z]{4}$/.test(lnClass);
}

function isValidSclLNInstOrEmpty(lnInst: string): boolean {
    return lnInst.length === 0 || /^[a-zA-Z0-9_]+$/.test(lnInst);
}

function isValidSclIEDName(iedName: string): boolean {
    return /^[\x20-\x7E]+$/.test(iedName) && iedName.length >= 1 && iedName.length <= 129;
}

function isValidSclLDInst(ldInst: string): boolean {
    return /^[A-Za-z0-9][0-9A-Za-z_]{0,63}$/.test(ldInst);
}
