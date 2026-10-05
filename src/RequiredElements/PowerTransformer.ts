import { ValidationIssue } from '../ValidationIssue';

// Rule: PowerTransformer_at_least_one_TransformerWinding_required
export function powerTransformer_at_least_one_TransformerWinding_required(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('PowerTransformer'))
        .filter((powerTransformer) => powerTransformer.querySelectorAll('TransformerWinding').length === 0)
        .map((powerTransformer) => ({
            severity: 'ERROR',
            id: 'PowerTransformer_at_least_one_TransformerWinding_required',
            filename: docName,
            message: 'PowerTransformer shall contain at least one TransformerWinding',
            element: powerTransformer,
        }));
}
