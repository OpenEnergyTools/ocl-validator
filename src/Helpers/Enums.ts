// Enum validation helpers for SCL
// These correspond to the enum validation functions in Enums.ocl

export type SclRightEnum = 'none' | 'read-only' | 'read-write' | 'full-access';
export type SclVersion = string; // Pattern: \d+\.\d+
export type SclRevision = string; // Pattern: [A-Z]+
export type SclRelease = number; // Positive integer

// Valid IED name pattern: 1-64 alphanumeric characters, cannot be 'None'
export const IED_NAME_PATTERN = /^[a-zA-Z0-9]{1,64}$/;

// Valid LN inst pattern: alphanumeric, can contain special characters
export const LN_INST_PATTERN = /^[a-zA-Z0-9_\-]{1,64}$/;

// Valid ConductingEquipment types
export const CONDUCTING_EQUIPMENT_TYPES = new Set([
    'CBR', 'DIS', 'CTR', 'PSH', 'BSH', 'CAB', 'GIL', 'LIN', 'RES', 'SCR', 'TCF', 'TCR',
    'VTR', 'PTW', 'GEN', 'CAP', 'REA', 'CON', 'MOT', 'FAN', 'EFN', 'BAT', 'RRC', 'SAR', 'SMC', 'IFL', 'AXN'
]);

// Valid LNClass enum values
export const LN_CLASS_ENUM = new Set([
    'LLN0', 'LPHD', 'LNOD', 'TVTR', 'TCTR', 'TCLK', 'TRES', 'TWPI', 'TWPP', 
    'TPOS', 'TSPT', 'TPAS', 'TMPS', 'TAMV', 'TAMP', 'TVLV', 'TWQI', 'TWQP',
    'TFLV', 'TFLP', 'TFLQ', 'TFFQ', 'TFRQ', 'TITV', 'TITQ', 'TITP', 'TITF',
    'BB00', 'BBO1', 'BBO2', 'BBO3', 'BRCB', 'BBRB', 'DIR', 'DOP', 'DOI', 'DOC',
    'CSWI', 'XCBR', 'XSWI', 'CSWI2', 'XCBR2', 'XSWI2', 'CSWI3', 'XCBR3', 'XSWI3',
    'SGCB', 'XSGC', 'CSGR', 'XSGR', 'MXGR', 'XMXG', 'AGCS', 'XGCS', 'ACSE',
    'CSAC', 'XSAC', 'ATCC', 'XATC', 'TCTR', 'TVTR', 'DRCS', 'XDRC', 'RDRE',
    'XDRE', 'RDRS', 'XRDR', 'RREC', 'XRRC', 'CILO', 'XCIL', 'SPC', 'XSPC',
    'RSPC', 'XRPC', 'SEL', 'XSEL', 'SRGC', 'XSGC', 'SICF', 'XSIC', 'SICC',
    'XSIC2', 'SICC2', 'XSIC3', 'SICC3', 'SIMG', 'XSIM', 'SIMC', 'XSIC4', 'SICC4'
]);

// Valid SCL version pattern (e.g., "2003", "2007B")
export const SCL_VERSION_PATTERN = /^\d{4}([A-Za-z]\d{0,2})?$/;

// Valid SCL revision pattern (uppercase letters only)
export const SCL_REVISION_PATTERN = /^[A-Z]+$/;

// Valid right enum values
export const VALID_SCL_RIGHTS: SclRightEnum[] = ['none', 'read-only', 'read-write', 'full-access'];

// Validate IED name
export function validSclIEDName(name: string): boolean {
    return IED_NAME_PATTERN.test(name) && name !== 'None';
}

// Validate IED name or relative (can be empty for relative references)
export function validSclIEDNameOrRelative(name: string): boolean {
    return name.length === 0 || validSclIEDName(name);
}

// Validate SCL version
export function validSclVersion(version: string): boolean {
    return SCL_VERSION_PATTERN.test(version);
}

// Validate SCL revision
export function validSclRevision(revision: string): boolean {
    return SCL_REVISION_PATTERN.test(revision);
}

