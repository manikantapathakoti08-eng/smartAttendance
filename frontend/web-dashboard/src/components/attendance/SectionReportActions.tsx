'use client';

import React, { useState } from 'react';
import { Download, Filter, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { attendanceService } from '@/services/attendance.service';

interface SectionReportActionsProps {
  sectionId: string;
}

export const SectionReportActions: React.FC<SectionReportActionsProps> = ({ sectionId }) => {
  const [threshold, setThreshold] = useState<number>(75);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [downloadingList, setDownloadingList] = useState(false);

  const handleDownloadFullReport = async () => {
    if (!sectionId) return;
    setDownloadingReport(true);
    try {
      // Pass null/undefined for threshold to get everyone
      await attendanceService.downloadSectionReport(sectionId, undefined);
      console.log(`Full attendance report downloaded!`);
    } catch (error) {
      console.error('Failed to download attendance report');
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleDownloadDefaulters = async () => {
    if (!sectionId) return;
    setDownloadingReport(true);
    try {
      await attendanceService.downloadSectionReport(sectionId, threshold);
      console.log(`Defaulter report (Threshold: ${threshold}%) downloaded!`);
    } catch (error) {
      console.error('Failed to download attendance report');
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleDownloadList = async () => {
// ... existing handleDownloadList ...
    if (!sectionId) return;
    setDownloadingList(true);
    try {
      await attendanceService.downloadStudentList(sectionId);
      console.log('Student registry downloaded!');
    } catch (error) {
      console.error('Failed to download student list');
    } finally {
      setDownloadingList(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Registry & Reports Center
            </h3>
            <p className="text-slate-500 text-sm font-medium opacity-80">Download section-wide attendance data and student lists.</p>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleDownloadList}
            loading={downloadingList}
            className="flex items-center gap-2 font-bold px-6"
          >
            <Download size={16} />
            Download Student Registry
          </Button>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <div className="flex flex-wrap items-center gap-6">
          {/* Full Report Action */}
          <div className="flex flex-col gap-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete Data</span>
             <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownloadFullReport}
              loading={downloadingReport}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 text-slate-900 font-bold"
            >
              <Download size={16} className="text-primary" />
              Full Class Attendance
            </Button>
          </div>

          <div className="w-px h-10 bg-slate-100 hidden md:block" />

          {/* Defaulter Report Action */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Defaulter List (Filter)</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-9 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Filter size={16} className="text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="bg-transparent text-slate-900 text-sm w-12 focus:outline-none font-bold"
                />
                <span className="text-sm text-slate-400 font-bold">%</span>
              </div>

              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleDownloadDefaulters}
                loading={downloadingReport}
                className="flex items-center gap-2 font-bold px-6"
              >
                <Download size={16} />
                Download Defaulter Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
