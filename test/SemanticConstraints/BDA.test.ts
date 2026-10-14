import { describe, expect, it } from 'vitest';

import { BDA_BDAType_allowedWhen_Enum, BDA_RefersToDATypeorEnumType } from '../../src/SemanticConstraints/BDA';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('BDA', () => {
    describe('BDA_BDAType_allowedWhen_Enum', () => {
        it('should return no issues when BDA has bType=Struct with type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <LNodeType lnClass="LLN0">
                            <DO name="Do1" type="MyType"/>
                        </LNodeType>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <BDA bType="Struct" type="ValidType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when BDA has bType=Enum with type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <LNodeType lnClass="LLN0">
                            <DO name="Do1" type="MyType"/>
                        </LNodeType>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <BDA bType="Enum" type="ValidEnum"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when BDA has bType=Struct without type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <LNodeType lnClass="LLN0">
                            <DO name="Do1" type="MyType"/>
                        </LNodeType>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <BDA bType="Struct"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when BDA has bType=Enum without type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <LNodeType lnClass="LLN0">
                            <DO name="Do1" type="MyType"/>
                        </LNodeType>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <BDA bType="Enum"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should report BDA with type attribute but bType is not Struct or Enum', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <LNodeType lnClass="LLN0">
                            <DO name="Do1" type="MyType"/>
                        </LNodeType>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <BDA bType="INT32" type="InvalidType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'BDA_BDAType_allowedWhen_Enum',
                filename: DOC_NAME,
                message: 'BDA.type is allowed only if bType = Struct or Enum',
            });
            expect(issues[0].element.tagName).toBe('BDA');
        });

        it('should report BDA with bType=BOOLEAN and type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <LNodeType lnClass="LLN0">
                            <DO name="Do1" type="MyType"/>
                        </LNodeType>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <BDA bType="BOOLEAN" type="SomeType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('BDA_BDAType_allowedWhen_Enum');
        });
    });

    describe('BDA_RefersToDATypeorEnumType', () => {
        it('should return no issues when BDA with bType=Struct refers to existing DAType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="ValidType">
                            <BDA name="bda1" bType="INT32"/>
                        </DAType>
                        <DAType id="ReferencingType">
                            <BDA name="test" bType="Struct" type="ValidType"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when BDA with bType=Enum refers to existing EnumType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <EnumType id="ValidEnum">
                            <EnumVal ord="0"/>
                        </EnumType>
                        <DAType id="ReferencingType">
                            <BDA name="test" bType="Enum" type="ValidEnum"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when BDA with bType=INT32 has no type', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="ReferencingType">
                            <BDA name="test" bType="INT32"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(BDA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should report BDA with bType=Struct referring to missing DAType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="ReferencingType">
                            <BDA name="test" bType="Struct" type="MissingType"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = BDA_RefersToDATypeorEnumType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'BDA_RefersToDATypeorEnumType',
                filename: DOC_NAME,
                message: /BDA \(name=test\) does not refer an existing DAType or EnumType/,
            });
            expect(issues[0].element.tagName).toBe('BDA');
        });

        it('should report BDA with bType=Enum referring to missing EnumType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="ReferencingType">
                            <BDA name="test" bType="Enum" type="MissingEnum"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = BDA_RefersToDATypeorEnumType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('BDA_RefersToDATypeorEnumType');
        });

        it('should report BDA with bType=Struct referring to EnumType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <EnumType id="SomeEnum">
                            <EnumVal ord="0"/>
                        </EnumType>
                        <DAType id="ReferencingType">
                            <BDA name="test" bType="Struct" type="SomeEnum"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = BDA_RefersToDATypeorEnumType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('BDA_RefersToDATypeorEnumType');
        });
    });
});
