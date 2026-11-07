import { Order } from '@/types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-88213',
    poNumber: 'B-PO-88213',
    buyerId: 'buyer-uk-b',
    buyerName: 'Company B (UK)',
    buyerCountry: 'United Kingdom',
    style: "Men's crew neck tee, navy",
    color: 'Navy Blue #191970',
    totalQuantity: 12000,
    sizeBreakdown: [
      { size: 'S', quantity: 2400 },
      { size: 'M', quantity: 3600 },
      { size: 'L', quantity: 3600 },
      { size: 'XL', quantity: 2400 }
    ],
    unitAssigned: 'Unit 1 (Avinashi Road)',
    currentStage: 'Stitching',
    stageQuantityCompleted: 6800,
    exFactoryDate: '2026-11-20',
    createdAt: '2026-10-15',
    milestones: [
      { stage: 'Cutting', targetDate: '2026-10-28', targetQty: 12000, completedQty: 12000, status: 'green' },
      { stage: 'Printing', targetDate: '2026-11-04', targetQty: 12000, completedQty: 12000, status: 'green' },
      { stage: 'Stitching', targetDate: '2026-11-14', targetQty: 12000, completedQty: 6800, status: 'red' },
      { stage: 'Finishing', targetDate: '2026-11-18', targetQty: 12000, completedQty: 0, status: 'amber' },
      { stage: 'Packed', targetDate: '2026-11-20', targetQty: 12000, completedQty: 0, status: 'amber' }
    ],
    logs: [
      {
        id: 'log-101',
        orderId: 'ord-88213',
        poNumber: 'B-PO-88213',
        date: '2026-11-04',
        stage: 'Stitching',
        quantityCompleted: 220,
        supervisorName: 'Murugan K.',
        supervisorUnit: 'Unit 1',
        photoUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
        rawNoteTamil: 'ஊசி உடைந்துவிட்டது, மிஷின் 2 மணி நேரம் ஓடவில்லை',
        englishTranslation: 'Sewing needle broken, stitching line idle for 2 hours.',
        aiSuggestedCategory: 'Machinery Breakdown',
        confirmedCategory: 'Machinery Breakdown',
        aiConfidence: 0.94,
        isConfirmedByMerchandiser: true,
        visibleToBuyer: true,
        createdAt: '2026-11-04T18:30:00Z'
      },
      {
        id: 'log-102',
        orderId: 'ord-88213',
        poNumber: 'B-PO-88213',
        date: '2026-11-05',
        stage: 'Stitching',
        quantityCompleted: 210,
        supervisorName: 'Murugan K.',
        supervisorUnit: 'Unit 1',
        photoUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
        rawNoteTamil: 'நேவி ப்ளூ நூல் வரவில்லை, சப்ளையர் தாமதம்',
        englishTranslation: 'Navy blue thread did not arrive, supplier dispatch delayed.',
        aiSuggestedCategory: 'Fabric / Material Shortage',
        confirmedCategory: 'Fabric / Material Shortage',
        aiConfidence: 0.92,
        isConfirmedByMerchandiser: true,
        visibleToBuyer: true,
        createdAt: '2026-11-05T18:45:00Z'
      },
      {
        id: 'log-103',
        orderId: 'ord-88213',
        poNumber: 'B-PO-88213',
        date: '2026-11-06',
        stage: 'Stitching',
        quantityCompleted: 190,
        supervisorName: 'Murugan K.',
        supervisorUnit: 'Unit 1',
        photoUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
        rawNoteTamil: 'தையல் வேலை மெதுவாக நடக்கிறது, கூடுதல் ஆட்கள் தேவை',
        englishTranslation: 'Stitching pace is slow, additional operators required for sleeve hemming.',
        aiSuggestedCategory: 'Worker Absenteeism',
        confirmedCategory: 'Worker Absenteeism',
        aiConfidence: 0.86,
        isConfirmedByMerchandiser: false,
        visibleToBuyer: false,
        createdAt: '2026-11-06T18:00:00Z'
      }
    ],
    dateChangeHistory: [
      {
        id: 'aud-1',
        changedAt: '2026-10-25',
        oldDate: '2026-11-18',
        newDate: '2026-11-20',
        changedBy: 'Karthik S. (Senior Merchandiser)',
        reason: 'Buyer approved 2-day ocean schedule adjustment for container booking at Chennai Port.'
      }
    ]
  },
  {
    id: 'ord-88240',
    poNumber: 'B-PO-88240',
    buyerId: 'buyer-uk-b',
    buyerName: 'Company B (UK)',
    buyerCountry: 'United Kingdom',
    style: "Men's polo, white",
    color: 'Optic White #FFFFFF',
    totalQuantity: 8000,
    sizeBreakdown: [
      { size: 'S', quantity: 1500 },
      { size: 'M', quantity: 2500 },
      { size: 'L', quantity: 2500 },
      { size: 'XL', quantity: 1500 }
    ],
    unitAssigned: 'Unit 2 (Palladam)',
    currentStage: 'Finishing',
    stageQuantityCompleted: 5200,
    exFactoryDate: '2026-11-12',
    createdAt: '2026-10-10',
    milestones: [
      { stage: 'Cutting', targetDate: '2026-10-22', targetQty: 8000, completedQty: 8000, status: 'green' },
      { stage: 'Stitching', targetDate: '2026-11-02', targetQty: 8000, completedQty: 8000, status: 'green' },
      { stage: 'Finishing', targetDate: '2026-11-10', targetQty: 8000, completedQty: 5200, status: 'amber' },
      { stage: 'Packed', targetDate: '2026-11-12', targetQty: 8000, completedQty: 0, status: 'amber' }
    ],
    logs: [
      {
        id: 'log-201',
        orderId: 'ord-88240',
        poNumber: 'B-PO-88240',
        date: '2026-11-05',
        stage: 'Finishing',
        quantityCompleted: 650,
        supervisorName: 'Selvam R.',
        supervisorUnit: 'Unit 2',
        photoUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&auto=format&fit=crop&q=80',
        rawNoteTamil: 'அயர்னிங் மற்றும் டேக்கிங் வேலை நடக்கிறது, சரியான வேகம்',
        englishTranslation: 'Steam ironing and barcode tagging in progress at good pace.',
        aiSuggestedCategory: 'Production Normal',
        confirmedCategory: 'Production Normal',
        aiConfidence: 0.95,
        isConfirmedByMerchandiser: true,
        visibleToBuyer: true,
        createdAt: '2026-11-05T19:00:00Z'
      },
      {
        id: 'log-202',
        orderId: 'ord-88240',
        poNumber: 'B-PO-88240',
        date: '2026-11-06',
        stage: 'Finishing',
        quantityCompleted: 680,
        supervisorName: 'Selvam R.',
        supervisorUnit: 'Unit 2',
        photoUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&auto=format&fit=crop&q=80',
        rawNoteTamil: 'காலர் பொத்தான் பொருத்தப்பட்டு பேக்கிங் தயார்',
        englishTranslation: 'Collar buttons affixed and initial cartons folded.',
        aiSuggestedCategory: 'Production Normal',
        confirmedCategory: 'Production Normal',
        aiConfidence: 0.92,
        isConfirmedByMerchandiser: true,
        visibleToBuyer: true,
        createdAt: '2026-11-06T18:30:00Z'
      }
    ],
    dateChangeHistory: []
  },
  {
    id: 'ord-0488',
    poNumber: 'C-PO-0488',
    buyerId: 'buyer-de-c',
    buyerName: 'Company C (Germany)',
    buyerCountry: 'Germany',
    style: 'Kids printed tee, yellow',
    color: 'Sunflower Yellow #FFDA03',
    totalQuantity: 10000,
    sizeBreakdown: [
      { size: 'S', quantity: 2500 },
      { size: 'M', quantity: 3500 },
      { size: 'L', quantity: 4000 }
    ],
    unitAssigned: 'Unit 3 (Tiruppur City)',
    currentStage: 'Printing',
    stageQuantityCompleted: 3100,
    exFactoryDate: '2026-11-28',
    createdAt: '2026-10-25',
    milestones: [
      { stage: 'Cutting', targetDate: '2026-11-02', targetQty: 10000, completedQty: 10000, status: 'green' },
      { stage: 'Printing', targetDate: '2026-11-12', targetQty: 10000, completedQty: 3100, status: 'green' },
      { stage: 'Stitching', targetDate: '2026-11-22', targetQty: 10000, completedQty: 0, status: 'green' },
      { stage: 'Finishing', targetDate: '2026-11-26', targetQty: 10000, completedQty: 0, status: 'green' },
      { stage: 'Packed', targetDate: '2026-11-28', targetQty: 10000, completedQty: 0, status: 'green' }
    ],
    logs: [
      {
        id: 'log-301',
        orderId: 'ord-0488',
        poNumber: 'C-PO-0488',
        date: '2026-11-05',
        stage: 'Printing',
        quantityCompleted: 500,
        supervisorName: 'Muthuvel P.',
        supervisorUnit: 'Unit 3',
        photoUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
        rawNoteTamil: 'பிரிண்டிங் ஸ்க்ரீன் செட் செய்யப்பட்டது, குவாலிட்டி சரியானது',
        englishTranslation: 'Printing screens mounted; pigment shade approved by QA.',
        aiSuggestedCategory: 'Production Normal',
        confirmedCategory: 'Production Normal',
        aiConfidence: 0.96,
        isConfirmedByMerchandiser: true,
        visibleToBuyer: true,
        createdAt: '2026-11-05T17:00:00Z'
      }
    ],
    dateChangeHistory: []
  }
];

