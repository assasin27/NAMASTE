import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, Users, Database, Activity, Download, RefreshCw } from "lucide-react";

// Mock analytics data
const codingDistributionData = [
  { system: "Ayurveda", namaste: 2456, icd11: 2456, mapped: 2398 },
  { system: "Siddha", namaste: 1234, icd11: 1234, mapped: 1198 },
  { system: "Unani", namaste: 810, icd11: 810, mapped: 789 }
];

const mappingAccuracyData = [
  { name: "High Confidence (90-100%)", value: 65, color: "#10b981" },
  { name: "Medium Confidence (70-89%)", value: 28, color: "#f59e0b" },
  { name: "Low Confidence (50-69%)", value: 7, color: "#ef4444" }
];

const usageStatsData = [
  { month: "Jan", searches: 1200, mappings: 980, downloads: 45 },
  { month: "Feb", searches: 1580, mappings: 1320, downloads: 67 },
  { month: "Mar", searches: 2100, mappings: 1890, downloads: 89 },
  { month: "Apr", searches: 2800, mappings: 2450, downloads: 112 },
  { month: "May", searches: 3200, mappings: 2890, downloads: 134 }
];

const systemMetrics = [
  {
    title: "Total API Calls",
    value: "847K",
    change: "+12%",
    trend: "up",
    icon: Activity
  },
  {
    title: "Active Users",
    value: "2,341",
    change: "+8%",
    trend: "up", 
    icon: Users
  },
  {
    title: "Code Mappings",
    value: "98.2%",
    change: "+2.1%",
    trend: "up",
    icon: Database
  },
  {
    title: "Avg Response Time",
    value: "240ms",
    change: "-15%",
    trend: "down",
    icon: TrendingUp
  }
];

const AnalyticsDashboard = () => {
  return (
    <section id="analytics" className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Analytics & Reporting Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time insights into NAMASTE & ICD-11 integration performance and usage metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="p-6 shadow-medical">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-success' : 'text-primary'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground text-sm">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.trend === 'up' ? 'bg-success/10' : 'bg-primary/10'
                }`}>
                  <metric.icon className={`h-6 w-6 ${
                    metric.trend === 'up' ? 'text-success' : 'text-primary'
                  }`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Analytics */}
        <Card className="shadow-strong">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold text-foreground">System Analytics</h3>
                <Badge variant="secondary" className="status-active">
                  Live Data
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="coding" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="coding">Coding Distribution</TabsTrigger>
                <TabsTrigger value="mapping">Mapping Accuracy</TabsTrigger>
                <TabsTrigger value="usage">Usage Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="coding" className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    NAMASTE to ICD-11 Coding Distribution by System
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={codingDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="system" />
                        <YAxis />
                        <Bar dataKey="namaste" fill="hsl(var(--primary))" name="NAMASTE Codes" />
                        <Bar dataKey="mapped" fill="hsl(var(--accent))" name="Successfully Mapped" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {codingDistributionData.map((system, index) => (
                    <Card key={index} className="p-4 bg-muted/30">
                      <h5 className="font-semibold text-foreground mb-3">{system.system}</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">NAMASTE Codes:</span>
                          <span className="font-medium">{system.namaste.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Mapped to ICD-11:</span>
                          <span className="font-medium">{system.mapped.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Mapping Rate:</span>
                          <Badge className="status-active">
                            {Math.round((system.mapped / system.namaste) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mapping" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-4">
                      Mapping Confidence Distribution
                    </h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mappingAccuracyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {mappingAccuracyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      Mapping Quality Metrics
                    </h4>
                    {mappingAccuracyData.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-foreground">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-foreground">{item.value}%</span>
                            <p className="text-muted-foreground text-sm">of all mappings</p>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Card className="p-4 bg-success/5 border-success/20">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-semibold text-foreground">Overall Accuracy</p>
                          <p className="text-muted-foreground text-sm">
                            93% of mappings have high confidence scores
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    Platform Usage Trends (Last 5 Months)
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageStatsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Line 
                          type="monotone" 
                          dataKey="searches" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Code Searches"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mappings" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          name="Code Mappings"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="downloads" 
                          stroke="hsl(var(--warning))" 
                          strokeWidth={2}
                          name="FHIR Downloads"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <h5 className="font-semibold text-foreground">Code Searches</h5>
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {usageStatsData[usageStatsData.length - 1].searches.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">This month</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <h5 className="font-semibold text-foreground">Code Mappings</h5>
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {usageStatsData[usageStatsData.length - 1].mappings.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">This month</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <h5 className="font-semibold text-foreground">FHIR Downloads</h5>
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {usageStatsData[usageStatsData.length - 1].downloads}
                    </p>
                    <p className="text-muted-foreground text-sm">This month</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;