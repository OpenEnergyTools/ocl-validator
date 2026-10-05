import { describe, expect, it } from 'vitest';

import {
    sampledValueControl_one_SmvOpts_required,
    sampledValueControl_multicast
} from '../../src/RequiredElements/SampledValueControl';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(svcAttrs: string, svcInner: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="LLN0" inst="">
                                <SampledValueControl name="SVC1" smvID="MSV1" ${svcAttrs}>
                                    ${svcInner}
                                </SampledValueControl>
                            </LN0>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('SampledValueControl', () => {
    describe('sampledValueControl_one_SmvOpts_required', () => {
        it('should return no issues when SampledValueControl has a SmvOpts', () => {
            const doc = parseXMLString(sclXml('multicast="true"', '<SmvOpts/>'));
            expect(sampledValueControl_one_SmvOpts_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when SampledValueControl has no SmvOpts', () => {
            const doc = parseXMLString(sclXml('multicast="true"', ''));
            const issues = sampledValueControl_one_SmvOpts_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'sampledValueControl_one_SmvOpts_required',
                filename: DOC_NAME,
                message: 'SampledValueControl shall contain a SmvOpts',
            });
            expect(issues[0].element.tagName).toBe('SampledValueControl');
        });
    });

    describe('sampledValueControl_multicast', () => {
        it('should return no issues when multicast is true with multiple IEDName', () => {
            const doc = parseXMLString(sclXml(
                'multicast="true"',
                '<IEDName>IED2</IEDName><IEDName>IED3</IEDName><SmvOpts/>'
            ));
            expect(sampledValueControl_multicast(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when multicast is false with one IEDName', () => {
            const doc = parseXMLString(sclXml(
                'multicast="false"',
                '<IEDName>IED2</IEDName><SmvOpts/>'
            ));
            expect(sampledValueControl_multicast(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when multicast is false with two IEDName', () => {
            const doc = parseXMLString(sclXml(
                'multicast="false"',
                '<IEDName>IED2</IEDName><IEDName>IED3</IEDName><SmvOpts/>'
            ));
            const issues = sampledValueControl_multicast(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'sampledValueControl_multicast',
                filename: DOC_NAME,
                message: 'If Multicast is FALSE, a maximum of one client IED shall be assigned to the SampledValueControl',
            });
        });

        it('should return no issues when multicast is absent', () => {
            const doc = parseXMLString(sclXml('', '<SmvOpts/>'));
            expect(sampledValueControl_multicast(doc, DOC_NAME)).toEqual([]);
        });
    });
});
