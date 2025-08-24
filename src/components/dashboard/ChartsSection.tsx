import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartsSectionProps {
  healthData: Array<{
    name: string;
    value: number;
    color: string;
    components?: string[];
  }>;
  sanityData: Array<{
    name: string;
    value: number;
    color: string;
    components?: string[];
  }>;
  twistlockVulnerabilityData: Array<{
    component: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>;
  sysdigVulnerabilityData: Array<{
    component: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>;
  onPieClick?: (data: any) => void;
}

export function ChartsSection({ healthData, sanityData, twistlockVulnerabilityData, sysdigVulnerabilityData, onPieClick }: ChartsSectionProps) {
  // Sample test details for demo purposes (table format)
  // In future, replace with API results
  const sampleTestDetails = {
    Passed: [
      { name: 'API Test', status: 'passed' },
      { name: 'Cache Test', status: 'passed' },
      { name: 'API Test', status: 'passed' },
      { name: 'Cache Test', status: 'passed' },
      { name: 'API Test', status: 'passed' },
      { name: 'Cache Test', status: 'passed' },
      { name: 'API Test', status: 'passed' },
      { name: 'Cache Test', status: 'passed' },
      { name: 'API Test', status: 'passed' },
      { name: 'Cache Test', status: 'passed' },
      { name: 'API Test', status: 'passed' },
    ],
    Failed: [
      { name: 'API Test', status: 'failed' },
      { name: 'Cache Test', status: 'failed' },
      { name: 'API Test', status: 'failed' },
      { name: 'Cache Test', status: 'failed' },
    ],
    Pending: [
      { name: 'API Test', status: 'pending' },
      { name: 'Cache Test', status: 'pending' },
    ],
  };

  // Modal state for showing test details
  const [sanityModal, setSanityModal] = React.useState<{ status: string; tests: { name: string; status: string }[] } | null>(null);

  // Handler for pie sector click
  const handleSanityPieClick = (_: any, index: number) => {
    const status = sanityPieData[index].name;
    setSanityModal({ status, tests: sampleTestDetails[status] || [] });
  };

  // Placeholder for full report URL (update with actual URL in future)
  const fullReportUrl = '#';
  const [expanded, setExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState<null | 'twistlock' | 'sysdig' | 'health'>(null);
  const [healthModal, setHealthModal] = React.useState<{ status: string; components: string[] } | null>(null);
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-elevated">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm">
            <span className="text-primary">Count: </span>
            <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const VulnerabilityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-elevated">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="capitalize">{entry.dataKey}: </span>
              <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Example: Fetch sanity test counts from API and update pie chart dynamically
  // Replace the URL and response mapping as per your backend
  const [sanityPieData, setSanityPieData] = React.useState([
    { name: "Passed", value: 0, color: "#22c55e" },
    { name: "Failed", value: 0, color: "#ef4444" },
    { name: "Pending", value: 0, color: "#fbbf24" },
  ]);

  React.useEffect(() => {
    fetch('https://sampleapi.com/sanity-results')
      .then(res => res.json())
      .then(data => {
        setSanityPieData([
          { name: 'Passed', value: data.sanityPassed, color: '#22c55e' },
          { name: 'Failed', value: data.sanityFailed, color: '#ef4444' },
          { name: 'Pending', value: data.sanityPending, color: '#fbbf24' },
        ]);
      })
      .catch(() => {
        // fallback: keep zeros or show error
      });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Health Status Pie Chart */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={healthData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                onClick={onPieClick}
                className="cursor-pointer"
              >
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Modal for Health Components removed, reverting to original behavior */}

      {/* Sanity Tests Pie Chart */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sanity Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sanityPieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                onClick={handleSanityPieClick}
                className="cursor-pointer"
              >
                {sanityPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Modal for Sanity Test Details */}
      {sanityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-card rounded-xl shadow-elevated border border-border p-8 relative w-full max-w-xl mx-auto">
            {/* Only one close button should be present */}
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-accent"
              onClick={() => setSanityModal(null)}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Sanity Tests: {sanityModal.status}</h2>
            <div className="overflow-y-auto max-h-96 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-3 py-2 text-left font-semibold">Test Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sanityModal.tests.map((test, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="px-3 py-2">{test.name}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${test.status === 'passed' ? 'bg-green-700 text-green-100' :
                          test.status === 'failed' ? 'bg-red-700 text-red-100' :
                            'bg-yellow-700 text-yellow-100'
                          }`}>
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {sanityModal.tests.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-3 py-2 text-muted-foreground text-center">No tests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold"
              onClick={() => fullReportUrl && window.open(fullReportUrl, '_blank')}
            >
              Full Report
            </button>
            {/* In future, replace sampleTestDetails with API results here */}
          </div>
        </div>
      )}

      {/* Twistlock Vulnerabilities */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Twistlock Vulnerabilities</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setModalOpen('twistlock')} aria-label="Enlarge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H8V2H2V8H4V4ZM16 4H12V2H18V8H16V4ZM4 16H8V18H2V12H4V16ZM16 16H12V18H18V12H16V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={twistlockVulnerabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="component"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
              />
              <YAxis fontSize={11} />
              <Tooltip content={<VulnerabilityTooltip />} />
              <Bar dataKey="critical" stackId="a" fill="hsl(var(--severity-critical))" />
              <Bar dataKey="high" stackId="a" fill="hsl(var(--severity-high))" />
              <Bar dataKey="medium" stackId="a" fill="hsl(var(--severity-medium))" />
              <Bar dataKey="low" stackId="a" fill="hsl(var(--severity-low))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sysdig Vulnerabilities */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sysdig Vulnerabilities</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setModalOpen('sysdig')} aria-label="Enlarge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H8V2H2V8H4V4ZM16 4H12V2H18V8H16V4ZM4 16H8V18H2V12H4V16ZM16 16H12V18H18V12H16V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sysdigVulnerabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="component"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
              />
              <YAxis fontSize={11} />
              <Tooltip content={<VulnerabilityTooltip />} />
              <Bar dataKey="critical" stackId="a" fill="hsl(var(--severity-critical))" />
              <Bar dataKey="high" stackId="a" fill="hsl(var(--severity-high))" />
              <Bar dataKey="medium" stackId="a" fill="hsl(var(--severity-medium))" />
              <Bar dataKey="low" stackId="a" fill="hsl(var(--severity-low))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Modal for enlarged chart */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-card rounded-xl shadow-elevated border border-border p-8 relative w-full max-w-5xl mx-auto">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-accent"
              onClick={() => setModalOpen(null)}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1">
                {modalOpen === 'twistlock' ? 'Twistlock Vulnerabilities Overview' : 'Sysdig Vulnerabilities Overview'}
              </h2>
              <p className="text-muted-foreground mb-4">
                Detailed view of {modalOpen === 'twistlock' ? 'Twistlock' : 'Sysdig'} vulnerability distribution across all components
              </p>
              <div className="flex gap-4 mb-4">
                <span className="flex items-center gap-1 text-severity-critical"><span className="w-3 h-3 rounded-full bg-severity-critical inline-block" /> Critical</span>
                <span className="flex items-center gap-1 text-severity-high"><span className="w-3 h-3 rounded-full bg-severity-high inline-block" /> High</span>
                <span className="flex items-center gap-1 text-severity-medium"><span className="w-3 h-3 rounded-full bg-severity-medium inline-block" /> Medium</span>
                <span className="flex items-center gap-1 text-severity-low"><span className="w-3 h-3 rounded-full bg-severity-low inline-block" /> Low</span>
              </div>
            </div>
            <div className="w-full h-[500px]">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={modalOpen === 'twistlock' ? twistlockVulnerabilityData : sysdigVulnerabilityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  onClick={(e: any) => {
                    if (e && e.activeLabel) {
                      // Use only the last part after last slash for service name
                      const serviceName = e.activeLabel.split('/').pop();
                      const id = `service-card-${serviceName.replace(/\s+/g, '-')}`;
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('ring-4', 'ring-accent');
                        setTimeout(() => {
                          el.classList.remove('ring-4', 'ring-accent');
                        }, 1600);
                        setModalOpen(null);
                      }
                    }
                  }}
                >
                  <XAxis
                    dataKey="component"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={13}
                  />
                  <YAxis fontSize={13} />
                  <Tooltip content={<VulnerabilityTooltip />} />
                  <Bar dataKey="critical" stackId="a" fill="hsl(var(--severity-critical))" />
                  <Bar dataKey="high" stackId="a" fill="hsl(var(--severity-high))" />
                  <Bar dataKey="medium" stackId="a" fill="hsl(var(--severity-medium))" />
                  <Bar dataKey="low" stackId="a" fill="hsl(var(--severity-low))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}