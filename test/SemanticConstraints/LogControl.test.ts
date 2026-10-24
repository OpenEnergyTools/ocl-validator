import { describe, expect, it } from 'vitest';

import {
    LogControl_datSet_valid_reference,
    LogControl_RefersToLog,
} from '../../src/SemanticConstraints/LogControl';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

// Helper to create minimal SCL with IED structure
function sclWithIED(iedContent: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            ${iedContent}
        </SCL>`;
}

// Helper to create IED with Server and LDevice
function iedWithLDevice(lDeviceContent: string, iedName = 'IED1'): string {
    return `
<IED name="${iedName}">
    <AccessPoint name="AP1">
        <Server>
            ${lDeviceContent}
        </Server>
    </AccessPoint>
</IED>`;
}

// Helper to create LDevice with LN0 content
function lDeviceWithLN0(ln0Content: string, ldInst = 'LD1'): string {
    return `
<LDevice inst="${ldInst}">
    <LN0 lnClass="LLN0" inst="">
        ${ln0Content}
    </LN0>
</LDevice>`;
}

// Helper to create LDevice with LN content
function lDeviceWithLN(lnContent: string, ldInst = 'LD1', lnClass = 'MMXU', prefix = '', lnInst = '1'): string {
    return `
<LDevice inst="${ldInst}">
    <LN lnClass="${lnClass}" inst="${lnInst}" prefix="${prefix}">
        ${lnContent}
    </LN>
</LDevice>`;
}

// Helper to create LDevice with multiple LNs
function lDeviceWithMultipleLNs(lNContents: Array<{ content: string, lnClass?: string, prefix: string | null, lnInst: string | null }>): string {
    const lns = lNContents.map(({ content, lnClass = 'MMXU', prefix, lnInst }) =>
        `<LN lnClass="${lnClass}" ${lnInst ? `inst="${lnInst}"` : ''} ${prefix ? `prefix="${prefix}"` : ''}>${content}</LN>`
    ).join('\n');
    return `
<LDevice inst="LD1">
    <LN0 lnClass="LLN0" inst=""/>
    ${lns}
</LDevice>`;
}

describe('LogControl', () => {
    describe('LogControl_datSet_valid_reference', () => {
        it('should return no issues when LogControl datSet references existing DataSet in same LN0', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <DataSet name="DS1"/>
                        <LogControl name="LC1" datSet="DS1"/>`)
                )
            ));
            expect(LogControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LogControl has no datSet attribute', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0('<LogControl name="LC1"/>')
                )
            ));
            expect(LogControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LogControl datSet references existing DataSet in same LN', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN(`
                        <DataSet name="DS1"/>
                        <LogControl name="LC1" datSet="DS1"/>
                    `)
                )
            ));
            expect(LogControl_datSet_valid_reference(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when LogControl datSet references non-existing DataSet in LN0', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0('<DataSet name="DS1"/><LogControl name="LC1" datSet="NON_EXISTENT"/>')
                )
            ));
            const issues = LogControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LogControl_datSet_valid_reference',
                filename: DOC_NAME,
                message: 'datSet attribute shall reference a valid DataSet in LLN0 in GSEControl',
            });
            expect(issues[0].element?.getAttribute('name')).toBe('LC1');
        });

        it('should report issue when LogControl datSet references non-existing DataSet in LN', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN(`
                        <DataSet name="DS1"/>
                        <LogControl name="LC1" datSet="NON_EXISTENT"/>`)
                )
            ));
            const issues = LogControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.getAttribute('name')).toBe('LC1');
        });

        it('should report multiple issues for multiple LogControls with invalid datSet', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <LogControl name="LC1" datSet="DS1"/>
                        <LogControl name="LC2" datSet="DS2"/>`)
                )
            ));
            const issues = LogControl_datSet_valid_reference(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.map(i => i.element?.getAttribute('name'))).toContain('LC1');
            expect(issues.map(i => i.element?.getAttribute('name'))).toContain('LC2');
        });
    });

    describe('LogControl_RefersToLog', () => {
        it('should return no issues when Log exists in same LDevice and LN with matching prefix and lnInst', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <LogControl name="LC1" logName="EventLog"/>
                        <Log name="EventLog"/>
                    `)
                )
            ));
            expect(LogControl_RefersToLog(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when Log exists in same LN (not LN0) with matching attributes', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN(`
                        <Log name="EventLog"/>
                        <LogControl name="LC1" logName="EventLog"/>`)
                )
            ));
            expect(LogControl_RefersToLog(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when Log exists in different LN in same LDevice with matching lnClass prefix and lnInst', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithMultipleLNs([
                        { content: '<Log name="EventLog"/>', lnClass: 'MMXU', prefix: null, lnInst: '1' },
                        { content: '<LogControl name="LC1" prefix="" lnClass="MMXU" lnInst="1" logName="EventLog"/>', lnClass: 'GGIO', prefix: '', lnInst: '1' }
                    ])
                )
            ));
            expect(LogControl_RefersToLog(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when lnInst is empty string on LogControl and Log', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <Log name="EventLog"/>
                        <LogControl name="LC1" lnClass="LLN0" logName="EventLog"/>`)
                )
            ));
            expect(LogControl_RefersToLog(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when lnInst is null (not set) on LogControl', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <Log name="EventLog" inst=""/>
                        <LogControl name="LC1" lnClass="LLN0" logName="EventLog"/>`)
                )
            ));
            expect(LogControl_RefersToLog(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when Log does not exist in same LDevice', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0('<LogControl name="LC1" ldInst="" prefix="" lnClass="LLN0" logName="NON_EXISTENT"/>')
                )
            ));
            const issues = LogControl_RefersToLog(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LogControl_RefersToLog',
                filename: DOC_NAME,
                message: 'LogControl does not refer an existing Log',
            });
            expect(issues[0].element?.getAttribute('name')).toBe('LC1');
        });

        it('should report issue when Log exists but prefix does not match', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <Log name="EventLog" prefix="PREF1"/>
                        <LogControl name="LC1" prefix="PREF2" lnClass="LLN0" logName="EventLog"/>`)
                )
            ));
            const issues = LogControl_RefersToLog(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.getAttribute('name')).toBe('LC1');
        });

        it('should report issue when Log exists but lnInst does not match', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0(`
                        <Log name="EventLog"/>
                        <LogControl name="LC1" lnInst="2" lnClass="LLN0" logName="EventLog"/>`)
                )
            ));
            const issues = LogControl_RefersToLog(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.getAttribute('name')).toBe('LC1');
        });

        it('should report issue when Log exists in different LDevice', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithLN0('<Log name="EventLog"/>') +
                    '<LDevice inst="LD2">\n' +
                    '    <LN0 lnClass="LLN0" inst="">\n' +
                    '        <LogControl name="LC1" ldInst="LD1" lnClass="LLN0" logName="EventLog"/>\n' +
                    '    </LN0>\n' +
                    '</LDevice>'
                )
            ));
            console.log(new XMLSerializer().serializeToString(doc));
            expect(LogControl_RefersToLog(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when Log exists but in wrong lnClass', () => {
            const doc = parseXMLString(sclWithIED(
                iedWithLDevice(
                    lDeviceWithMultipleLNs([
                        { content: '<Log name="EventLog"/>', lnClass: 'MMXU', prefix: '', lnInst: '1' },
                        { content: '<LogControl name="LC1" ldInst="LD1" lnClass="GGIO" lnInst="1" logName="EventLog"/>', lnClass: 'GGIO', prefix: '', lnInst: '1' }
                    ])
                )
            ));
            const issues = LogControl_RefersToLog(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.getAttribute('name')).toBe('LC1');
        });
    });
});
