import { describe, expect, it } from 'vitest';

import { lNodeContainer_unique_LNode_combination } from '../../src/SemanticConstraints/LNodeContainer';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithSubstation(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Substation name="Sub1">
                ${content}
            </Substation>
        </SCL>`;
}

function sclWithBay(content: string): string {
    return sclWithSubstation(`<VoltageLevel name="VL1">
        <Bay name="Bay1">
            ${content}
        </Bay>
    </VoltageLevel>`);
}

function sclWithLine(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Line name="Line1">
                ${content}
            </Line>
        </SCL>`;
}

function sclWithProcess(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Process name="Proc1">
                ${content}
            </Process>
        </SCL>`;
}

describe('LNodeContainer', () => {
    describe('lNodeContainer_unique_LNode_combination', () => {
        it('should return no issues when all LNode combinations are unique in Substation', () => {
            const doc = parseXMLString(sclWithSubstation(`
                <LNode iedName="IED1" ldInst="1" lnClass="LLN0" />
                <LNode iedName="IED1" ldInst="2" lnClass="LLN0" lnInst=""/>
            `));
            expect(lNodeContainer_unique_LNode_combination(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when all LNode combinations are unique in Bay', () => {
            const doc = parseXMLString(sclWithBay(`
                <LNode iedName="IED1" ldInst="1" lnClass="LLN0" lnInst=""/>
                <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="1" prefix="P"/>
                <LNode iedName="IED2" ldInst="1" lnClass="MMXU" lnInst="1" prefix="P"/>
            `));
            expect(lNodeContainer_unique_LNode_combination(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate LNode combination with same iedName="None"', () => {
            const doc = parseXMLString(sclWithSubstation(`
                <LNode iedName="None" ldInst="1" lnClass="LLN0" lnInst=""/>
                <LNode iedName="None" ldInst="1" lnClass="LLN0" />
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNodeContainer_unique_LNode_combination',
                filename: DOC_NAME,
                message: 'LNode in LNodeContainer shall have different combination of { lnInst, lnClass, iedName, ldInst, prefix }',
            });
            expect(issues[0].element?.tagName).toBe('Substation');
        });

        it('should report duplicate LNode combination with same attributes', () => {
            const doc = parseXMLString(sclWithBay(`
                <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="1" prefix=""/>
                <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="1" />
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.tagName).toBe('Bay');
        });

        it('should handle iedName="None" as valid value', () => {
            const doc = parseXMLString(sclWithSubstation(`
                <LNode iedName="None" ldInst="1" lnClass="LLN0" lnInst="" prefix=""/>
                <LNode iedName="IED1" ldInst="2" lnClass="LLN0" lnInst="" prefix=""/>
            `));
            expect(lNodeContainer_unique_LNode_combination(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate when only lnClass differs but others are same including iedName="None"', () => {
            const doc = parseXMLString(sclWithSubstation(`
                <LNode iedName="None" ldInst="1" lnClass="LLN0" lnInst="" prefix=""/>
                <LNode iedName="None" ldInst="1" lnClass="LLN0" lnInst="" prefix=""/>
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should check multiple containers independently', () => {
            const doc = parseXMLString(sclWithSubstation(`
                <VoltageLevel name="VL1">
                    <Bay name="Bay1">
                        <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="1" prefix=""/>
                        <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="1" prefix=""/>
                    </Bay>
                </VoltageLevel>
                <VoltageLevel name="VL2">
                    <Bay name="Bay2">
                        <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="1" prefix=""/>
                        <LNode iedName="IED2" ldInst="1" lnClass="MMXU" lnInst="1" prefix=""/>
                    </Bay>
                </VoltageLevel>
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.tagName).toBe('Bay');
            expect((issues[0].element as Element).getAttribute('name')).toBe('Bay1');
        });

        it('should work with Line container', () => {
            const doc = parseXMLString(sclWithLine(`
                <LNode iedName="IED1" ldInst="1" lnClass="PTOC" lnInst="1" prefix=""/>
                <LNode iedName="IED1" ldInst="1" lnClass="PTOC" lnInst="1" prefix=""/>
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.tagName).toBe('Line');
        });

        it('should work with Process container', () => {
            const doc = parseXMLString(sclWithProcess(`
                <LNode iedName="IED1" ldInst="1" lnClass="PTOC" lnInst="1" />
                <LNode iedName="IED1" ldInst="1" lnClass="PTOC" lnInst="1" prefix=""/>
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.tagName).toBe('Process');
        });

        it('should handle ConnectivityNode as LNodeContainer', () => {
            const doc = parseXMLString(sclWithBay(`
                <ConnectivityNode name="CN1" pathName="Sub1/VL1/Bay1/CN1">
                    <LNode iedName="None" lnClass="LLN0" lnInst="" prefix=""/>
                    <LNode iedName="None" lnClass="LLN0" lnInst="" prefix=""/>
                </ConnectivityNode>
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.tagName).toBe('ConnectivityNode');
        });

        it('should handle ConductingEquipment as LNodeContainer', () => {
            const doc = parseXMLString(sclWithBay(`
                <ConductingEquipment name="QA1" type="CBR">
                    <LNode iedName="None" lnClass="CSWI" lnInst="1" prefix="M"/>
                    <LNode iedName="None" lnClass="CSWI" lnInst="1" prefix="M"/>
                </ConductingEquipment>
            `));
            const issues = lNodeContainer_unique_LNode_combination(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.tagName).toBe('ConductingEquipment');
        });

        it('should return no issues when LNode attributes differ in all combinations', () => {
            const doc = parseXMLString(sclWithSubstation(`
                <LNode iedName="None" lnClass="LLN0" lnInst="" prefix=""/>
                <LNode iedName="None" lnClass="LLN0" lnInst="" prefix=""/>
                <LNode iedName="IED1" ldInst="1" lnClass="MMXU" lnInst="" prefix=""/>
                <LNode iedName="IED2" ldInst="1" lnClass="PTOC" lnInst="1" prefix=""/>
                <LNode iedName="IED3" ldInst="1" lnClass="PTOC" lnInst="2" prefix="P1"/>
            `));
            expect(lNodeContainer_unique_LNode_combination(doc, DOC_NAME)).toEqual([]);
        });
    });
});
