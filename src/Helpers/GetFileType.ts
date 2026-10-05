// Helper to get file type from SCL document
// Corresponds to GetFileType.ocl

import { SCL_NAMESPACE } from './BaseSimpleTypes';

export enum SclFileType {
    SCD = 'SCD',  // System Configuration Description
    SSD = 'SSD',  // System Specification Description
    SED = 'SED',  // System Exchange Description
    CID = 'CID',  // Capability Description
    IID = 'IID',  // Instantiated IED Description
    ICD = 'ICD'   // IED Capability Description
}

// Determine file type based on root element attributes
export function getSclFileType(scl: XMLDocument): SclFileType | null {
    const root = scl.documentElement;
    if (!root || root.tagName !== 'SCL') {
        return null;
    }

    const version = root.getAttribute('version');
    const revision = root.getAttribute('revision');
    const release = root.getAttribute('release');

    // This is a simplified heuristic - actual determination might be more complex
    // In practice, file type is often determined by the content and purpose

    // Check for specific patterns that indicate file type
    const hasIEDs = scl.querySelector(`IED`);
    const hasSubstations = scl.querySelector(`Substation`);
    const hasDataTypeTemplates = scl.querySelector(`DataTypeTemplates`);

    // This is a placeholder - actual logic would be more sophisticated
    if (hasSubstations && hasIEDs && hasDataTypeTemplates) {
        return SclFileType.SCD; // System Configuration Description
    }
    if (hasSubstations && !hasIEDs) {
        return SclFileType.SSD; // System Specification Description
    }
    if (!hasSubstations && hasIEDs && hasDataTypeTemplates) {
        return SclFileType.ICD; // IED Capability Description
    }
    if (!hasSubstations && hasIEDs && !hasDataTypeTemplates) {
        return SclFileType.IID; // Instantiated IED Description
    }
    if (hasSubstations && hasIEDs && !hasDataTypeTemplates) {
        return SclFileType.SED; // System Exchange Description
    }
    if (!hasSubstations && !hasIEDs && hasDataTypeTemplates) {
        return SclFileType.CID; // Capability Description
    }

    return null; // Could not determine
}

// Check if SCL is in SSD file
export function isInSSDFile(scl: XMLDocument): boolean {
    return getSclFileType(scl) === SclFileType.SSD;
}

// Check if SCL is in ICD file
export function isInICDFile(scl: XMLDocument): boolean {
    return getSclFileType(scl) === SclFileType.ICD;
}

// Check if SCL is in IID file
export function isInIIDFile(scl: XMLDocument): boolean {
    return getSclFileType(scl) === SclFileType.IID;
}

// Check if SCL is in SED file
export function isInSEDFile(scl: XMLDocument): boolean {
    return getSclFileType(scl) === SclFileType.SED;
}

// Check if SCL is in SCD file
export function isInSCDFile(scl: XMLDocument): boolean {
    return getSclFileType(scl) === SclFileType.SCD;
}

// Check if SCL is in CID file
export function isInCIDFile(scl: XMLDocument): boolean {
    return getSclFileType(scl) === SclFileType.CID;
}
