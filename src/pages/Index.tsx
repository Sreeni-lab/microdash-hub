import { useState, useMemo, useEffect } from "react";
import { SummaryTiles } from "@/components/dashboard/SummaryTiles";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { SecurityScanModal } from "@/components/dashboard/SecurityScanModal";
import { ComponentsList } from "@/components/dashboard/ComponentsList";
import { useServices } from "@/contexts/ServicesContext";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
const Index = () => {
  type ScannerCounts = {
    [component: string]: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  const [twistlockCounts, setTwistlockCounts] = useState<ScannerCounts>({});
  const [sysdigCounts, setSysdigCounts] = useState<ScannerCounts>({});

  const { services } = useServices();
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showComponentsList, setShowComponentsList] = useState(false);
  const [componentsListData, setComponentsListData] = useState<{
    title: string;
    components: string[];
    status: any;
  }>({ title: "", components: [], status: "healthy" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewScanDetails = (scan: any) => {
    setSelectedScan(scan);
    setShowScanModal(true);
  };

  const handlePieClick = (data: any) => {
    if (data && data.components) {
      setComponentsListData({
        title: data.name,
        components: data.components,
        status: data.name.toLowerCase().includes('pass') ? 'passed' :
          data.name.toLowerCase().includes('fail') ? 'failed' :
            data.name.toLowerCase().includes('unreachable') ? 'unreachable' : 'healthy'
      });
      setShowComponentsList(true);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch Twistlock and Sysdig counts after services is available
  useEffect(() => {
    async function fetchScannerCounts() {
      const twistlockResults: ScannerCounts = {};
      const sysdigResults: ScannerCounts = {};
      await Promise.all(
        services.map(async (service) => {
          try {
            const twistlockRes = await fetch(`https://sampleapi.com/twistlock/${service.name}/counts`);
            const twistlockData = await twistlockRes.json();
            twistlockResults[service.name] = twistlockData;
          } catch {
            twistlockResults[service.name] = { critical: 0, high: 0, medium: 0, low: 0 };
          }
          try {
            const sysdigRes = await fetch(`https://sampleapi.com/sysdig/${service.name}/counts`);
            const sysdigData = await sysdigRes.json();
            sysdigResults[service.name] = sysdigData;
          } catch {
            sysdigResults[service.name] = { critical: 0, high: 0, medium: 0, low: 0 };
          }
        })
      );
      setTwistlockCounts(twistlockResults);
      setSysdigCounts(sysdigResults);
    }
    if (services.length > 0) {
      fetchScannerCounts();
    }
  }, [services]);

  // Generate dynamic dashboard data based on current services
  const [sanityResults, setSanityResults] = useState({
    sanityPassed: 0,
    sanityFailed: 0,
    sanityPending: 0
  });

  useEffect(() => {
    fetch('https://sampleapi.com/sanity-results')
      .then(res => res.json())
      .then(data => {
        setSanityResults({
          sanityPassed: data.sanityPassed,
          sanityFailed: data.sanityFailed,
          sanityPending: data.sanityPending
        });
      })
      .catch(() => {
        setSanityResults({ sanityPassed: 0, sanityFailed: 0, sanityPending: 0 });
      });
  }, []);

  const dashboardData = useMemo(() => {
    const healthyServices = services.filter(s => s.status === "healthy");
    const failedServices = services.filter(s => s.status === "failed");
    const unreachableServices = services.filter(s => s.status === "unreachable");

    function getUniqueScans(scans) {
      const seen = new Set();
      return scans.filter(scan => {
        const key = `${scan.scanner}-${scan.reportUrl || ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    const summaryData = {
      healthy: healthyServices.length,
      failed: failedServices.length,
      unreachable: unreachableServices.length,
      sanityPassed: sanityResults.sanityPassed,
      sanityFailed: sanityResults.sanityFailed,
      twistlockCriticalHigh: Object.values(twistlockCounts).reduce((sum, c) => sum + (c?.critical ?? 0) + (c?.high ?? 0), 0),
      sysdigCriticalHigh: Object.values(sysdigCounts).reduce((sum, c) => sum + (c?.critical ?? 0) + (c?.high ?? 0), 0)
    };

    const healthData = [
      {
        name: "Healthy",
        value: healthyServices.length,
        color: "hsl(var(--status-healthy))",
        components: healthyServices.map(s => s.name)
      },
      {
        name: "Failed",
        value: failedServices.length,
        color: "hsl(var(--status-failed))",
        components: failedServices.map(s => s.name)
      },
      {
        name: "Unreachable",
        value: unreachableServices.length,
        color: "hsl(var(--status-unreachable))",
        components: unreachableServices.map(s => s.name)
      }
    ];

    const vulnerabilityData = services.map(service => {
      // Use fetched counts from APIs
      const twistlock = twistlockCounts[service.name] ?? { critical: 0, high: 0, medium: 0, low: 0 };
      const sysdig = sysdigCounts[service.name] ?? { critical: 0, high: 0, medium: 0, low: 0 };
      return {
        component: service.name,
        critical: (twistlock.critical ?? 0) + (sysdig.critical ?? 0),
        high: (twistlock.high ?? 0) + (sysdig.high ?? 0),
        medium: (twistlock.medium ?? 0) + (sysdig.medium ?? 0),
        low: (twistlock.low ?? 0) + (sysdig.low ?? 0)
      };
    });

    return { summaryData, healthData, vulnerabilityData };
  }, [services, sanityResults]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Documentum Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Application health, security monitoring & sanity testing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Configure button removed */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Summary Tiles */}
        <SummaryTiles data={dashboardData.summaryData} />

        {/* Charts Section */}
        <ChartsSection
          healthData={dashboardData.healthData}
          sanityData={[]}
          vulnerabilityData={dashboardData.vulnerabilityData}
          onPieClick={handlePieClick}
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={index}
              name={service.name}
              status={service.status}
              version={service.version}
              serviceUrl={service.serviceUrl}
              credentialsUrl={service.credentialsUrl}
              username={service.username}
              password={service.password}
              containerImages={service.containerImages}
              securityScans={service.securityScans}
              twistlockCounts={twistlockCounts[service.name]}
              sysdigCounts={sysdigCounts[service.name]}
              onViewScanDetails={handleViewScanDetails}
            />
          ))}
        </div>

        {filteredServices.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <SecurityScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        scan={selectedScan}
      />

      <ComponentsList
        isOpen={showComponentsList}
        onClose={() => setShowComponentsList(false)}
        title={componentsListData.title}
        components={componentsListData.components}
        status={componentsListData.status}
      />

      {/* ConfigurationModal removed */}
    </div>
  );
};

export default Index;
