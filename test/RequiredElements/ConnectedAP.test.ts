import { describe, expect, it } from 'vitest';

import {
    connectedAP_at_most_one_PhysConnTypeRedConn_required,
    connectedAP_at_most_one_PhysConnTypeConnection_required
} from '../../src/RequiredElements/ConnectedAP';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(connectedAPInner: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Communication>
                <SubNetwork name="SN1">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        ${connectedAPInner}
                    </ConnectedAP>
                </SubNetwork>
            </Communication>
        </SCL>`;
}

describe('ConnectedAP', () => {
    describe('connectedAP_at_most_one_PhysConnTypeRedConn_required', () => {
        it('should return no issues with one RedConn PhysConn', () => {
            const doc = parseXMLString(sclXml('<PhysConn type="RedConn"/>'));
            expect(connectedAP_at_most_one_PhysConnTypeRedConn_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues with no PhysConn', () => {
            const doc = parseXMLString(sclXml(''));
            expect(connectedAP_at_most_one_PhysConnTypeRedConn_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue with two RedConn PhysConn', () => {
            const doc = parseXMLString(sclXml(
                '<PhysConn type="RedConn"/><PhysConn type="RedConn"/>'
            ));
            const issues = connectedAP_at_most_one_PhysConnTypeRedConn_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ConnectedAP_at_most_one_PhysConnTypeRedConn_required',
                filename: DOC_NAME,
                message: 'Only one PhysConn type RedConn is allowed in ConnectedAP',
            });
            expect(issues[0].element.tagName).toBe('ConnectedAP');
        });

        it('should return no issues with two non-RedConn PhysConn', () => {
            const doc = parseXMLString(sclXml(
                '<PhysConn type="Connection"/><PhysConn type="Connection"/>'
            ));
            expect(connectedAP_at_most_one_PhysConnTypeRedConn_required(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('ConnectedAP_at_most_one_PhysConnTypeConnection_required', () => {
        it('should return no issues with one RedConn and one Connection', () => {
            const doc = parseXMLString(sclXml(
                '<PhysConn type="RedConn"/><PhysConn type="Connection"/>'
            ));
            expect(connectedAP_at_most_one_PhysConnTypeConnection_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue with one RedConn and two Connections', () => {
            const doc = parseXMLString(sclXml(
                '<PhysConn type="RedConn"/><PhysConn type="Connection"/><PhysConn type="Connection"/>'
            ));
            const issues = connectedAP_at_most_one_PhysConnTypeConnection_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ConnectedAP_at_most_one_PhysConnTypeConnection_required',
                filename: DOC_NAME,
                message: 'Only one PhysConn type Connection is allowed when there is one PhysConn type RedConn in ConnectedAP',
            });
        });

        it('should return no issues with two Connections but no RedConn (rule does not apply)', () => {
            const doc = parseXMLString(sclXml(
                '<PhysConn type="Connection"/><PhysConn type="Connection"/>'
            ));
            expect(connectedAP_at_most_one_PhysConnTypeConnection_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
