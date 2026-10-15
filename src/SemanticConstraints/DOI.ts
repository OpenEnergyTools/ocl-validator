import { findReferencedDataType, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > IED > AccessPoint > Server > LDevice > LN0 > DOI',
    ':root > IED > AccessPoint > Server > LDevice > LN > DOI',
];

// Rule: DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN
export function DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((doi) => {
            const dais = doi.querySelectorAll(':scope > DAI');
            const sdis = doi.querySelectorAll(':scope > SDI');

            const combinations = [
                ...Array.from(dais).map(
                    (dai) => `${getAttributeValue(dai, 'ix') || '0'}|${getAttributeValue(dai, 'name')}`
                ),
                ...Array.from(sdis).map(
                    (sdi) => `${getAttributeValue(sdi, 'ix') || '0'}|${getAttributeValue(sdi, 'name')}`
                ),
            ];

            const uniqueCombinations = new Set(combinations);
            return uniqueCombinations.size !== combinations.length;
        })
        .map((doi) => ({
            severity: 'ERROR',
            id: 'DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN',
            filename: docName,
            message: 'Unique DAI and SDI ix and name combination in DOI from AnyLN',
            element: doi,
        }));
}

// Rule: DOI_AnyLN_LNType_reference
export function DOI_AnyLN_LNType_reference(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((doi) => {
            const anyLN = doi.closest('LN, LN0');
            return !anyLN || !getAttributeValue(anyLN, 'lnType');
        })
        .map((doi) => ({
            severity: 'ERROR',
            id: 'DOI_AnyLN_LNType_reference',
            filename: docName,
            message: 'AnyLN with DOI must refer to a LNodeType',
            element: doi,
        }));
}

// Rule: DOI_RefersToDO
export function DOI_RefersToDO(scl: XMLDocument, docName: string): ValidationIssue[] {
    const dataTypeTemplates = scl.querySelector(':root > DataTypeTemplates');
    if (!dataTypeTemplates) return [];

    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((doi) => {
            const name = getAttributeValue(doi, 'name');
            return name && !findReferencedDataType(scl, doi);
        })
        .map((doi) => ({
            severity: 'ERROR',
            id: 'DOI_RefersToDO',
            filename: docName,
            message: `DOI (name=${getAttributeValue(doi, 'name')}) does not refer an existing DO in DataTypeTemplates section`,
            element: doi,
        }));
}
