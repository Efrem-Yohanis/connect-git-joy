import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Clock,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface PerformanceStatsProps {
  throughputLastHour: number;
  eventsLastHour: number;
  eventsLast24h: number;
  eventsLast7d: number;
  errorRate: number;
  retryCount: number;
}

const mockTrendData = [
  { time: "00:00", events: 1200 },
  { time: "04:00", events: 800 },
  { time: "08:00", events: 2400 },
  { time: "12:00", events: 3200 },
  { time: "16:00", events: 2800 },
  { time: "20:00", events: 1600 },
  { time: "24:00", events: 1000 }
];

const mockNodePerformance = [
  { name: "SFTP Collector", throughput: 520, errors: 2, status: "running" },
  { name: "ASCII Decoder", throughput: 515, errors: 0, status: "running" },
  { name: "Validation BLN", throughput: 412, errors: 8, status: "partial" },
  { name: "FDC Distributor", throughput: 412, errors: 0, status: "running" }
];

const mockStreamPerformanceData = {
  throughput: {
    "1min": 10000,
    "15min": 20000,
    "60min": 30000
  },
  eventRecords: {
    "lastHour": 100000,
    "peak": 200000
  },
  recordCategories: {
    "In": 145200,
    "Out": 142200,
    "Rej.": 2100,
    "Rep.": 890,
    "Cre.": 5400,
    "Dup.": 340,
    "Ret.": 180,
    "Fil.": 980,
    "Sto.": 120,
    "Red.": 450
  }
};

// Chart data for throughput over time
const throughputChartData = [
  { minutes: "1", records: 10000 },
  { minutes: "15", records: 20000 },
  { minutes: "60", records: 30000 }
];

// Chart data for record categories
const recordCategoriesChartData = [
  { category: "In", count: 145200 },
  { category: "Out", count: 142200 },
  { category: "Rej.", count: 2100 },
  { category: "Rep.", count: 890 },
  { category: "Cre.", count: 5400 },
  { category: "Dup.", count: 340 },
  { category: "Ret.", count: 180 },
  { category: "Fil.", count: 980 },
  { category: "Sto.", count: 120 },
  { category: "Red.", count: 450 }
];

export function PerformanceStats({
  throughputLastHour = 520,
  eventsLastHour = 15420,
  eventsLast24h = 348960,
  eventsLast7d = 2443200,
  errorRate = 0.02,
  retryCount = 15
}: PerformanceStatsProps) {

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Latest Throughput Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Latest Throughput (Last Hour)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="minutes" 
                  className="text-muted-foreground"
                  fontSize={12}
                  label={{ value: 'Minutes', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={12}
                  label={{ value: 'Throughput', angle: -90, position: 'insideLeft' }}
                  domain={[0, 30000]}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))'
                  }}
                  formatter={(value) => [`${(value as number).toLocaleString()}`, 'Throughput']}
                  labelFormatter={(label) => `${label} minutes`}
                />
                <Line 
                  type="monotone" 
                  dataKey="records" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Event Records Processed Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Event Records Processed (Last Hour)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recordCategoriesChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="category" 
                  className="text-muted-foreground"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={12}
                  tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value.toString()}
                  label={{ value: 'Number of Records', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))'
                  }}
                  formatter={(value) => [`${(value as number).toLocaleString()}`, 'Records']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Node Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Node Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Node</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Throughput/hr</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Errors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">SFTP Collector</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-success/10 text-success border-success/20">running</Badge>
                  </td>
                  <td className="py-3 px-4">520/hr</td>
                  <td className="py-3 px-4 text-destructive font-medium">2</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">ASCII Decoder</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-success/10 text-success border-success/20">running</Badge>
                  </td>
                  <td className="py-3 px-4">515/hr</td>
                  <td className="py-3 px-4 text-success font-medium">0</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Validation BLN</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-warning/10 text-warning border-warning/20">partial</Badge>
                  </td>
                  <td className="py-3 px-4">412/hr</td>
                  <td className="py-3 px-4 text-destructive font-medium">8</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">FDC Distributor</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-success/10 text-success border-success/20">running</Badge>
                  </td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}