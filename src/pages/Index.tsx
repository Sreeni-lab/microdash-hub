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
  const [twistlockVulnerabilityData, setTwistlockVulnerabilityData] = useState([]);
  const [sysdigVulnerabilityData, setSysdigVulnerabilityData] = useState([]);
  const [sysdigCounts, setSysdigCounts] = useState<ScannerCounts>({});

  // Build service cards from twistlock/sysdig data
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showComponentsList, setShowComponentsList] = useState(false);
  const [componentsListData, setComponentsListData] = useState<{
    title: string;
    components: string[];
    status: any;
  }>({ title: "", components: [], status: "healthy" });
  const [searchQuery, setSearchQuery] = useState("");

  // Service grouping and health check mapping
  const serviceGroupMap = [
    { images: ['ot-dctm-client-classic'], name: 'Documentum Client', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/D2', health: 'D2', username: 'researchuser1', password: 'Password@123' },
    { images: ['ot-dctm-client-config'], name: 'Documentum Config', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/D2-Config', health: 'D2-Config', username: 'configuser1', password: 'Password@123' },
    { images: ['ot-dctm-reports-base', 'ot-dctm-reports-client', 'ot-dctm-reports-installer'], name: 'Documentum Reports', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/dtr', health: 'dtr', username: 'configuser1', password: 'Password@123' },
    { images: ['ot-dctm-client-rest'], name: 'Documentum Client Rest', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/d2-rest', health: 'd2-rest', username: 'researchuser1', password: 'Password@123' },
    { images: ['ot-dctm-client-smartview'], name: 'Documentum Smartview', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/D2-Smartview', health: 'D2-Smartview', username: 'researchuser1', password: 'Password@123' },
    { images: ['ot-dctm-admin-console'], name: 'Documentum AdminConsole', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/AdminConsole', health: 'AdminConsole', username: 'configuser1', password: 'Password@123' },
    { images: ['ot-dctm-server'], name: 'Documentum Server', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/DmMethods/servlet/DoMethod', health: 'DmMethods', username: 'NA', password: 'NA' },
    { images: ['ot-dctm-dfs'], name: 'DFS', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/dfs/services/core/QueryService?wsdl', health: 'dfs', username: 'NA', password: 'NA' },
    { images: ['ot-dctm-admin'], name: 'Documentum Administrator', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/da', health: 'da', username: 'configuser1', password: 'Password@123' },
    { images: ['ot-dctm-bps'], name: 'BPS', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/bps', health: 'bps', username: 'NA', password: 'NA' },
    { images: ['ot-dctm-cmis'], name: 'CMIS', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/dctm-cmis', health: 'dctm-cmis', username: 'dmadmin', password: 'password' },
    { images: ['ot-dctm-content-connect', 'ot-dctm-content-connect-dbinit'], name: 'Content Connect', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/cc/admin', health: 'cc', username: 'SystemAdmin', password: 'SystemAdmin@123' },
    { images: ['ot-dctm-content-fetcher', 'ot-dctm-index-agent', 'ot-dctm-search-admin', 'ot-dctm-search-agent', 'ot-dctm-search-parser', 'ot-dctm-solr', 'ot-dctm-zk-status-checker', 'ot-coresearch-api', 'ot-coresearch-indexer'], name: 'Documentum Search', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/admin', health: 'admin', username: 'configuser1', password: 'Password@123' },
    { images: ['ot-dctm-dcc-consul', 'ot-dctm-dcc-corenotificationservice', 'ot-dctm-dcc-darinitcontainer', 'ot-dctm-dcc-dbschema', 'ot-dctm-dcc-mailservice', 'ot-dctm-dcc-metadataservice', 'ot-dctm-dcc-syncagent', 'ot-dctm-dcc-syncnshare-manual'], name: 'DCC', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/syncagent', health: 'syncagent', username: 'Administrator', password: 'Administrator' },
    { images: ['ot-dctm-dms'], name: 'DMS', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/dctm-dms', health: 'dctm-dms', username: 'NA', password: 'NA' },
    { images: ['ot-dctm-records', 'ot-dctm-records-darinstallation', 'ot-dctm-rqm'], name: 'Documentum Records', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/records', health: 'records', username: 'configuser1', password: 'Password@123' },
    { images: ['ot-dctm-rest'], name: 'Documentum Rest', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/dctm-rest', health: 'dctm-rest', username: 'researchuser1', password: 'Password@123' },
    { images: ['ot-dctm-smartviewm365', 'ot-dctm-smartviewm365customjar', 'ot-dctm-smartviewm365-ns'], name: 'M365', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/SmartViewM365', health: 'SmartViewM365', username: 'NA', password: 'NA' },
    { images: ['ot-dctm-workflow-designer'], name: 'Documentum Workflow Designer', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/DocumentumWorkflowDesigner', health: 'DocumentumWorkflowDesigner', username: 'researchuser1', password: 'Password@123' },
    { images: ['ot-dctm-xda'], name: 'XDA', url: 'https://otdctm-documentum.terrarium.documentum-qe.net/xda', health: 'xda', username: 'admin', password: 'adminPass1' }
  ];

  // Helper to get all scan data by image name
  const getScanDataByImage = (imageName) => {
    const twistlock = twistlockVulnerabilityData.find(item => item.component.split('/').pop() === imageName);
    const sysdig = sysdigVulnerabilityData.find(item => item.component.split('/').pop() === imageName);
    return { twistlock, sysdig };
  };

  // Health check state
  const [healthStatuses, setHealthStatuses] = useState({});

  useEffect(() => {
    // Fetch health for each service group using the actual health check URL
    serviceGroupMap.forEach(group => {
      fetch(`http://localhost:3001/api/health-check?url=${encodeURIComponent(group.url)}`)
        .then(res => res.json())
        .then(data => {
          console.log('Health check for', group.name, 'returned:', data);
          let status = 'unreachable';
          const httpStatus = typeof data.httpStatus !== 'undefined'
            ? (typeof data.httpStatus === 'string' ? parseInt(data.httpStatus, 10) : data.httpStatus)
            : (typeof data.status === 'string' ? parseInt(data.status, 10) : data.status);
          if (httpStatus === 200) status = 'healthy';
          else if (httpStatus === 503 || httpStatus === 500) status = 'failed';
          else status = 'unreachable';
          setHealthStatuses(prev => ({ ...prev, [group.name]: status }));
        })
        .catch((err) => {
          console.error('Health check error for', group.name, err);
          setHealthStatuses(prev => ({ ...prev, [group.name]: 'unreachable' }));
        });
    });
  }, [twistlockVulnerabilityData, sysdigVulnerabilityData]);

  // Build grouped service cards
  const serviceCards = useMemo(() => {
    return serviceGroupMap.map(group => {
      // Gather all images for this group
      const images = group.images.map(img => {
        const scanData = getScanDataByImage(img);
        return {
          name: img,
          size: '',
          efficiency: '',
          twistlockReportUrl: scanData.twistlock?.link || '',
          sysdigReportUrl: scanData.sysdig?.link || ''
        };
      });
      // Aggregate vulnerability counts for the group
      const twistlockCounts = images.reduce((acc, img) => {
        const scanData = getScanDataByImage(img.name);
        acc.critical += scanData.twistlock?.critical || 0;
        acc.high += scanData.twistlock?.high || 0;
        acc.medium += scanData.twistlock?.medium || 0;
        acc.low += scanData.twistlock?.low || 0;
        return acc;
      }, { critical: 0, high: 0, medium: 0, low: 0 });
      const sysdigCounts = images.reduce((acc, img) => {
        const scanData = getScanDataByImage(img.name);
        acc.critical += scanData.sysdig?.critical || 0;
        acc.high += scanData.sysdig?.high || 0;
        acc.medium += scanData.sysdig?.medium || 0;
        acc.low += scanData.sysdig?.low || 0;
        return acc;
      }, { critical: 0, high: 0, medium: 0, low: 0 });
      // Use health status from state
      const status = healthStatuses[group.name] || 'unreachable';
      return {
        name: group.name,
        version: '',
        twistlockCounts,
        sysdigCounts,
        status,
        serviceUrl: group.url,
        credentialsUrl: '',
        username: group.username,
        password: group.password,
        containerImages: images,
        securityScans: [],
        tag: '',
        link: images[0]?.twistlockReportUrl || images[0]?.sysdigReportUrl || ''
      };
    });
  }, [twistlockVulnerabilityData, sysdigVulnerabilityData, healthStatuses]);

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

  const filteredServices = serviceCards.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch Twistlock vulnerability data from backend
  useEffect(() => {
    fetch('http://localhost:3001/twistlock_report')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          component: item.image,
          critical: item.summary.critical,
          high: item.summary.high,
          medium: item.summary.medium,
          low: item.summary.low,
          link: item.link
        }));
        setTwistlockVulnerabilityData(mapped);
      });
  }, []);

  // Fetch Sysdig vulnerability data from backend
  useEffect(() => {
    fetch('http://localhost:3001/sysdig_report')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          component: item.image,
          critical: item.summary.critical,
          high: item.summary.high,
          medium: item.summary.medium,
          low: item.summary.low,
          link: item.link
        }));
        setSysdigVulnerabilityData(mapped);
      });
  }, []);

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
    // Group service cards by status
    const healthyServices = serviceCards.filter(s => s.status === 'healthy');
    const failedServices = serviceCards.filter(s => s.status === 'failed');
    const unreachableServices = serviceCards.filter(s => s.status === 'unreachable');
    const summaryData = {
      healthy: healthyServices.length,
      failed: failedServices.length,
      unreachable: unreachableServices.length,
      sanityPassed: sanityResults.sanityPassed,
      sanityFailed: sanityResults.sanityFailed,
      twistlockCriticalHigh: serviceCards.reduce((sum, s) => sum + (s.twistlockCounts.critical ?? 0) + (s.twistlockCounts.high ?? 0), 0),
      sysdigCriticalHigh: serviceCards.reduce((sum, s) => sum + (s.sysdigCounts.critical ?? 0) + (s.sysdigCounts.high ?? 0), 0)
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

    // Bar graph data for Twistlock and Sysdig, grouped by service card
    const twistlockBarData = serviceCards.map(service => ({
      component: service.name,
      critical: service.twistlockCounts.critical ?? 0,
      high: service.twistlockCounts.high ?? 0,
      medium: service.twistlockCounts.medium ?? 0,
      low: service.twistlockCounts.low ?? 0
    }));
    const sysdigBarData = serviceCards.map(service => ({
      component: service.name,
      critical: service.sysdigCounts.critical ?? 0,
      high: service.sysdigCounts.high ?? 0,
      medium: service.sysdigCounts.medium ?? 0,
      low: service.sysdigCounts.low ?? 0
    }));

    return { summaryData, healthData, twistlockBarData, sysdigBarData };
  }, [serviceCards, sanityResults]);

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
          twistlockVulnerabilityData={dashboardData.twistlockBarData}
          sysdigVulnerabilityData={dashboardData.sysdigBarData}
          onPieClick={handlePieClick}
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div id={`service-card-${service.name.replace(/\s+/g, '-')}`}>
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
                twistlockCounts={service.twistlockCounts}
                sysdigCounts={service.sysdigCounts}
                twistlockVulnerabilityData={twistlockVulnerabilityData}
                sysdigVulnerabilityData={sysdigVulnerabilityData}
                onViewScanDetails={handleViewScanDetails}
              />
            </div>
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
