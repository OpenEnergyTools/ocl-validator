import { describe, expect, it } from 'vitest';

import { DAI_RefersToAbstractDataAttribute } from '../../src/SemanticConstraints/DAI';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

// Complete SCL with all three correct paths
const COMPLETE_DAI_DATATYPE_TEMPLATES = `
<DataTypeTemplates>
    <LNodeType lnClass="MMXU" id="PMMXU1_T1">
        <DO name="PhV" type="PhV_T1"/>
    </LNodeType>
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

    <!-- Path 2: Phase1PTCO1 -> StrVal -> mag -> f -->
    <LNodeType lnClass="PTOC" id="Phase1PTCO1_T1">
        <DO name="StrVal" type="StrVal_T1"/>
    </LNodeType>
    <DOType id="StrVal_T1">
        <DA name="mag" bType="Struct" type="mag_T2"/>
    </DOType>
    <DAType id="mag_T2">
        <BDA name="f" bType="FLOAT32"/>
    </DAType>

    <!-- Path 3: Phase1TCTR1 -> AmpSv -> instMag -> f -->
    <LNodeType lnClass="Phase1TCTR1" id="Phase1TCTR1_T1">
        <DO name="AmpSv" type="AmpSv_T1"/>
    </LNodeType>
    <DOType id="AmpSv_T1">
        <DA name="instMag" bType="Struct" type="instMag_T1"/>
    </DOType>
    <DAType id="instMag_T1">
        <BDA name="f" bType="FLOAT32"/>
    </DAType>
</DataTypeTemplates>`;

const SERVER_IED_WITH_CORRECT_DAI_PATHS = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <!-- Path 1: DAI f under PMMXU1 -->
                <LN prefix="P" lnClass="MMXU" inst="1" lnType="PMMXU1_T1">
                    <DOI name="PhV">
                        <SDI name="phsA">
                            <SDI name="cVal">
                                <SDI name="mag">
                                    <DAI name="f"/>
                                </SDI>
                            </SDI>
                        </SDI>
                    </DOI>
                </LN>
                <!-- Path 2: DAI f under Phase1PTCO1 -->
                <LN prefix="Phase1" lnClass="PTOC" inst="1" lnType="Phase1PTCO1_T1">
                    <DOI name="StrVal">
                        <SDI name="mag">
                            <DAI name="f"/>
                        </SDI>
                    </DOI>
                </LN>
                <!-- Path 3: DAI f under Phase1TCTR1 -->
                <LN prefix="Phase1" lnClass="TCTR" inst="1" lnType="Phase1TCTR1_T1">
                    <DOI name="AmpSv">
                        <SDI name="instMag">
                            <DAI name="f"/>
                        </SDI>
                    </DOI>
                </LN>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

