import { describe, it, expect } from 'vitest';
import { analyzeTamilNote } from './aiTranslator';

describe('Tamil Voice/Text AI Translation and Categorization', () => {
  it('correctly categorizes machinery needle breakdowns', () => {
    const result = analyzeTamilNote('ஊசி உடைந்துவிட்டது, மிஷின் 2 மணி நேரம் ஓடவில்லை');
    expect(result.suggestedCategory).toBe('Machinery Breakdown');
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.englishTranslation.toLowerCase()).toContain('needle');
  });

  it('correctly categorizes fabric and yarn shortages', () => {
    const result = analyzeTamilNote('நேவி ப்ளூ நூல் வரவில்லை, சப்ளையர் தாமதம்');
    expect(result.suggestedCategory).toBe('Fabric / Material Shortage');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('correctly categorizes worker absenteeism', () => {
    const result = analyzeTamilNote('தையல் தொழிலாளர்கள் ஆள் வரவில்லை');
    expect(result.suggestedCategory).toBe('Worker Absenteeism');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('gracefully degrades to Other with low confidence for unknown notes', () => {
    const result = analyzeTamilNote('வேறு ஏதோ புதிய பிரச்சனை வந்தது');
    expect(result.suggestedCategory).toBe('Other');
    expect(result.confidence).toBeLessThan(0.7);
  });
});
