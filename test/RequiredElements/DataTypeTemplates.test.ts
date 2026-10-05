import { describe, expect, it } from 'vitest';

import {
    dataTypeTemplates_at_least_one_LNodeType_required,
    dataTypeTemplates_at_least_one_DOType_required
} from '../../src/RequiredElements/DataTypeTemplates';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(dtt: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            ${dtt}
        </SCL>`;
}

describe('DataTypeTemplates', () => {
    describe('dataTypeTemplates_at_least_one_LNodeType_required', () => {
        it('should return no issues when DataTypeTemplates has an LNodeType', () => {
            const doc = parseXMLString(sclXml(
                '<DataTypeTemplates><LNodeType id="T1" lnClass="LLN0"/></DataTypeTemplates>'
            ));
            expect(dataTypeTemplates_at_least_one_LNodeType_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when DataTypeTemplates has no LNodeType', () => {
            const doc = parseXMLString(sclXml(
                '<DataTypeTemplates><DOType id="D1" cdc="SPS"/></DataTypeTemplates>'
            ));
            const issues = dataTypeTemplates_at_least_one_LNodeType_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DataTypeTemplates_at_least_one_LNodeType_required',
                filename: DOC_NAME,
                message: 'DataTypeTemplates shall contain at least one LNodeType',
            });
            expect(issues[0].element.tagName).toBe('DataTypeTemplates');
        });

        it('should return no issues when there is no DataTypeTemplates element', () => {
            const doc = parseXMLString(sclXml(''));
            expect(dataTypeTemplates_at_least_one_LNodeType_required(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('dataTypeTemplates_at_least_one_DOType_required', () => {
        it('should return no issues when DataTypeTemplates has a DOType', () => {
            const doc = parseXMLString(sclXml(
                '<DataTypeTemplates><DOType id="D1" cdc="SPS"/></DataTypeTemplates>'
            ));
            expect(dataTypeTemplates_at_least_one_DOType_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when DataTypeTemplates has no DOType', () => {
            const doc = parseXMLString(sclXml(
                '<DataTypeTemplates><LNodeType id="T1" lnClass="LLN0"/></DataTypeTemplates>'
            ));
            const issues = dataTypeTemplates_at_least_one_DOType_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DataTypeTemplates_at_least_one_DOType_required',
                filename: DOC_NAME,
                message: 'DataTypeTemplates shall contain at least one DOType',
            });
            expect(issues[0].element.tagName).toBe('DataTypeTemplates');
        });

        it('should return no issues when there is no DataTypeTemplates element', () => {
            const doc = parseXMLString(sclXml(''));
            expect(dataTypeTemplates_at_least_one_DOType_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
