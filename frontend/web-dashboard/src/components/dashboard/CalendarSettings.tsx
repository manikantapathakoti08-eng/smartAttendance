'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import apiClient from '@/lib/apiClient';

export function CalendarSettings() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'HOLIDAY',
    description: ''
  });

  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await apiClient.post('/api/v1/admin/calendar/day', formData);
      setMessage({ type: 'success', text: `Successfully updated calendar for ${formData.date}` });
      setIsAdding(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'HOLIDAY',
        description: ''
      });
      // In a real app, we'd fetch entries here, but since we don't have a GET yet, we just show success
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update calendar' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-primary" /> Academic Calendar Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Declare holidays and exam seasons to adjust AI monitoring behavior.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAdding(!isAdding)} className="px-6 shadow-lg shadow-primary/20 font-bold">
          {isAdding ? 'Cancel' : <><Plus size={16} className="mr-1" /> Add Entry</>}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {isAdding && (
        <Card className="bg-white border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Day Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                  required
                >
                  <option value="HOLIDAY">Holiday (AI Rest Mode)</option>
                  <option value="EXAM_DAY">Exam Day (No AI Marking)</option>
                  <option value="SPECIAL_EVENT">Special Event</option>
                  <option value="HALF_DAY">Half Day</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-400 font-medium"
                  placeholder="e.g. Independence Day"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" variant="primary" loading={loading} className="px-10 font-bold shadow-lg shadow-primary/20">
                  Save to Calendar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* AI Behavior Infographic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-50 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary h-fit">
              <Calendar size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Holiday Mode (Resting)</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Declarations will force the AI monitor into power-saving mode. No sessions will be generated or scanned.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex gap-4">
            <div className="p-4 bg-red-500/10 rounded-2xl text-red-600 h-fit">
              <Info size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Exam Mode (Exemption)</h4>
              <p className="text-sm text-slate-500 leading-relaxed">AI will monitor but NOT mark absences. System relies on physical barcode scans for official attendance.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