// Validate right enum
export function validSclRightEnum(right: string): boolean {
    return VALID_SCL_RIGHTS.includes(right as SclRightEnum);
}

// Validate LDevice inst
export function validSclLDInst(inst: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(inst) && inst.length >= 1 && inst.length <= 128;
}

// Validate ConductingEquipment type
export function validSclCommonConductingEquipmentEnum(type: string): boolean {
    return CONDUCTING_EQUIPMENT_TYPES.has(type);
}

// Validate LNClass
export function validSclLNClassEnum(lnClass: string): boolean {
    return LN_CLASS_ENUM.has(lnClass);
}

// Valid prefix pattern: alphanumeric and special characters
export const PREFIX_PATTERN = /^[a-zA-Z0-9_\-]{0,4}$/;

// Validate prefix
export function validSclPrefix(prefix: string): boolean {
    return PREFIX_PATTERN.test(prefix);
}

// Valid LN inst pattern for LN (different from LDevice inst)
export const LN_INST_PATTERN_SIMPLE = /^[0-9]{0,7}$/;

// Validate LN inst (different from LDevice)
export function validSclLNInst(inst: string): boolean {
    return LN_INST_PATTERN_SIMPLE.test(inst) && inst.length <= 7;
}

// Validate LN inst or empty
export function validSclLNInstOrEmpty(inst: string): boolean {
    return inst.length === 0 || validSclLNInst(inst);
}

// Valid AccessPoint name pattern
export const ACCESS_POINT_NAME_PATTERN = /^[a-zA-Z0-9]{1,32}$/;

// Validate AccessPoint name
export function validSclAccessPointName(name: string): boolean {
    return ACCESS_POINT_NAME_PATTERN.test(name);
}

// Validate full DO name (for FCDA, ExtRef, etc.)
export function validSclFullDOName(name: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name) && name.length >= 1 && name.length <= 128;
}

// Validate full attribute name (for FCDA, ExtRef, etc.)
export function validSclFullAttributeName(name: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name) && name.length >= 1 && name.length <= 128;
}

// Validate CBName (control block name)
export function validSclCBName(name: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(name) && name.length >= 1 && name.length <= 64;
}

// Validate enum string value (for EnumVal)
export function validSclEnumStringValue(value: string): boolean {
    return /^[a-zA-Z0-9_\-\.]+$/.test(value) && value.length >= 1 && value.length <= 128;
}

// Valid service type enum values
export const SERVICE_TYPES = new Set([
    'Poll', 'Report', 'GOOSE', 'SMV', 'FileTransfer', 'TimeSync', 'Log', 'GSE', 'Control'
]);

// Validate service type
export function validSclServiceType(serviceType: string): boolean {
    return SERVICE_TYPES.has(serviceType);
}

// Valid GeneralEquipment types (based on IEC 61850)
export const GENERAL_EQUIPMENT_TYPES = new Set([
    'AXN', 'BAT', 'BSH', 'CAB', 'CAP', 'CON', 'CBR', 'DIS', 'EFN', 'FAN', 'GEN', 'GIL',
    'IFL', 'LIN', 'MOT', 'PSH', 'PTW', 'REA', 'RES', 'RRC', 'SAR', 'SCR', 'SMC',
    'TCF', 'TCR', 'VTR', 'PTR', 'CTR'
]);

// Validate GeneralEquipment type
export function validSclGeneralEquipmentType(type: string): boolean {
    return GENERAL_EQUIPMENT_TYPES.has(type);
}

// Validate SCL name (for IDNaming)
export function validSclName(name: string): boolean {
    return /^[a-zA-Z0-9_\-]{1,128}$/.test(name);
}

// Validate MessageID (for GSEControl, SMVControl, etc.)
export function validSclMessageID(id: string): boolean {
    return /^[a-zA-Z0-9_\-]{1,64}$/.test(id);
}

// Validate DO name (for SDI, etc.)
export function validSclDOName(name: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name) && name.length >= 1 && name.length <= 128;
}