describe('DAI', () => {
    describe('DAI_RefersToAbstractDataAttribute', () => {
        it('should return no issues for valid DAI path: PMMXU1 -> PhV -> phsA -> cVal -> mag -> f', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${COMPLETE_DAI_DATATYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="PMMXU1_T1">
                                        <DOI name="PhV">
                                            <SDI name="phsA">
                                                <SDI name="cVal">
                                                    <SDI name="mag">
                                                        <DAI name="f"/>
                                                    </SDI>
                                                </SDI>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DAI_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for valid DAI path: Phase1PTCO1 -> StrVal -> mag -> f', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${COMPLETE_DAI_DATATYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="Phase1" lnClass="PTOC" inst="1" lnType="Phase1PTCO1_T1">
                                        <DOI name="StrVal">
                                            <SDI name="mag">
                                                <DAI name="f"/>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DAI_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for valid DAI path: Phase1TCTR1 -> AmpSv -> instMag -> f', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${COMPLETE_DAI_DATATYPE_TEMPLATES}
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="Phase1" lnClass="TCTR" inst="1" lnType="Phase1TCTR1_T1">
                                        <DOI name="AmpSv">
                                            <SDI name="instMag">
                                                <DAI name="f"/>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DAI_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for all three valid DAI paths in same SCL', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${COMPLETE_DAI_DATATYPE_TEMPLATES}
                    ${SERVER_IED_WITH_CORRECT_DAI_PATHS}
                </SCL>`);
            expect(DAI_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });

        // Incorrect versions

        it('should report DAI with missing DA in DataTypeTemplates for PMMXU1 path', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="PMMXU1_T1">
                                        <DOI name="PhV">
                                            <SDI name="phsA">
                                                <SDI name="cVal">
                                                    <SDI name="mag">
                                                        <DAI name="f"/>
                                                    </SDI>
                                                </SDI>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    <DataTypeTemplates>
                        <LNodeType lnClass="MMXU" id="PMMXU1_T1">
                            <DO name="PhV" type="PhV_T1"/>
                        </LNodeType>
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
                            <BDA name="WRONG_NAME" bType="FLOAT32"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAI_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DAI_RefersToAbstractDataAttribute',
                filename: DOC_NAME,
                message: 'DAI (name=f) does not refer an existing DA in DataTypeTemplates section',
            });
            expect(issues[0].element.tagName).toBe('DAI');
        });

        it('should report DAI with broken SDI chain for Phase1PTCO1 path', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="Phase1" lnClass="PTOC" inst="1" lnType="Phase1PTCO1_T1">
                                        <DOI name="StrVal">
                                            <SDI name="mag">
                                                <DAI name="f"/>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    <DataTypeTemplates>
                        <LNodeType lnClass="PTOC" id="Phase1PTCO1_T1">
                            <DO name="StrVal" type="StrVal_T1"/>
                        </LNodeType>
                        <DOType id="StrVal_T1">
                            <DA name="WRONG_SDO" bType="Struct" type="mag_T2"/>
                        </DOType>
                        <DAType id="mag_T2">
                            <BDA name="f" bType="FLOAT32"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAI_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('DAI');
        });

        it('should report DAI with missing LNodeType for Phase1TCTR1 path', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="Phase1" lnClass="TCTR" inst="1" lnType="Phase1TCTR1_T1">
                                        <DOI name="AmpSv">
                                            <SDI name="instMag">
                                                <DAI name="f"/>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    <DataTypeTemplates>
                        <LNodeType lnClass="TCTR" id="Phase1TCTR1_T">
                            <DO name="AmpSv" type="AmpSv_T1"/>
                        </LNodeType>
                        <DOType id="AmpSv_T1">
                            <DA name="instMag" bType="Struct" type="instMag_T1"/>
                        </DOType>
                        <DAType id="instMag_T1">
                            <BDA name="f" bType="FLOAT32"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAI_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('DAI');
        });

        it('should report DAI with missing DO in LNodeType for PMMXU1 path', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="PMMXU1_T1">
                                        <DOI name="PhV">
                                            <SDI name="phsA">
                                                <SDI name="cVal">
                                                    <SDI name="mag">
                                                        <DAI name="f"/>
                                                    </SDI>
                                                </SDI>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    <DataTypeTemplates>
                        <LNodeType lnClass="MMXU" id="PMMXU1_T1">
                            <DO name="WRONG_DO" type="PhV_T1"/>
                        </LNodeType>
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
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAI_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('DAI');
        });

        it('should report all three DAI elements when DataTypeTemplates is missing', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED_WITH_CORRECT_DAI_PATHS}
                </SCL>`);
            const issues = DAI_RefersToAbstractDataAttribute(doc, DOC_NAME);
            expect(issues).toHaveLength(3);
            expect(issues.every(i => i.element.tagName === 'DAI')).toBe(true);
        });

        it('should return no issues when DAI has no name attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates/>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="MMXU" inst="1" lnType="PMMXU1_T1">
                                        <DOI name="PhV">
                                            <SDI name="phsA">
                                                <DAI/>
                                            </SDI>
                                        </DOI>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(DAI_RefersToAbstractDataAttribute(doc, DOC_NAME)).toEqual([]);
        });
    });
});
