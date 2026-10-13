import { describe, expect, it } from 'vitest';

import { AbstractConductingEquipment_unique_name_of_SubEquipment } from '../../src/SemanticConstraints/AbstractConductingEquipment';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithConductingEquipment(ceContent: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Substation name="Sub1">
                <VoltageLevel name="VL1">
                    <Bay name="Bay1">
                        <ConductingEquipment name="CE1" type="CBR">
                            ${ceContent}
                        </ConductingEquipment>
                    </Bay>
                </VoltageLevel>
            </Substation>
        </SCL>`;
}

function sclWithTransformerWinding(twContent: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Substation name="Sub1">
                <VoltageLevel name="VL1">
                    <PowerTransformer name="PT1">
                        <TransformerWinding name="TW1" type="PTW">
                            ${twContent}
                        </TransformerWinding>
                    </PowerTransformer>
                </VoltageLevel>
            </Substation>
        </SCL>`;
}

describe('AbstractConductingEquipment', () => {
    describe('AbstractConductingEquipment_unique_name_of_SubEquipment', () => {
        it('should return no issues when SubEquipment names are unique', () => {
            const doc = parseXMLString(sclWithConductingEquipment(
                '<SubEquipment name="SE1"/><SubEquipment name="SE2"/>'
            ));
            expect(AbstractConductingEquipment_unique_name_of_SubEquipment(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when two SubEquipments share a name in ConductingEquipment', () => {
            const doc = parseXMLString(sclWithConductingEquipment(
                '<SubEquipment name="SE1"/><SubEquipment name="SE1"/>'
            ));
            const issues = AbstractConductingEquipment_unique_name_of_SubEquipment(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AbstractConductingEquipment_unique_name_of_SubEquipment',
                filename: DOC_NAME,
                message: 'Unique child name of SubEquipment in AbstractConductingEquipment',
            });
            expect(issues[0].element.tagName).toBe('ConductingEquipment');
        });

        it('should return an issue when two SubEquipments share a name in TransformerWinding', () => {
            const doc = parseXMLString(sclWithTransformerWinding(
                '<SubEquipment name="SE1"/><SubEquipment name="SE1"/>'
            ));
            const issues = AbstractConductingEquipment_unique_name_of_SubEquipment(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('TransformerWinding');
        });

        it('should return one issue per faulty equipment', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="CE1" type="CBR">
                                    <SubEquipment name="SE1"/><SubEquipment name="SE1"/>
                                </ConductingEquipment>
                                <ConductingEquipment name="CE2" type="DIS">
                                    <SubEquipment name="SE2"/><SubEquipment name="SE2"/>
                                </ConductingEquipment>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(AbstractConductingEquipment_unique_name_of_SubEquipment(doc, DOC_NAME)).toHaveLength(2);
        });
    });
});
