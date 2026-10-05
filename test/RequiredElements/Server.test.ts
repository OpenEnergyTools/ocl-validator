import { describe, expect, it } from 'vitest';

import {
    server_one_Authentication_required,
    server_at_least_one_LDevice_required
} from '../../src/RequiredElements/Server';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(serverInner: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        ${serverInner}
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('Server', () => {
    describe('server_one_Authentication_required', () => {
        it('should return no issues when Server has an Authentication', () => {
            const doc = parseXMLString(sclXml('<Authentication/>'));
            expect(server_one_Authentication_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Server has no Authentication', () => {
            const doc = parseXMLString(sclXml('<LDevice inst="LD1"/>'));
            const issues = server_one_Authentication_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Server_one_Authentication_required',
                filename: DOC_NAME,
                message: 'Server shall contain one Authentication',
            });
            expect(issues[0].element.tagName).toBe('Server');
        });
    });

    describe('server_at_least_one_LDevice_required', () => {
        it('should return no issues when Server has an LDevice', () => {
            const doc = parseXMLString(sclXml(
                '<Authentication/><LDevice inst="LD1"><LN0 lnClass="LLN0" inst=""/></LDevice>'
            ));
            expect(server_at_least_one_LDevice_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Server has no LDevice', () => {
            const doc = parseXMLString(sclXml('<Authentication/>'));
            const issues = server_at_least_one_LDevice_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Server_at_least_one_LDevice_required',
                filename: DOC_NAME,
                message: 'Server shall contain at least one LDevice',
            });
            expect(issues[0].element.tagName).toBe('Server');
        });
    });
});
