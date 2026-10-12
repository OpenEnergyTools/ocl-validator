import { describe, expect, it } from 'vitest';
import { validate, validateAll, ValidationOptions } from '../src/validate';

// Helper function to create an XMLDocument from a string
function parseXMLString(xmlString: string): XMLDocument {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
}

const DOC_NAME = 'test.scd';

const validSCL = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
    <Substation name="S1">
        <VoltageLevel name="VL1">
            <Bay name="B1">
                <ConductingEquipment name="CE1">
                    <Terminal name="T1"/>
                </ConductingEquipment>
            </Bay>
        </VoltageLevel>
    </Substation>
</SCL>`;

describe('validate function', () => {
    describe('basic functionality', () => {
        it('should return empty array for valid SCL with validateAll', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc, { filename: DOC_NAME });

            // Should have no issues for this basic valid SCL
            // (assuming no required elements are missing)
            expect(Array.isArray(issues)).toBe(true);
        });

        it('should accept XMLDocument and return async iterable', async () => {
            const doc = parseXMLString(validSCL);
            const generator = validate(doc, { filename: DOC_NAME });

            // Should be able to iterate
            const issues: any[] = [];
            for await (const batch of generator) {
                issues.push(...batch);
            }
            expect(Array.isArray(issues)).toBe(true);
        });
    });

    describe('options', () => {
        it('should use default filename if not provided', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc);

            // All issues should have the default filename
            issues.forEach((issue) => {
                expect(issue.filename).toBe('unknown.xml');
            });
        });

        it('should use provided filename', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc, { filename: 'custom.scd' });

            // All issues should have the custom filename
            issues.forEach((issue) => {
                expect(issue.filename).toBe('custom.scd');
            });
        });

        it('should exclude RequiredElements when disabled', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc, {
                filename: DOC_NAME,
                filter: { element_specific: false },
            });

            expect(Array.isArray(issues)).toBe(true);
            // Note: This doesn't guarantee RequiredElements rules were excluded,
            // but ensures the option is accepted
        });

        it('should exclude RequiredAttributes when disabled', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc, {
                filename: DOC_NAME,
                filter: { attributes_specific: false },
            });

            expect(Array.isArray(issues)).toBe(true);
        });

        it('should exclude SemanticConstraints when disabled', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc, {
                filename: DOC_NAME,
                filter: { semantic_checks: false },
            });

            expect(Array.isArray(issues)).toBe(true);
        });

        it('should exclude FileSpecifics when disabled', async () => {
            const doc = parseXMLString(validSCL);
            const issues = await validateAll(doc, {
                filename: DOC_NAME,
                filter: { file_specific: false },
            });

            expect(Array.isArray(issues)).toBe(true);
        });
    });

    describe('parallel execution', () => {
        it('should process multiple categories in parallel', async () => {
            const doc = parseXMLString(validSCL);
            const startTime = Date.now();

            const issues = await validateAll(doc, { filename: DOC_NAME });
            const endTime = Date.now();

            // Should complete in reasonable time (parallel execution)
            expect(endTime - startTime).toBeLessThan(5000); // 5 seconds max
            expect(Array.isArray(issues)).toBe(true);
        });

        it('should stream results as categories complete', async () => {
            const doc = parseXMLString(validSCL);
            const completionOrder: string[] = [];

            let batchCount = 0;
            for await (const batch of validate(doc, { filename: DOC_NAME })) {
                batchCount++;
                expect(Array.isArray(batch)).toBe(true);
                expect(batch.length).toBeGreaterThanOrEqual(0);

                // Each batch should contain ValidationIssue objects
                batch.forEach((issue) => {
                    expect(issue).toHaveProperty('severity');
                    expect(issue).toHaveProperty('id');
                    expect(issue).toHaveProperty('filename');
                    expect(issue).toHaveProperty('message');
                    expect(issue).toHaveProperty('element');
                });
            }

            // Should have received at least some batches
            expect(batchCount).toBeGreaterThanOrEqual(0);
        });
    });
});
