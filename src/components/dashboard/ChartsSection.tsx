import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  vulnerabilityData: Array<{
    component: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>;
  onPieClick?: (data: any) => void;
}

export function ChartsSection({ healthData, sanityData, vulnerabilityData, onPieClick }: ChartsSectionProps) {
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
          <div className="mt-4 space-y-2">
            {healthData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sanity Tests Pie Chart */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sanity Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sanityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                onClick={onPieClick}
                className="cursor-pointer"
              >
                {sanityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sanityData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Twistlock Vulnerabilities */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Twistlock Vulnerabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vulnerabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sysdig Vulnerabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vulnerabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
    </div>
  );
}