"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTamilFloorNote = parseTamilFloorNote;
const VOCABULARY_RULES = [
    {
        keywords: ['ஊசி', 'உடைந்தது', 'மிஷின்', 'மோட்டார்', 'ரிப்பேர்', 'needle', 'machine', 'motor'],
        category: 'Machinery Breakdown',
        englishTemplate: 'Sewing machine or needle breakdown halted the line.'
    },
    {
        keywords: ['நூல்', 'துணி', 'ரோல்', 'நூல் வரவில்லை', 'thread', 'fabric', 'shortage'],
        category: 'Fabric / Material Shortage',
        englishTemplate: 'Shortage of matching sewing thread or dyed fabric rolls.'
    },
    {
        keywords: ['ஆள் வரவில்லை', 'தொழிலாளி', 'லீவு', 'விடுமுறை', 'absent', 'workers'],
        category: 'Worker Absenteeism',
        englishTemplate: 'Line worker absenteeism after local holiday shift.'
    },
    {
        keywords: ['ஷேடு', 'சாயம்', 'கரப்பான்', 'shade', 'stain', 'defect'],
        category: 'Quality / Shade Defect',
        englishTemplate: 'Fabric color shade variation or printing defect noticed.'
    },
    {
        keywords: ['மின்சாரம்', 'கரண்ட் இல்லை', 'ஜெனரேட்டர்', 'power', 'current'],
        category: 'Power Outage',
        englishTemplate: 'Grid power disruption; standby generator switchover delay.'
    },
    {
        keywords: ['பிரிண்டிங் வரல', 'வாஷிங் லேட்', 'subcontract', 'washing', 'dyeing'],
        category: 'Subcontractor Delay',
        englishTemplate: 'Subcontracted washing or screen printing batch delayed in transit.'
    },
    {
        keywords: ['சரியாக ஓடுகிறது', 'பிரச்சனை இல்லை', 'முடிந்தது', 'normal', 'ok', 'good'],
        category: 'Production Normal',
        englishTemplate: 'Production running smoothly according to planned capacity.'
    }
];
function parseTamilFloorNote(tamilText) {
    const normalized = (tamilText || '').toLowerCase().trim();
    if (!normalized) {
        return {
            englishTranslation: 'No floor issue reported.',
            suggestedCategory: 'Production Normal',
            confidence: 1.0,
            reasoning: 'Blank note defaults to standard flow.'
        };
    }
    for (const rule of VOCABULARY_RULES) {
        const matchCount = rule.keywords.filter(k => normalized.includes(k.toLowerCase())).length;
        if (matchCount > 0) {
            const confidence = Math.min(0.96, 0.75 + matchCount * 0.1);
            return {
                englishTranslation: `${rule.englishTemplate} (Supervisor note: "${tamilText}")`,
                suggestedCategory: rule.category,
                confidence: Number(confidence.toFixed(2)),
                reasoning: `Matched factory operational keywords related to ${rule.category}.`
            };
        }
    }
    return {
        englishTranslation: `Supervisor note from floor: "${tamilText}"`,
        suggestedCategory: 'Other',
        confidence: 0.52,
        reasoning: 'Unclassified issue note. Human-in-the-loop review recommended by merchandiser.'
    };
}
//# sourceMappingURL=ai-translator.service.js.map