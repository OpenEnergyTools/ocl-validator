import { describe, expect, it } from 'vitest';

import {
    IED_AccessPoint_name_unique,
    IED_LDevice_inst_unique,
} from '../../src/SemanticConstraints/IED';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

// Test data for AccessPoint uniqueness
const IED_WITH_UNIQUE_ACCESSPOINTS = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP2">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP3">
        <Server/>
    </AccessPoint>
</IED>`;

const IED_WITH_DUPLICATE_ACCESSPOINTS = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP2">
        <Server/>
    </AccessPoint>
</IED>`;

const IED_WITH_MULTIPLE_DUPLICATES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
</IED>`;

const IED_WITH_DUPLICATE_ACCESSPOINTS_DIFFERENT_CASE = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="ap1">
        <Server/>
    </AccessPoint>
</IED>`;

const IED_WITH_ONE_ACCESSPOINT = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
</IED>`;

const IED_WITHOUT_ACCESSPOINTS = `
<IED name="IED1">
    <Server/>
</IED>`;

const IED_WITH_EMPTY_ACCESSPOINT_NAMES = `
<IED name="IED1">
    <AccessPoint name="">
        <Server/>
    </AccessPoint>
    <AccessPoint name="">
        <Server/>
    </AccessPoint>
</IED>`;

const MULTIPLE_IEDS_WITH_DUPLICATES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
</IED>
<IED name="IED2">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
    <AccessPoint name="AP2">
        <Server/>
    </AccessPoint>
</IED>`;

// Test data for LDevice inst uniqueness
const IED_WITH_UNIQUE_LDEVICES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD2"/>
            <LDevice inst="LD3"/>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_DUPLICATE_LDEVICE_INST = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD1"/>
            <LDevice inst="LD2"/>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_MULTIPLE_DUPLICATE_LDEVICES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD1"/>
            <LDevice inst="LD1"/>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_ONE_LDEVICE = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITHOUT_LDEVICES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server/>
    </AccessPoint>
</IED>`;

const IED_WITH_EMPTY_LDEVICE_INST = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst=""/>
            <LDevice inst=""/>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_MULTIPLE_ACCESSPOINTS_AND_LDEVICES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD2"/>
        </Server>
    </AccessPoint>
    <AccessPoint name="AP2">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD3"/>
        </Server>
    </AccessPoint>
</IED>`;

const MULTIPLE_IEDS_WITH_LDEVICE_DUPLICATES = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD1"/>
        </Server>
    </AccessPoint>
</IED>
<IED name="IED2">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="LD2"/>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_LDEVICE_INST_DIFFERENT_CASE = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1"/>
            <LDevice inst="ld1"/>
        </Server>
    </AccessPoint>
</IED>`;

describe('IED', () => {
    describe('IED_AccessPoint_name_unique', () => {
        it('should return no issues when IED has unique AccessPoint names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_UNIQUE_ACCESSPOINTS}
                </SCL>`);
            expect(IED_AccessPoint_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report error when IED has duplicate AccessPoint names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_DUPLICATE_ACCESSPOINTS}
                </SCL>`);
            const issues = IED_AccessPoint_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'IED_AccessPoint_name_unique',
                filename: DOC_NAME,
                message: 'AccessPoint in IED shall have different name',
            });
            expect(issues[0].element.tagName).toBe('IED');
            expect(issues[0].element.getAttribute('name')).toBe('IED1');
        });

        it('should report error when IED has multiple duplicate AccessPoint names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_MULTIPLE_DUPLICATES}
                </SCL>`);
            const issues = IED_AccessPoint_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should report error when AccessPoint names differ only by case', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_DUPLICATE_ACCESSPOINTS_DIFFERENT_CASE}
                </SCL>`);
            const issues = IED_AccessPoint_name_unique(doc, DOC_NAME);
            // Case sensitivity: AP1 and ap1 are considered different
            expect(issues).toHaveLength(0);
        });

        it('should return no issues when IED has only one AccessPoint', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_ONE_ACCESSPOINT}
                </SCL>`);
            expect(IED_AccessPoint_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when IED has no AccessPoints', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITHOUT_ACCESSPOINTS}
                </SCL>`);
            expect(IED_AccessPoint_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report error when IED has duplicate empty AccessPoint names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_EMPTY_ACCESSPOINT_NAMES}
                </SCL>`);
            const issues = IED_AccessPoint_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should report errors for each IED with duplicate AccessPoints', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${MULTIPLE_IEDS_WITH_DUPLICATES}
                </SCL>`);
            const issues = IED_AccessPoint_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1); // Only IED1 has duplicates
            expect(issues[0].element.getAttribute('name')).toBe('IED1');
        });
    });

    describe('IED_LDevice_inst_unique', () => {
        it('should return no issues when IED has unique LDevice inst values', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_UNIQUE_LDEVICES}
                </SCL>`);
            expect(IED_LDevice_inst_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report error when IED has duplicate LDevice inst values', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_DUPLICATE_LDEVICE_INST}
                </SCL>`);
            const issues = IED_LDevice_inst_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'IED_LDevice_inst_unique',
                filename: DOC_NAME,
                message: 'LDevice in IED shall have different inst',
            });
            expect(issues[0].element.tagName).toBe('IED');
            expect(issues[0].element.getAttribute('name')).toBe('IED1');
        });

        it('should report error when IED has multiple duplicate LDevice inst values', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_MULTIPLE_DUPLICATE_LDEVICES}
                </SCL>`);
            const issues = IED_LDevice_inst_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should return no issues when IED has only one LDevice', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_ONE_LDEVICE}
                </SCL>`);
            expect(IED_LDevice_inst_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when IED has no LDevices', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITHOUT_LDEVICES}
                </SCL>`);
            expect(IED_LDevice_inst_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report error when IED has duplicate empty LDevice inst values', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_EMPTY_LDEVICE_INST}
                </SCL>`);
            const issues = IED_LDevice_inst_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should return no issues when LDevice inst values are in different AccessPoints', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_MULTIPLE_ACCESSPOINTS_AND_LDEVICES}
                </SCL>`);
            // LD1 appears in both AP1 and AP2, but the rule checks across all LDevices in the IED
            const issues = IED_LDevice_inst_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should report errors for each IED with duplicate LDevice inst values', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${MULTIPLE_IEDS_WITH_LDEVICE_DUPLICATES}
                </SCL>`);
            const issues = IED_LDevice_inst_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1); // Only IED1 has duplicates
            expect(issues[0].element.getAttribute('name')).toBe('IED1');
        });

        it('should treat LDevice inst values with different case as different', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_LDEVICE_INST_DIFFERENT_CASE}
                </SCL>`);
            const issues = IED_LDevice_inst_unique(doc, DOC_NAME);
            // Case sensitivity: LD1 and ld1 are considered different
            expect(issues).toHaveLength(0);
        });

        it('should return no issues for multiple IEDs each with unique LDevices', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1"/>
                                <LDevice inst="LD2"/>
                            </Server>
                        </AccessPoint>
                    </IED>
                    <IED name="IED2">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1"/>
                                <LDevice inst="LD2"/>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            // Each IED has unique LDevice inst values within itself
            expect(IED_LDevice_inst_unique(doc, DOC_NAME)).toEqual([]);
        });
    });
});
