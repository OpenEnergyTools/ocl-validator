import { describe, expect, it } from 'vitest';

import { FCDA_RefersToAbstractDataAttribute } from '../../src/SemanticConstraints/FCDA';

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
    <DOType id="StrVal_T1">
        <DA name="mag" bType="Struct" type="mag_T1"/>
    </DOType>
    <DOType id="PhV_T1">
        <SDO name="phsA" type="phsA_T1"/>
    </DOType>
    <DOType id="phsA_T1">
        <DA name="cVal" bType="Struct" type="cVal_T1"/>
    </DOType>
    <DAType id="cVal_T1">
        <BDA name="mag" bType="Struct" type="mag_T1"/>
    </DAType>
    <DAType id="mag_T1">
        <BDA name="f" bType="FLOAT32"/>
    </DAType>
</DataTypeTemplates>`;

describe('FCDA', () => {
    describe('FCDA_RefersToAbstractDataAttribute', () => {
        it('should return no issues when FCDA refers to existing DA in MMXU1', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="cVal.mag.f" fc="MX"/>
                                    </LN0>
                                    <LN prefix="" lnClass="MMXU" inst="1" lnType="MMXU1"/>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            expect(FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when FCDA refers to existing BDA in MMXU1', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="PhV.phsA" fc="MX"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            expect(FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when FCDA refers to existing DA in PTOC1', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="PTOC" inst="" lnType="PTOC1">
                                        <FCDA iedName="IED1" ldInst="LD1" prefix="P" lnClass="PTOC" doName="StrVal" daName="mag.f" fc="CF"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            expect(FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when no DataTypeTemplates exists', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="LLN0" lnInst="" doName="Mod" daName="stVal" fc="CF"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'FCDA_RefersToAbstractDataAttribute',
                filename: DOC_NAME,
                message: 'FCDA does not refer any existing DA or BDA in DataTypeTemplates section',
            });
            expect(issues[0].element.tagName).toBe('FCDA');
        });

        it('should report FCDA referring to missing DA', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="MISSING" fc="CF"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            const issues = FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'FCDA_RefersToAbstractDataAttribute',
                filename: DOC_NAME,
                message: 'FCDA does not refer any existing DA or BDA in DataTypeTemplates section',
            });
            expect(issues[0].element.tagName).toBe('FCDA');
        });

        it('should report FCDA referring to missing BDA', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <FCDA iedName="IED1" ldInst="LD1" prefix="P" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="cVal.mag.incorrect" fc="CF"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            const issues = FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('FCDA');
        });

        it('should report FCDA referring to missing DO', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="Missing" daName="cVal" fc="CF"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            const issues = FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('FCDA');
        });

        it('should report multiple FCDAs referring to missing DA/BDA', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="MISSING1" fc="CF"/>
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="MISSING2" fc="CF"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            const issues = FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every((issue) => issue.element.tagName === 'FCDA')).toBe(true);
        });

        it('should return no issues for valid FCDAs in both LN0 and LN', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="MMXU" inst="1" lnType="MMXU1">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="PTOC" lnInst="1" doName="StrVal" daName="mag.f" fc="CF"/>
                                    </LN0>
                                    <LN lnClass="PTOC" inst="1" lnType="PTOC1">
                                        <FCDA iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1" doName="PhV.phsA" daName="cVal.mag" fc="MX"/>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    ${DATA_TYPE_TEMPLATES}
                </SCL>`);
            expect(FCDA_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });
    });
});
