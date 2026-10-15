import { describe, expect, it } from 'vitest';

import {
    DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN,
    DOI_AnyLN_LNType_reference,
    DOI_RefersToDO,
} from '../../src/SemanticConstraints/DOI';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

const DATA_TYPE_TEMPLATES = `
<DataTypeTemplates>
    <LNodeType lnClass="MMXU" id="MMXU1">
        <DO name="PhV" type="PhV_T1"/>
    </LNodeType>
    <LNodeType lnClass="PTOC" id="PTOC1">
        <DO name="StrVal" type="StrVal_T1"/>
    </LNodeType>
    <DOType id="PhV_T1">
        <DA name="mag" bType="FLOAT32"/>
        <DA name="ang" bType="FLOAT32"/>
    </DOType>
    <DOType id="StrVal_T1">
        <DA name="stVal" bType="BOOL"/>
    </DOType>
</DataTypeTemplates>`;

describe('DOI', () => {
    describe('DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN', () => {
        it('should return no issues when DAI and SDI have unique ix+name combinations', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <DOI name="Mod">
                                            <SDI ix="0" name="stVal"/>
                                            <SDI ix="1" name="q"/>
                                            <DAI ix="0" name="mag"/>
                                        </DOI>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for MMXU1 -> PhV path with unique combinations', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI name="PhV">
                                            <SDI ix="0" name="phsA"/>
                                            <SDI ix="1" name="phsB"/>
                                            <SDI ix="2" name="phsC"/>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for PTOC1 -> StrVal path with unique combinations', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="PTOC" inst="1" lnType="PTOC1">
                                        <DOI name="StrVal">
                                            <DAI ix="0" name="stVal"/>
                                            <DAI ix="1" name="q"/>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate DAI ix+name combination', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI name="PhV">
                                            <DAI ix="0" name="mag"/>
                                            <SDI ix="0" name="phsA"/>
                                            <DAI ix="0" name="mag"/>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN',
                filename: DOC_NAME,
                message: 'Unique DAI and SDI ix and name combination in DOI from AnyLN',
            });
            expect(issues[0].element.tagName).toBe('DOI');
        });

        it('should report duplicate SDI ix+name combination', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="PTOC" inst="1" lnType="PTOC1">
                                        <DOI name="StrVal">
                                            <SDI ix="0" name="stVal"/>
                                            <SDI ix="1" name="q"/>
                                            <SDI ix="0" name="stVal"/>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('DOI');
        });

        it('should report when DAI and SDI share same ix+name combination', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <DOI name="Mod">
                                            <DAI ix="0" name="stVal"/>
                                            <SDI ix="0" name="stVal"/>
                                        </DOI>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_unique_DAI_SDI_ix_name_in_DOI_from_AnyLN(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('DOI');
        });
    });

    describe('DOI_AnyLN_LNType_reference', () => {
        it('should return no issues when LN has lnType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI name="PhV"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_AnyLN_LNType_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LN0 has lnType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="" lnType="LLN0_T1">
                                        <DOI name="Mod"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_AnyLN_LNType_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for PTOC1 -> StrVal path with lnType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="PTOC" inst="1" lnType="PTOC1">
                                        <DOI name="StrVal"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_AnyLN_LNType_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should report DOI in LN without lnType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1">
                                        <DOI name="PhV"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_AnyLN_LNType_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DOI_AnyLN_LNType_reference',
                filename: DOC_NAME,
                message: 'AnyLN with DOI must refer to a LNodeType',
            });
            expect(issues[0].element.tagName).toBe('DOI');
        });

        it('should report DOI in LN0 without lnType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <DOI name="Mod"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_AnyLN_LNType_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('DOI');
        });

        it('should report multiple DOIs without lnType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1">
                                        <DOI name="PhV"/>
                                        <DOI name="StrVal"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_AnyLN_LNType_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every((issue) => issue.element.tagName === 'DOI')).toBe(true);
        });
    });

    describe('DOI_RefersToDO', () => {
        it('should return no issues when DOI refers to existing DO in MMXU1', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI name="PhV"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_RefersToDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DOI refers to existing DO in PTOC1', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="PTOC" inst="1" lnType="PTOC1">
                                        <DOI name="StrVal"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_RefersToDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DOI has no name attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_RefersToDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when no DataTypeTemplates exists', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1">
                                        <DOI name="PhV"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DOI_RefersToDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should report DOI referring to missing DO', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI name="MISSING_DO"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_RefersToDO(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DOI_RefersToDO',
                filename: DOC_NAME,
                message: 'DOI (name=MISSING_DO) does not refer an existing DO in DataTypeTemplates section',
            });
            expect(issues[0].element.tagName).toBe('DOI');
        });

        it('should report multiple DOIs referring to missing DOs', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${DATA_TYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <DOI name="Missing1"/>
                                        <DOI name="Missing2"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = DOI_RefersToDO(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every((issue) => issue.element.tagName === 'DOI')).toBe(true);
        });
    });
});
