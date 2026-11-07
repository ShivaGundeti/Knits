import { DelayCategory } from '@/types';

interface AiAnalysisResult {
  englishTranslation: string;
  suggestedCategory: DelayCategory;
  confidence: number;
  reasoning: string;
}

// Tiruppur Garment Factory vocabulary dictionary for realistic translation & intent categorization
const VOCABULARY_RULES: { keywords: string[]; category: DelayCategory; englishTemplate: string }[] = [
  {
    keywords: ['ஊசி', 'உடைந்தது', 'மிஷின்', 'மோட்டார்', 'ரிப்பேர்', 'மெஷின்', 'needle', 'machine', 'motor'],
    category: 'Machinery Breakdown',
    englishTemplate: 'Sewing machine or needle breakdown halted the line.'
  },
  {
    keywords: ['நூல்', 'துணி', 'ரோல்', 'துணி வரவில்லை', 'நூல் பற்றாக்குறை', 'thread', 'fabric', 'shortage', 'gsm'],
    category: 'Fabric / Material Shortage',
    englishTemplate: 'Shortage of matching sewing thread or dyed fabric rolls.'
  },
  {
    keywords: ['ஆள் வரவில்லை', 'தொழிலாளி', 'லீவு', 'ஆட்கள் குறைவு', 'விடுமுறை', 'absent', 'workers'],
    category: 'Worker Absenteeism',
    englishTemplate: 'Line worker absenteeism after local holiday/festival shift.'
  },
  {
    keywords: ['ஷேடு', 'சாயம்', 'கரப்பான்', 'வெட்டு குறைபாடு', 'தவறு', 'shade', 'stain', 'defect', 'print'],
    category: 'Quality / Shade Defect',
    englishTemplate: 'Fabric color shade variation or printing alignment defect noticed.'
  },
  {
    keywords: ['மின்சாரம்', 'கரண்ட் இல்லை', 'ஜெனரேட்டர்', 'டீசல்', 'power', 'current', 'outage'],
    category: 'Power Outage',
    englishTemplate: 'Grid power disruption; standby generator switchover delay.'
  },
  {
    keywords: ['பிரிண்டிங் வரல', 'வாஷிங் லேட்', 'வெளியே', 'ஜாப் ஒர்க்', 'subcontract', 'washing', 'dyeing'],
    category: 'Subcontractor Delay',
    englishTemplate: 'Subcontracted washing or screen printing batch delayed in transit.'
  },
  {
    keywords: ['சரியாக ஓடுகிறது', 'பிரச்சனை இல்லை', 'முடிந்தது', 'டார்கெட்', 'normal', 'ok', 'good'],
    category: 'Production Normal',
    englishTemplate: 'Production running smoothly according to planned line capacity.'
  }
];

/**
 * AI Tamil note parser and category classifier with confidence scoring.
 * Graceful fallback when confidence is low.
 */
export function analyzeTamilNote(tamilText: string): AiAnalysisResult {
  const normalized = tamilText.toLowerCase().trim();
  
  if (!normalized) {
    return {
      englishTranslation: 'No notes entered.',
      suggestedCategory: 'Production Normal',
      confidence: 1.0,
      reasoning: 'Blank note defaults to standard flow.'
    };
  }

  for (const rule of VOCABULARY_RULES) {
    const matchCount = rule.keywords.filter(k => normalized.includes(k.toLowerCase())).length;
    if (matchCount > 0) {
      // Calculate realistic confidence based on keyword match density
      const confidence = Math.min(0.96, 0.75 + matchCount * 0.1);
      return {
        englishTranslation: `${rule.englishTemplate} (Supervisor note: "${tamilText}")`,
        suggestedCategory: rule.category,
        confidence: Number(confidence.toFixed(2)),
        reasoning: `Matched factory operational keywords related to ${rule.category}.`
      };
    }
  }

  // Graceful degradation when unfamiliar or mixed note
  return {
    englishTranslation: `Supervisor note from floor: "${tamilText}"`,
    suggestedCategory: 'Other',
    confidence: 0.52,
    reasoning: 'Unclassified issue note. Human-in-the-loop review recommended by merchandiser.'
  };
}

