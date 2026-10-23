import { describe, expect, it } from 'vitest';

import {
    lNode_iedName_consistency,
    LNode_ldInst_consistency,
    LNode_lnClass_consistency,
    LNode_prefix_consistency,
    LNode_lnInst_consistency,
    LNode_lnType_consistencyDO,
    LNode_lnType_consistencyDA,
} from '../../src/SemanticConstraints/LNode';

const DOC_NAME = 'test.scd';

const missingDo = `
    <DataTypeTemplates>
        <LNodeType id="LLN0_LNodeType" lnClass="LLN0">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_LLN0_DOType"/>
        </LNodeType>
        <LNodeType id="LLN0_LNodeType_anyLn" lnClass="LLN0">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_LLN0_DOType"/>
        </LNodeType>
        <LNodeType id="LLN0_LNodeType_anyLn1" lnClass="LLN0">
            <DO name="Mod" type="Mod_DOType1"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_LLN0_DOType"/>
        </LNodeType>
        <LNodeType id="LLN0_LNodeType_anyLn2" lnClass="LLN0">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType1"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_LLN0_DOType"/>
        </LNodeType>
        <LNodeType id="MMXU_LNodeType" lnClass="MMXU">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_DOType"/>
            <DO name="TotW" type="TotW_DOType"/>
            <DO name="TotVAr" type="TotVAr_DOType"/>
            <DO name="TotVA" type="TotVA_DOType"/>
            <DO name="TotPF" type="TotPF_DOType"/>
            <DO name="Hz" type="Hz_DOType"/>
            <DO name="PhV" type="PhV_DOType"/>
            <DO name="A" type="A_DOType"/>
            <DO name="W" type="W_PhV_DOType"/>
        </LNodeType>
        <LNodeType id="MMXU_LNodeType_anyLn" lnClass="MMXU">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_DOType"/>
            <DO name="TotW" type="TotW_DOType"/>
            <DO name="TotVAr" type="TotVAr_DOType"/>
            <DO name="TotVA" type="TotVA_DOType"/>
            <DO name="TotPF" type="TotPF_DOType"/>
            <DO name="Hz" type="Hz_DOType"/>
            <DO name="PhV" type="PhV_DOType"/>
            <DO name="A" type="A_DOType"/>
            <DO name="W" type="W_PhV_DOType"/>
        </LNodeType>
        <LNodeType id="MMXU_LNodeType_anyLn2" lnClass="MMXU">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_DOType"/>
            <DO name="TotVAr" type="TotVAr_DOType"/>
            <DO name="TotVA" type="TotVA_DOType"/>
            <DO name="PhV" type="PhV_DOType"/>
            <DO name="A" type="A_DOType"/>
            <DO name="W" type="W_PhV_DOType"/>
        </LNodeType>
        <LNodeType id="MMXU_LNodeType_anyLn3" lnClass="MMXU">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_DOType"/>
            <DO name="TotW" type="TotW_DOType"/>
            <DO name="TotVAr" type="TotVAr_DOType"/>
            <DO name="TotVA" type="TotVA_DOType"/>
            <DO name="TotPF" type="TotPF_DOType"/>
            <DO name="Hz" type="Hz_DOType"/>
            <DO name="PhV" type="PhV_DOType"/>
            <DO name="A" type="A_DOType1"/>
            <DO name="W" type="W_PhV_DOType"/>
        </LNodeType>
        <LNodeType id="MMXU_LNodeType_anyLn4" lnClass="MMXU">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_DOType"/>
            <DO name="TotW" type="TotW_DOType"/>
            <DO name="TotVAr" type="TotVAr_DOType"/>
            <DO name="TotVA" type="TotVA_DOType"/>
            <DO name="TotPF" type="TotPF_DOType"/>
            <DO name="Hz" type="Hz_DOType"/>
            <DO name="PhV" type="PhV_DOType1"/>
            <DO name="A" type="A_DOType"/>
            <DO name="W" type="W_PhV_DOType"/>
        </LNodeType>
        <LNodeType id="MMXU_LNodeType_anyLn5" lnClass="MMXU">
            <DO name="Mod" type="Mod_DOType"/>
            <DO name="Beh" type="Beh_DOType"/>
            <DO name="Health" type="Health_DOType"/>
            <DO name="NamPlt" type="NamPlt_DOType"/>
            <DO name="TotW" type="TotW_DOType"/>
            <DO name="TotVAr" type="TotVAr_DOType"/>
            <DO name="TotVA" type="TotVA_DOType"/>
            <DO name="TotPF" type="TotPF_DOType"/>
            <DO name="Hz" type="Hz_DOType"/>
            <DO name="PhV" type="PhV_DOType"/>
            <DO name="A" type="A_DOType2"/>
            <DO name="W" type="W_PhV_DOType"/>
        </LNodeType>
        <DOType id="Mod_DOType" cdc="ENC">
            <DA name="stVal" bType="Enum" type="Mod_STEnum" fc="ST"/>
            <DA name="q" bType="Quality" fc="ST"/>
            <DA name="t" bType="Timestamp" fc="ST"/>
            <DA name="ctlModel" bType="Enum" type="Mod_CtlModelEnum" fc="CF"/>
        </DOType>
        <DOType id="Mod_DOType1" cdc="ENC">
            <DA name="stVal" bType="Enum" type="Mod_STEnum1" fc="ST"/>
            <DA name="q" bType="Quality" fc="ST"/>
            <DA name="t" bType="Timestamp" fc="ST"/>
            <DA name="ctlModel" bType="Enum" type="Mod_CtlModelEnum" fc="CF"/>
        </DOType>
        <DOType id="Beh_DOType" cdc="ENS">
            <DA name="stVal" bType="Enum" type="Beh_STEnum" fc="ST"/>
            <DA name="q" bType="Quality" fc="ST"/>
            <DA name="t" bType="Timestamp" fc="ST"/>
        </DOType>
        <DOType id="Beh_DOType1" cdc="ENS">
            <DA name="stVal" bType="BOOLEAN" fc="ST"/>
            <DA name="q" bType="Quality" fc="ST"/>
            <DA name="t" bType="Timestamp" fc="ST"/>
        </DOType>
        <DOType id="Health_DOType" cdc="ENS">
            <DA name="stVal" bType="Enum" type="Health_STEnum" fc="ST"/>
            <DA name="q" bType="Quality" fc="ST"/>
            <DA name="t" bType="Timestamp" fc="ST"/>
        </DOType>
        <DOType id="NamPlt_LLN0_DOType" cdc="LPL">
            <DA name="vendor" bType="VisString255" fc="DC"/>
            <DA name="swRev" bType="VisString255" fc="DC"/>
            <DA name="d" bType="VisString255" fc="DC"/>
            <DA name="configRev" bType="VisString255" fc="DC"/>
            <DA name="ldNs" bType="VisString255" fc="EX"/>
        </DOType>
        <DOType id="NamPlt_DOType" cdc="LPL">
            <DA name="vendor" bType="VisString255" fc="DC"/>
            <DA name="swRev" bType="VisString255" fc="DC"/>
            <DA name="d" bType="VisString255" fc="DC"/>
        </DOType>
        <DOType id="MV_DOType" cdc="MV">
            <DA name="instMag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="mag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
            <DA name="units" bType="Struct" type="Unit_DAType" fc="CF"/>
            <DA name="db" bType="INT32U" fc="CF"/>
            <DA name="zeroDb" bType="INT32U" fc="CF"/>
            <DA name="sVC" bType="Struct" type="ScaledValueConfig_DAType" fc="CF"/>
        </DOType>
        <DOType id="MV_DOType1" cdc="MV">
            <DA name="instMag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
            <DA name="units" bType="Struct" type="Unit_DAType" fc="CF"/>
            <DA name="db" bType="INT32U" fc="CF"/>
            <DA name="zeroDb" bType="INT32U" fc="CF"/>
            <DA name="sVC" bType="Struct" type="ScaledValueConfig_DAType" fc="CF"/>
        </DOType>
        <DOType id="MV_DOType2" cdc="MV">
            <DA name="instMag" bType="Struct" type="AnalogueValue_DAType1" fc="MX"/>
            <DA name="mag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
            <DA name="units" bType="Struct" type="Unit_DAType" fc="CF"/>
            <DA name="db" bType="INT32U" fc="CF"/>
            <DA name="zeroDb" bType="INT32U" fc="CF"/>
            <DA name="sVC" bType="Struct" type="ScaledValueConfig_DAType" fc="CF"/>
        </DOType>
        <DOType id="TotW_DOType" cdc="MV">
            <SDO name="phsA" type="WYE_DOType"/>
            <DA name="totW" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
        </DOType>
        <DOType id="TotVAr_DOType" cdc="MV">
            <DA name="mag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
            <DA name="units" bType="Struct" type="Unit_DAType" fc="CF"/>
        </DOType>
        <DOType id="TotVA_DOType" cdc="MV">
            <DA name="mag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
            <DA name="units" bType="Struct" type="Unit_DAType" fc="CF"/>
        </DOType>
        <DOType id="TotPF_DOType" cdc="MV">
            <DA name="mag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
        </DOType>
        <DOType id="Hz_DOType" cdc="MV">
            <DA name="mag" bType="Struct" type="AnalogueValue_DAType" fc="MX"/>
            <DA name="q" bType="Struct" type="Quality_DAType" fc="MX"/>
            <DA name="t" bType="Timestamp" fc="MX"/>
            <DA name="units" bType="Struct" type="Unit_DAType" fc="CF"/>
        </DOType>
        <DOType id="PhV_DOType" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsB" type="MV_DOType"/>
            <SDO name="phsC" type="MV_DOType"/>
            <SDO name="neut" type="MV_DOType"/>
        </DOType>
        <DOType id="PhV_DOType1" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsB" type="MV_DOType1"/>
            <SDO name="phsC" type="MV_DOType"/>
            <SDO name="neut" type="MV_DOType"/>
        </DOType>
        <DOType id="A_DOType" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsB" type="MV_DOType"/>
            <SDO name="phsC" type="MV_DOType"/>
        </DOType>
        <DOType id="A_DOType1" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsC" type="MV_DOType"/>
        </DOType>
        <DOType id="A_DOType2" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsB" type="MV_DOType"/>
            <SDO name="phsC" type="MV_DOType2"/>
        </DOType>
        <DOType id="W_PhV_DOType" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsB" type="MV_DOType"/>
            <SDO name="phsC" type="MV_DOType"/>
        </DOType>
        <DOType id="WYE_DOType" cdc="WYE">
            <SDO name="phsA" type="MV_DOType"/>
            <SDO name="phsB" type="MV_DOType"/>
            <SDO name="phsC" type="MV_DOType"/>
        </DOType>
        <DAType id="AnalogueValue_DAType">
            <BDA name="f" bType="FLOAT32"/>
            <BDA name="i" bType="INT32"/>
        </DAType>
        <DAType id="AnalogueValue_DAType1">
            <BDA name="f" bType="FLOAT32"/>
        </DAType>
        <DAType id="Quality_DAType">
            <BDA name="validity" bType="Enum" type="ValidityEnum"/>
            <BDA name="detailQual" bType="Struct" type="DetailQual_DAType"/>
            <BDA name="source" bType="Enum" type="SourceEnum"/>
            <BDA name="test" bType="BOOLEAN"/>
            <BDA name="operatorBlocked" bType="BOOLEAN"/>
        </DAType>
        <DAType id="DetailQual_DAType">
            <BDA name="overflow" bType="BOOLEAN"/>
            <BDA name="outOfRange" bType="BOOLEAN"/>
            <BDA name="badReference" bType="BOOLEAN"/>
            <BDA name="oscillatory" bType="BOOLEAN"/>
            <BDA name="inconsistent" bType="BOOLEAN"/>
            <BDA name="inaccurate" bType="BOOLEAN"/>
            <BDA name="oldData" bType="BOOLEAN"/>
            <BDA name="inTest" bType="BOOLEAN"/>
            <BDA name="failure" bType="BOOLEAN"/>
            <BDA name="oldQuality" bType="BOOLEAN"/>
            <BDA name="inconsistentSource" bType="BOOLEAN"/>
            <BDA name="overflowSource" bType="BOOLEAN"/>
        </DAType>
        <DAType id="Unit_DAType">
            <BDA name="SIUnit" bType="Enum" type="SIUnitEnum"/>
            <BDA name="multiplier" bType="Enum" type="MultiplierEnum"/>
        </DAType>
        <DAType id="ScaledValueConfig_DAType">
            <BDA name="scaleFactor" bType="FLOAT32"/>
            <BDA name="offset" bType="FLOAT32"/>
        </DAType>
        <EnumType id="Mod_STEnum">
            <EnumVal ord="1">on</EnumVal>
            <EnumVal ord="2">blocked</EnumVal>
            <EnumVal ord="3">test</EnumVal>
            <EnumVal ord="4">test/blocked</EnumVal>
            <EnumVal ord="5">off</EnumVal>
        </EnumType>
        <EnumType id="Mod_STEnum1">
            <EnumVal ord="1">on</EnumVal>
            <EnumVal ord="3">test</EnumVal>
            <EnumVal ord="4">test/blocked</EnumVal>
            <EnumVal ord="5">off</EnumVal>
        </EnumType>
        <EnumType id="Mod_CtlModelEnum">
            <EnumVal ord="0">status-only</EnumVal>
            <EnumVal ord="1">direct-with-normal-security</EnumVal>
            <EnumVal ord="2">sbo-with-normal-security</EnumVal>
            <EnumVal ord="3">direct-with-enhanced-security</EnumVal>
            <EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
        </EnumType>
        <EnumType id="Beh_STEnum">
            <EnumVal ord="1">on</EnumVal>
            <EnumVal ord="2">blocked</EnumVal>
            <EnumVal ord="3">test</EnumVal>
            <EnumVal ord="4">test/blocked</EnumVal>
            <EnumVal ord="5">off</EnumVal>
        </EnumType>
        <EnumType id="Health_STEnum">
            <EnumVal ord="1">Ok</EnumVal>
            <EnumVal ord="2">Warning</EnumVal>
            <EnumVal ord="3">Alarm</EnumVal>
        </EnumType>
        <EnumType id="ValidityEnum">
            <EnumVal ord="0">good</EnumVal>
            <EnumVal ord="1">invalid</EnumVal>
            <EnumVal ord="2">reserved</EnumVal>
            <EnumVal ord="3">questionable</EnumVal>
        </EnumType>
        <EnumType id="SourceEnum">
            <EnumVal ord="0">process</EnumVal>
            <EnumVal ord="1">substituted</EnumVal>
        </EnumType>
        <EnumType id="SIUnitEnum">
            <EnumVal ord="1">none</EnumVal>
            <EnumVal ord="2">m</EnumVal>
            <EnumVal ord="29">V</EnumVal>
            <EnumVal ord="33">A</EnumVal>
            <EnumVal ord="38">Hz</EnumVal>
            <EnumVal ord="38">W</EnumVal>
            <EnumVal ord="53">VAr</EnumVal>
            <EnumVal ord="61">VA</EnumVal>
        </EnumType>
        <EnumType id="MultiplierEnum">
            <EnumVal ord="-24">y</EnumVal>
            <EnumVal ord="-21">z</EnumVal>
            <EnumVal ord="-18">a</EnumVal>
            <EnumVal ord="-15">f</EnumVal>
            <EnumVal ord="-12">p</EnumVal>
            <EnumVal ord="-9">n</EnumVal>
            <EnumVal ord="-6">u</EnumVal>
            <EnumVal ord="-3">m</EnumVal>
            <EnumVal ord="0">k</EnumVal>
            <EnumVal ord="3">M</EnumVal>
            <EnumVal ord="6">G</EnumVal>
        </EnumType>
    </DataTypeTemplates>
`

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function createSCLWithIEDAndLNode(lNodeContent: string, dataTypeTemplates: string = ''): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Substation name="Sub1">
                ${lNodeContent}
            </Substation>
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="LLN0" inst="" lnType="LLN0_LNodeType_anyLn"/>
                            <LN prefix="" lnClass="MMXU" inst="1" lnType="MMXU_LNodeType_anyLn"/>
                            <LN prefix="" lnClass="MMXU" inst="2" lnType="MMXU_LNodeType_anyLn2"/>
                            <LN prefix="" lnClass="MMXU" inst="4" lnType="MMXU_LNodeType_anyLn3"/>
                            <LN prefix="" lnClass="MMXU" inst="5" lnType="INVALID"/>
                            <LN prefix="" lnClass="MMXU" inst="6" lnType="MMXU_LNodeType_anyLn4"/>
                            <LN prefix="" lnClass="MMXU" inst="7" lnType="MMXU_LNodeType_anyLn5"/>
                        </LDevice>
                        <LDevice inst="LD2">
                            <LN0 lnClass="LLN0" inst="" lnType="LLN0_LNodeType_anyLn1"/>
                            <LN prefix="" lnClass="MMXU" inst="1" lnType="MMXU_LNodeType_anyLn"/>
                        </LDevice>
                        <LDevice inst="LD3">
                            <LN0 lnClass="LLN0" inst="" lnType="LLN0_LNodeType_anyLn2"/>
                            <LN prefix="" lnClass="MMXU" inst="1" lnType="MMXU_LNodeType_anyLn"/>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
            ${dataTypeTemplates}
        </SCL>`;
}

describe('LNode', () => {
    describe('lNode_iedName_consistency', () => {
        it('should return no issues when iedName="None"', () => {
            const lNodeContent = '<LNode iedName="None" lnClass="MMXU" lnInst="1" ldInst="1" prefix=""/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(lNode_iedName_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when referenced LN exists', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(lNode_iedName_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when referenced LN does not exist', () => {
            const lNodeContent = '<LNode iedName="NONEXISTENT" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            const issues = lNode_iedName_consistency(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'iedName_consistency',
                filename: DOC_NAME,
                message: 'iedName in LNode shall be the name of the IED that contains the referenced LN',
            });
        });
    });

    describe('LNode_ldInst_consistency', () => {
        it('should return no issues when iedName="None"', () => {
            const lNodeContent = '<LNode iedName="None" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_ldInst_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when referenced LN exists', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_ldInst_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when referenced LN does not exist', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="999" prefix="" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            const issues = LNode_ldInst_consistency(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
        });
    });

    describe('LNode_lnClass_consistency', () => {
        it('should return no issues when iedName="None"', () => {
            const lNodeContent = '<LNode iedName="None" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_lnClass_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when referenced LN exists', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="LLN0" lnInst="" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_lnClass_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when referenced LN does not exist', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="1" prefix="" lnClass="NONEXISTENT" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            const issues = LNode_lnClass_consistency(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
        });
    });

    describe('LNode_prefix_consistency', () => {
        it('should return no issues when iedName="None"', () => {
            const lNodeContent = '<LNode iedName="None" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_prefix_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when referenced LN exists', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="LLN0" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_prefix_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when referenced LN does not exist', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="INCORRECT" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            const issues = LNode_prefix_consistency(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
        });
    });

    describe('LNode_lnInst_consistency', () => {
        it('should return no issues when iedName="None"', () => {
            const lNodeContent = '<LNode iedName="None" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_lnInst_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when referenced LN exists', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_lnInst_consistency(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when referenced LN does not exist', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="3"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            const issues = LNode_lnInst_consistency(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
        });
    });

    describe('LNode_lnType_consistencyDO', () => {
        it('should return no issues when iedName="None" (there is nothing to compare)', () => {
            const dataTypeTemplates = '<DataTypeTemplates><LNodeType id="LLN0_LNodeType"/></DataTypeTemplates>';
            const lNodeContent = '<LNode iedName="None" prefix="" lnClass="MMXU" lnInst="1" lnType="LLN0_LNodeType"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, dataTypeTemplates));
            expect(LNode_lnType_consistencyDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should return empty array when no DataTypeTemplates exists (there is nothing to compare)', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_lnType_consistencyDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should return empty array when lnType is not specified (there is nothing to compare)', () => {
            const dataTypeTemplates = '<DataTypeTemplates><LNodeType id="LNType1"/></DataTypeTemplates>';
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, dataTypeTemplates));
            expect(LNode_lnType_consistencyDO(doc, DOC_NAME)).toEqual([]);
        });

        it('should not report issue when lnType references non-existent type (there is nothing to compare)', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1" lnType="NonExistentType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDO(doc, DOC_NAME);
            expect(issues.length).toBe(0);
        });

        it('should not report issue when there is no referenced AnyLN non-existent type (there is nothing to compare)', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="99" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDO(doc, DOC_NAME);
            expect(issues.length).toBe(0);
        });

        it('should report issue when there is referenced AnyLN but it has no structure', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="5" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDO(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDO',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : missing DO or SDO`,
            });
        });

        it('should not report issue when data structures are consistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDO(doc, DOC_NAME);
            expect(issues).toEqual([]);
        });

        it('should report issue when DO structures are inconsistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="2" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDO(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDO',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : missing DO or SDO`,
            });
        });

        it('should report issue when SDO structures are inconsistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="4" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDO(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDO',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : missing DO or SDO`,
            });
        });
    });

    describe('LNode_lnType_consistencyDA', () => {
        it('should return no issues when iedName="None"', () => {
            const lNodeContent = '<LNode iedName="None" lnClass="MMXU" lnInst="1" ldInst="1" prefix=""/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            expect(LNode_lnType_consistencyDA(doc, DOC_NAME)).toEqual([]);
        });

        it('should return empty array when no DataTypeTemplates exists', () => {
            const lNodeContent = '<LNode iedName="IED1" lnClass="MMXU" lnInst="1" ldInst="1" prefix=""/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent));
            expect(LNode_lnType_consistencyDA(doc, DOC_NAME)).toEqual([]);
        });

        it('should return empty array when lnType is not specified', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" lnClass="MMXU" lnInst="1"/>';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            expect(LNode_lnType_consistencyDA(doc, DOC_NAME)).toEqual([]);
        });

        it('should not report issue when lnType references non-existent type (there is nothing to compare)', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1" lnType="NonExistentType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBe(0);
        });

        it('should not report issue when there is no referenced AnyLN non-existent type (there is nothing to compare)', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="99" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBe(0);
        });

        it('should report issue when there is referenced AnyLN but it has no structure', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="5" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDA',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : different parameters`,
            });
        });

        it('should not report issue when data structures are consistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="1" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues).toEqual([]);
        });

        it('should report issue when DA structures are inconsistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="6" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDA',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : different parameters`,
            });
        });

        it('should report issue when BDA structures are inconsistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD1" prefix="" lnClass="MMXU" lnInst="7" lnType="MMXU_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDA',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : different parameters`,
            });
        });

        it('should report issue when BDA EnumType are inconsistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD2" prefix="" lnClass="LLN0" lnType="LLN0_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDA',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : different parameters`,
            });
        });

        it('should report issue when BDA type are inconsistent', () => {
            const lNodeContent = '<LNode iedName="IED1" ldInst="LD3" prefix="" lnClass="LLN0" lnType="LLN0_LNodeType" />';
            const doc = parseXMLString(createSCLWithIEDAndLNode(lNodeContent, missingDo));
            const issues = LNode_lnType_consistencyDA(doc, DOC_NAME);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNode_lnType_consistencyDA',
                filename: DOC_NAME,
                message: `lnType in LNode specifies something different from what is implemented in the IED : different parameters`,
            });
        });
    });
});
