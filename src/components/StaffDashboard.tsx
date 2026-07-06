import React, { useState, useCallback } from "react";
import { Activity, Users, AlertTriangle, Thermometer, ShieldCheck, Loader2, RefreshCw, Leaf, TrainFront } from "lucide-react";
import { StadiumMetrics } from "../types";
import Markdown from "react-markdown";
import DOMPurify from "dompurify";
import { cn } from "../lib/utils";

const mockMetrics: StadiumMetrics = {
  totalAttendance: 64230,
  capacity: 80000,
  gateCongestion: {
    gateA: "High",
    gateB: "Low",
    gateC: "Medium"
  },
  temperature: 28,
  activeIncidents: 2,
  sustainabilityScore: 92,
  transitStatus: "Normal"
};

const mockIncidents = [
  "Crowd buildup detected outside Gate A. Recommend redirecting to Gate B.",
  "Medical request at Section 120, Row 5.",
  "Transit delay: Metro Line 3 experiencing 15min delay.",
  "Accessibility request: Wheelchair assistance needed at Gate C."
];

export default React.memo(function StaffDashboard() {
  const [metrics, setMetrics] = useState<StadiumMetrics>(mockMetrics);
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(mockIncidents[0]);

  const generateInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/staff/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics,
          incident: selectedIncident
        })
      });

      if (!res.ok) throw new Error("Failed to fetch insights");

      const data = await res.json();
      setInsights(data.insights);
    } catch (error) {
      console.error(error);
      setInsights("Failed to generate AI insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [metrics, selectedIncident]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Real-time operational intelligence powered by Gemini</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Live System Status: Normal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Telemetry */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors duration-300">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Venue Telemetry
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Attendance</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.totalAttendance.toLocaleString()}</span>
                  <span className="text-sm font-medium text-slate-400 mb-1">/ {metrics.capacity.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                    style={{ width: `${(metrics.totalAttendance / metrics.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <Thermometer className="w-5 h-5 text-orange-500 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Temperature</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{metrics.temperature}°C</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active Units</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">142</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <Leaf className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sustainability</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{metrics.sustainabilityScore}/100</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <TrainFront className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Transit Status</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{metrics.transitStatus}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 mt-4">Gate Congestion</h3>
                <div className="space-y-2">
                  {Object.entries(metrics.gateCongestion).map(([gate, status]) => (
                    <div key={gate} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{gate.replace('gate', 'Gate ')}</span>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-md",
                        status === "High" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                        status === "Medium" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      )}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6 lg:col-span-2">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Incident Reports
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {mockIncidents.map((inc, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedIncident(inc)}
                  aria-pressed={selectedIncident === inc}
                  className={cn(
                    "p-4 rounded-xl border text-left cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full",
                    selectedIncident === inc 
                      ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500 dark:ring-indigo-400 shadow-sm" 
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-transparent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{inc}</p>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pl-5">2 mins ago</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-500/20 p-1.5 rounded-md">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="font-semibold text-white">AI Decision Support</h2>
              </div>
              <button
                onClick={generateInsights}
                disabled={isLoading}
                aria-label="Generate Action Plan using AI"
                data-testid="generate-action-plan-button"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isLoading ? "Analyzing..." : "Generate Action Plan"}
              </button>
            </div>
            
            <div 
              className="flex-1 p-5 overflow-y-auto bg-slate-900 custom-scrollbar"
              aria-live="polite"
              aria-atomic="true"
            >
              {!insights && !isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <Activity className="w-8 h-8 opacity-50" />
                  <p className="text-sm">Select an incident and generate an AI action plan.</p>
                </div>
              ) : isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-indigo-400 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm font-medium animate-pulse">Running crowd simulation & resource models...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none text-slate-300
                  prose-headings:text-white prose-headings:font-medium
                  prose-strong:text-indigo-300
                  prose-ul:list-disc prose-ul:pl-4 prose-li:marker:text-indigo-500
                ">
                  <Markdown>{DOMPurify.sanitize(insights)}</Markdown>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
});
