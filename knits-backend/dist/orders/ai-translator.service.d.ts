import { DelayCategory } from './order.model';
export declare function parseTamilFloorNote(tamilText: string): {
    englishTranslation: string;
    suggestedCategory: DelayCategory;
    confidence: number;
    reasoning: string;
};
