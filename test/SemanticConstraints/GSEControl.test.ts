import { describe, expect, it } from 'vitest';

import { GSEControl_datSet_valid_reference } from '../../src/SemanticConstraints/GSEControl';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

const VALID_IED_WITH_DATASET = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS1">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITHOUT_DATASET = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS1">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_WRONG_DATASET_NAME = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="WRONG_NAME">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITHOUT_DATSET_ATTRIBUTE = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_MULTIPLE_GSECONTROLS = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <DataSet name="DS2">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="2" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS1">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                    <GSEControl name="GC2" type="GOOSE" confRev="1" datSet="DS2">
                        <GSE cbName="GC2" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_MIXED_VALID_AND_INVALID = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS1">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                    <GSEControl name="GC2" type="GOOSE" confRev="1" datSet="INVALID_DS">
                        <GSE cbName="GC2" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_EMPTY_DATSET_ATTRIBUTE = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const MULTIPLE_IEDS_WITH_GSECONTROLS = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS1">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>
<IED name="IED2">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS2">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC2" type="GOOSE" confRev="1" datSet="DS2">
                        <GSE cbName="GC2" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const MULTIPLE_IEDS_WITH_INVALID_REFERENCE = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS1">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                    <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS2">
                        <GSE cbName="GC1" type="GOOSE" />
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>
<IED name="IED2">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <DataSet name="DS2">
                        <FCDA ldInst="LD1" prefix="" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                    </DataSet>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

describe('GSEControl', () => {
    describe('GSEControl_datSet_valid_reference', () => {
        it('should return no issues when GSEControl references existing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${VALID_IED_WITH_DATASET}
                </SCL>`);
            expect(GSEControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when GSEControl has no datSet attribute', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITHOUT_DATSET_ATTRIBUTE}
                </SCL>`);
            expect(GSEControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should report error when GSEControl references non-existing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_WRONG_DATASET_NAME}
                </SCL>`);
            const issues = GSEControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'GSEControl_datSet_valid_reference',
                filename: DOC_NAME,
                message: 'datSet attribute shall reference a valid DataSet in LLN0 in GSEControl',
            });
            expect(issues[0].element.tagName).toBe('GSEControl');
        });

        it('should report error when DataSet exists but GSEControl has no parent LN0', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITHOUT_DATASET}
                </SCL>`);
            const issues = GSEControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('GSEControl');
        });

        it('should return no issues for multiple GSEControls with valid references', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_MULTIPLE_GSECONTROLS}
                </SCL>`);
            expect(GSEControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should report multiple errors for multiple GSEControls with invalid references', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_MIXED_VALID_AND_INVALID}
                </SCL>`);
            const issues = GSEControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.getAttribute('name')).toBe('GC2');
        });

        it('should return no issues when datSet attribute is empty', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_EMPTY_DATSET_ATTRIBUTE}
                </SCL>`);
            expect(GSEControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for valid GSEControls across multiple IEDs', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${MULTIPLE_IEDS_WITH_GSECONTROLS}
                </SCL>`);
            expect(GSEControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should report error when GSEControl references DataSet in different IED', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${MULTIPLE_IEDS_WITH_INVALID_REFERENCE}
                </SCL>`);
            const issues = GSEControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.getAttribute('name')).toBe('GC1');
        });

        it('should handle GSEControl in LN (not LN0)', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN prefix="P" lnClass="PMMXU1" inst="1" lnType="PMMXU1_T1">
                                        <DataSet name="DS1">
                                            <FCDA ldInst="LD1" prefix="P" lnClass="PMMXU1" lnInst="1" doName="PhV" daName="mag.f"/>
                                        </DataSet>
                                        <GSEControl name="GC1" type="GOOSE" confRev="1" datSet="DS1">
                                            <GSE cbName="GC1" type="GOOSE" />
                                        </GSEControl>
                                    </LN>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = GSEControl_datSet_valid_reference(doc, DOC_NAME);
            // GSEControl in LN (not LN0) should still be checked, but the selector only matches LN0
            expect(issues).toHaveLength(0);
        });
    });
});
