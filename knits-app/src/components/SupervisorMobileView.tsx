'use client';

import React, { useState } from 'react';
import { Order, ProductionStage } from '@/types';
import { OrderStore } from '@/utils/store';
import { analyzeTamilNote } from '@/utils/aiTranslator';
import { 
  Smartphone, 
  Camera, 
  Send, 
  Mic, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface SupervisorMobileViewProps {
  orders: Order[];
  onLogSubmitted: () => void;
}

const STAGES: ProductionStage[] = [
  'Cutting',
  'Printing',
  'Stitching',
  'Washing',
  'Finishing',
  'Packed'
];

export const SupervisorMobileView: React.FC<SupervisorMobileViewProps> = ({
  orders,
  onLogSubmitted
}) => {
  const [selectedPo, setSelectedPo] = useState<string>(orders[0]?.poNumber || '');
  const [selectedStage, setSelectedStage] = useState<ProductionStage>('Stitching');
  const [quantity, setQuantity] = useState<string>('250');
  const [supervisorName, setSupervisorName] = useState<string>('Murugan K.');
  const [supervisorUnit, setSupervisorUnit] = useState<string>('Unit 1 (Avinashi Road)');
  const [tamilNote, setTamilNote] = useState<string>('ஊசி உடைந்துவிட்டது, மிஷின் 1 மணி நேரம் ஓடவில்லை');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80'
  );
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'queued'; text: string } | null>(null);

  const currentOrder = orders.find(o => o.poNumber === selectedPo) || orders[0];

  // Quick Tamil voice note presets for testing low RAM devices
  const TAMIL_PRESETS = [
    { label: 'ஊசி உடைப்பு (Needle/Machine)', text: 'ஊசி உடைந்துவிட்டது, மிஷின் 1 மணி நேரம் ஓடவில்லை' },
    { label: 'நூல் பற்றாக்குறை (Thread Missing)', text: 'நேவி ப்ளூ நூல் வரவில்லை, சப்ளையர் தாமதம்' },
    { label: 'ஆட்கள் விடுமுறை (Worker Absent)', text: 'தையல் தொழிலாளர்கள் 4 பேர் இன்று வரவில்லை' },
    { label: 'சரியாக ஓடுகிறது (All Normal)', text: 'வேலை சிறப்பாக நடக்கிறது, பிரச்சனை எதுவும் இல்லை' }
  ];

  // Handle Photo input (local data URL for offline capability)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock voice recording toggle
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time speech capture
      setTimeout(() => {
        setIsRecording(false);
        setTamilNote('மின்சாரம் இல்லை, ஜெனரேட்டர் மூலம் வேலை நடக்கிறது');
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  // Submit Floor Update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(quantity, 10);
    if (!qtyNum || qtyNum <= 0) {
      alert('Please enter valid quantity completed');
      return;
    }

    if (isOffline) {
      // Queue offline for 2-3GB RAM phone with no network
      OrderStore.enqueueOfflineLog({
        tempId: `offline-${Date.now()}`,
        orderId: currentOrder.id,
        poNumber: currentOrder.poNumber,
        stage: selectedStage,
        quantity: qtyNum,
        supervisorName,
        supervisorUnit,
        rawNoteTamil: tamilNote,
        photoDataUrl: photoPreview,
        timestamp: Date.now()
      });

      setStatusMessage({
        type: 'queued',
        text: 'பதிவு சேமிக்கப்பட்டது (Saved to Offline Queue). நெட்வொர்க் வரும்போது தானாக அனுப்பப்படும்.'
      });
      setTimeout(() => setStatusMessage(null), 4000);
      onLogSubmitted();
      return;
    }

    // Online submission: Run AI translation and categorization
    const aiResult = analyzeTamilNote(tamilNote);

    OrderStore.addDailyLog(currentOrder.id, {
      orderId: currentOrder.id,
      poNumber: currentOrder.poNumber,
      date: new Date().toISOString().split('T')[0],
      stage: selectedStage,
      quantityCompleted: qtyNum,
      supervisorName,
      supervisorUnit,
      photoUrl: photoPreview,
      rawNoteTamil: tamilNote,
      englishTranslation: aiResult.englishTranslation,
      aiSuggestedCategory: aiResult.suggestedCategory,
      confirmedCategory: aiResult.suggestedCategory,
      aiConfidence: aiResult.confidence,
      isConfirmedByMerchandiser: false, // human-in-the-loop review
      visibleToBuyer: false // gatekeeper pattern: only visible after confirmation
    });

    setStatusMessage({
      type: 'success',
      text: 'வெற்றிகரமாக அனுப்பப்பட்டது! (Successfully submitted to Merchandiser Board)'
    });
    setTimeout(() => setStatusMessage(null), 4000);
    onLogSubmitted();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Mobile Frame Simulation Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Mobile Header (Tamil + Network toggle) */}
        <div className="bg-slate-900 text-white p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm">மேற்பார்வையாளர் தளம் (Supervisor App)</span>
            </div>
            
            {/* Toggle Network Mode to test 2-3GB RAM patchy network requirement */}
            <button
              type="button"
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                isOffline 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? 'Offline (ஆஃப்லைன்)' : 'Online (ஆன்லைன்)'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300">
            தினசரி உற்பத்தி மற்றும் சிக்கல் குறிப்பு பதிவு (Daily Output & Issue Note)
          </p>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div className={`p-4 text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'queued' ? 'bg-amber-100 text-amber-900 border-b border-amber-200' : 'bg-emerald-100 text-emerald-900 border-b border-emerald-200'
          }`}>
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Order Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ஆர்டர் எண் (Select Order / PO)
            </label>
            <select
              value={selectedPo}
              onChange={(e) => setSelectedPo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
              {orders.map(o => (
                <option key={o.id} value={o.poNumber}>
                  {o.poNumber} — {o.style} ({o.totalQuantity.toLocaleString()} pcs)
                </option>
              ))}
            </select>
          </div>

          {/* Current Stage */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              உற்பத்தி நிலை (Production Stage)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STAGES.map(stage => (
                <button
                  type="button"
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                    selectedStage === stage
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Completed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              இன்று முடிக்கப்பட்ட எண்ணிக்கை (Pieces Completed Today)
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
                placeholder="எண்ணிக்கை (e.g. 500)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono"
              />
              <span className="absolute right-3.5 top-3 text-xs font-semibold text-slate-400">
                துண்டுகள் (Pieces)
              </span>
            </div>
          </div>

          {/* Issue Note in Tamil with Voice Recording */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                சிக்கல் அல்லது குறிப்பு (Tamil Issue Note / Voice)
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'பேசவும்... (Listening)' : 'குரல் பதிவு (Voice)'}</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={tamilNote}
              onChange={(e) => setTamilNote(e.target.value)}
              placeholder="எ.கா: ஊசி உடைந்துவிட்டது, நூல் பற்றாக்குறை..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            ></textarea>

            {/* Quick preset chips */}
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {TAMIL_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTamilNote(p.text)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Capture */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              தயாரிப்பு புகைப்படம் (Floor Photo)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 relative shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Production batch" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 transition-colors">
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span>கேமரா / கேலரி (Take Photo)</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Proof of stitching batch & carton packing</p>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-indigo-200 text-sm flex items-center justify-center gap-2 transition-all mt-4"
          >
            <Send className="w-4 h-4" />
            <span>அனுப்பு (Submit Daily Update)</span>
          </button>

          {/* Supervisor identity stamp */}
          <div className="text-center pt-1 text-[11px] text-slate-400">
            Supervisor: <strong>{supervisorName}</strong> • {supervisorUnit}
          </div>

        </form>

      </div>
    </div>
  );
};

