import { describe, expect, it } from 'vitest';

import {
    DA_unique_ProtNs_type_in_DA_from_DOType,
    DA_DAType_allowedWhen_Enum,
    DA_RefersToDATypeorEnumType,
    DA_Struct_no_valKind_or_valImport
} from '../../src/SemanticConstraints/DA';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('DA', () => {
    describe('DA_unique_ProtNs_type_in_DA_from_DOType', () => {
        it('should return no issues when ProtNs types are unique in DA from DOType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="INT32">
                                <ProtNs type="Type1"/>
                                <ProtNs type="Type2"/>
                            </DA>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_unique_ProtNs_type_in_DA_from_DOType(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate ProtNs types in DA from DOType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="INT32">
                                <ProtNs type="Type1"/>
                                <ProtNs type="Type1"/>
                            </DA>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_unique_ProtNs_type_in_DA_from_DOType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DA_unique_ProtNs_type_in_DA_from_DOType',
                filename: DOC_NAME,
                message: 'Unique ProtNs type in DA from DOType',
            });
            expect(issues[0].element.tagName).toBe('DA');
        });

        it('should return no issues when DA has no ProtNs', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="INT32"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_unique_ProtNs_type_in_DA_from_DOType(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('DA_DAType_allowedWhen_Enum', () => {
        it('should return no issues when DA has bType=Struct with type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" type="ValidType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_DAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA has bType=Enum with type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Enum" type="ValidEnum"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_DAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA has bType=Struct without type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_DAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA has bType=Enum without type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Enum"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_DAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should report DA with type attribute but bType is not Struct or Enum', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="INT32" type="InvalidType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_DAType_allowedWhen_Enum(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DA_DAType_allowedWhen_Enum',
                filename: DOC_NAME,
                message: 'DA.type is allowed only if bType = Struct or Enum',
            });
            expect(issues[0].element.tagName).toBe('DA');
        });

        it('should report DA with bType=BOOLEAN and type attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="BOOLEAN" type="SomeType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_DAType_allowedWhen_Enum(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('DA_DAType_allowedWhen_Enum');
        });
    });

    describe('DA_RefersToDATypeorEnumType', () => {
        it('should return no issues when DA with bType=Struct refers to existing DAType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" type="ValidType"/>
                        </DOType>
                        <DAType id="ValidType">
                            <BDA name="bda1" bType="INT32"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA with bType=Enum refers to existing EnumType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Enum" type="ValidEnum"/>
                        </DOType>
                        <EnumType id="ValidEnum">
                            <EnumVal ord="0"/>
                        </EnumType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA with bType=INT32 has no type', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="INT32"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should report DA with bType=Struct referring to missing DAType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" type="MissingType"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_RefersToDATypeorEnumType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DA_RefersToDATypeorEnumType',
                filename: DOC_NAME,
                message: /DA \(name=da1\) does not refer an existing DAType or EnumType/,
            });
            expect(issues[0].element.tagName).toBe('DA');
        });

        it('should report DA with bType=Enum referring to missing EnumType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Enum" type="MissingEnum"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_RefersToDATypeorEnumType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('DA_RefersToDATypeorEnumType');
        });
    });

    describe('DA_Struct_no_valKind_or_valImport', () => {
        it('should return no issues when DA with bType=Struct has no valKind or valImport', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_Struct_no_valKind_or_valImport(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA with bType=Struct has valImport=false', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" valImport="false"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_Struct_no_valKind_or_valImport(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA with bType=Struct has valKind=Set', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" valKind="Set"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_Struct_no_valKind_or_valImport(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DA with bType=INT32 has valKind and valImport', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="INT32" valKind="RO" valImport="true"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DA_Struct_no_valKind_or_valImport(doc, DOC_NAME)).toEqual([]);
        });

        it('should warn when DA with bType=Struct has valKind=RO', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" valKind="RO"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_Struct_no_valKind_or_valImport(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'WARNING',
                id: 'DA_Struct_no_valKind_or_valImport',
                filename: DOC_NAME,
                message: 'The attributes valKind and valImport make no sense for DA elements with bType = Struct',
            });
            expect(issues[0].element.tagName).toBe('DA');
        });

        it('should warn when DA with bType=Struct has valImport=true', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DOType cdcd="IEC61850:2003" id="MyType">
                            <DA name="da1" bType="Struct" valImport="true"/>
                        </DOType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DA_Struct_no_valKind_or_valImport(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('DA_Struct_no_valKind_or_valImport');
        });
    });
});
