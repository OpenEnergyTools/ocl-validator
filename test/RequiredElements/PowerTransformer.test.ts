import { describe, expect, it } from 'vitest';

import { powerTransformer_at_least_one_TransformerWinding_required } from '../../src/RequiredElements/PowerTransformer';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(powerTransformers: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Substation name="S1">
                <VoltageLevel name="VL1">
                    <Bay name="B1">
                        ${powerTransformers}
                    </Bay>
                </VoltageLevel>
            </Substation>
        </SCL>`;
}

describe('PowerTransformer', () => {
    describe('powerTransformer_at_least_one_TransformerWinding_required', () => {
        it('should return no issues when PowerTransformer has a TransformerWinding', () => {
            const doc = parseXMLString(sclXml(
                '<PowerTransformer name="PT1" type="PTR"><TransformerWinding name="W1" type="PTW"/></PowerTransformer>'
            ));
            expect(powerTransformer_at_least_one_TransformerWinding_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when PowerTransformer has no TransformerWinding', () => {
            const doc = parseXMLString(sclXml('<PowerTransformer name="PT1" type="PTR"/>'));
            const issues = powerTransformer_at_least_one_TransformerWinding_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'PowerTransformer_at_least_one_TransformerWinding_required',
                filename: DOC_NAME,
                message: 'PowerTransformer shall contain at least one TransformerWinding',
            });
            expect(issues[0].element.getAttribute('name')).toBe('PT1');
        });

        it('should return no issues when there is no PowerTransformer', () => {
            const doc = parseXMLString(sclXml(''));
            expect(powerTransformer_at_least_one_TransformerWinding_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
