"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Replaced PropertyCard with InvestmentCard
import InvestmentCard from "@/components/InvestmentCard";
import { PropertyDetail } from "@/components/property-detail";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWallet } from "@/context/wallet-context";
import {
  Search,
  MapPin,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  Building,
  Wallet,
} from "lucide-react";

const mockProperties = [
  {
    id: "1",
    title: "Amazon Rainforest Conservation",
    location: "Brazil",
    type: "forest",
    image: "/lush-amazon-rainforest-canopy-aerial-view.jpg",
    availableSupply: 25,
    expectedYield: 8.5,
    totalValue: 2500000,
    sustainabilityScore: 92,
    tags: ["Carbon Credits", "Biodiversity", "REDD+"],
    description:
      "1,000 hectares of pristine Amazon rainforest for conservation and carbon credit generation.",
    status: "open", // added status for Open/Closed filter
    revenueGenerated: null, // added revenue tracking for sold properties
  },
  {
    id: "2",
    title: "Solar Farm Texas",
    location: "Texas, USA",
    type: "solar",
    image: "/large-solar-panel-farm-desert-landscape.jpg",
    availableSupply: 40,
    expectedYield: 12.3,
    totalValue: 5000000,
    sustainabilityScore: 88,
    tags: ["Clean Energy", "Grid Connected", "Tax Credits"],
    description:
      "50MW solar installation with 25-year power purchase agreement.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "3",
    title: "Sustainable Office Complex",
    location: "Copenhagen, Denmark",
    type: "real-estate",
    image: "/modern-sustainable-office-building-green-architect.jpg",
    availableSupply: 15,
    expectedYield: 6.8,
    totalValue: 8000000,
    sustainabilityScore: 90,
    tags: ["LEED Platinum", "Net Zero", "ESG Compliant"],
    description:
      "LEED Platinum certified office complex with net-zero energy consumption.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "4",
    title: "Mangrove Restoration Project",
    location: "Philippines",
    type: "forest",
    image: "/mangrove-forest-restoration-coastal-wetlands.jpg",
    availableSupply: 60,
    expectedYield: 7.2,
    totalValue: 1200000,
    sustainabilityScore: 85,
    tags: ["Blue Carbon", "Coastal Protection", "Community Impact"],
    description:
      "500 hectares of mangrove restoration for coastal protection and carbon sequestration.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "5",
    title: "Wind Farm Scotland",
    location: "Scotland, UK",
    type: "solar",
    image: "/wind-turbines-scottish-highlands-renewable-energy.jpg",
    availableSupply: 0, // sold out property
    expectedYield: 9.8,
    totalValue: 3500000,
    sustainabilityScore: 87,
    tags: ["Offshore Wind", "Grid Connected", "Long-term PPA"],
    description:
      "25 turbine offshore wind farm with 20-year power purchase agreement.",
    status: "closed", // closed status for sold out
    revenueGenerated: 420000, // added revenue for sold property
  },
  {
    id: "6",
    title: "Green Residential Development",
    location: "Vancouver, Canada",
    type: "real-estate",
    image: "/sustainable-residential-development-green-building.jpg",
    availableSupply: 20,
    expectedYield: 5.5,
    totalValue: 6500000,
    sustainabilityScore: 89,
    tags: ["Passive House", "Affordable Housing", "Community Solar"],
    description:
      "120-unit residential development with passive house standards and community amenities.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "7",
    title: "Sahara Solar Complex",
    location: "Morocco",
    type: "solar",
    image: "/massive-solar-panel-installation-in-sahara-desert-.jpg",
    availableSupply: 35,
    expectedYield: 11.2,
    totalValue: 4200000,
    sustainabilityScore: 84,
    tags: ["Desert Solar", "Grid Export", "MENA Region"],
    description:
      "75MW concentrated solar power plant in the Sahara with molten salt storage technology.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "8",
    title: "Kenyan Wildlife Conservancy",
    location: "Kenya",
    type: "forest",
    image: "/african-savanna-wildlife-conservancy-with-acacia-t.jpg",
    availableSupply: 45,
    expectedYield: 6.8,
    totalValue: 1800000,
    sustainabilityScore: 91,
    tags: ["Wildlife Protection", "Eco-Tourism", "Carbon Offset"],
    description:
      "15,000 hectare wildlife conservancy supporting local communities and endangered species protection.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "9",
    title: "Mumbai Smart Office Tower",
    location: "Mumbai, India",
    type: "real-estate",
    image: "/modern-smart-office-tower-mumbai-india-with-glass-.jpg",
    availableSupply: 25,
    expectedYield: 8.9,
    totalValue: 12000000,
    sustainabilityScore: 86,
    tags: ["Smart Building", "LEED Gold", "Tech Hub"],
    description:
      "40-story smart office tower with AI-powered building management and rooftop solar installation.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "10",
    title: "Australian Wind Farm",
    location: "South Australia",
    type: "solar",
    image: "/wind-turbines-on-rolling-hills-south-australia-out.jpg",
    availableSupply: 30,
    expectedYield: 10.5,
    totalValue: 5500000,
    sustainabilityScore: 83,
    tags: ["Onshore Wind", "Battery Storage", "Grid Stabilization"],
    description:
      "150MW wind farm with integrated battery storage system for grid stability and peak demand.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "11",
    title: "Indonesian Peatland Restoration",
    location: "Borneo, Indonesia",
    type: "forest",
    image: "/tropical-peatland-forest-restoration-borneo-indone.jpg",
    availableSupply: 55,
    expectedYield: 7.8,
    totalValue: 2200000,
    sustainabilityScore: 88,
    tags: ["Peatland Restoration", "REDD+", "Biodiversity Hotspot"],
    description:
      "8,000 hectares of critical peatland restoration preventing CO2 emissions and protecting orangutan habitat.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "12",
    title: "Dubai Green District",
    location: "Dubai, UAE",
    type: "real-estate",
    image: "/futuristic-sustainable-district-dubai-uae-with-gre.jpg",
    availableSupply: 15,
    expectedYield: 9.2,
    totalValue: 15000000,
    sustainabilityScore: 89,
    tags: ["Net Zero", "Smart City", "Desert Architecture"],
    description:
      "Mixed-use sustainable district with net-zero energy buildings and integrated renewable systems.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "13",
    title: "Chilean Lithium Solar Farm",
    location: "Atacama, Chile",
    type: "solar",
    image: "/solar-panels-in-atacama-desert-chile-with-mountain.jpg",
    availableSupply: 40,
    expectedYield: 13.1,
    totalValue: 3800000,
    sustainabilityScore: 82,
    tags: ["High Altitude Solar", "Mining Integration", "Lithium Processing"],
    description:
      "100MW solar installation powering sustainable lithium extraction operations in the Atacama Desert.",
    status: "open",
    revenueGenerated: null,
  },
  {
    id: "14",
    title: "Norwegian Fjord Hydroelectric",
    location: "Bergen, Norway",
    type: "solar",
    image: "/small-hydroelectric-dam-in-norwegian-fjord-with-mo.jpg",
    availableSupply: 0,
    expectedYield: 8.7,
    totalValue: 4500000,
    sustainabilityScore: 80,
    tags: ["Hydroelectric", "Fjord Power", "Grid Export"],
    description:
      "25MW run-of-river hydroelectric facility harnessing fjord waterfall energy with minimal environmental impact.",
    status: "closed",
    revenueGenerated: 380000,
  },
  {
    id: "15",
    title: "Japanese Vertical Farm",
    location: "Tokyo, Japan",
    type: "real-estate",
    image: "/modern-vertical-farm-building-tokyo-japan-with-led.jpg",
    availableSupply: 20,
    expectedYield: 7.4,
    totalValue: 8500000,
    sustainabilityScore: 87,
    tags: ["Vertical Farming", "Urban Agriculture", "Food Security"],
    description:
      "12-story vertical farm producing 500 tons of vegetables annually using 95% less water than traditional farming.",
    status: "open",
    revenueGenerated: null,
  },
];

export function Marketplace() {
  const isMobile = useIsMobile();
  const { account, connecting, connect } = useWallet();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [yieldRange, setYieldRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // Align selectedProperty type with PropertyDetail's expected interface
  const [selectedProperty, setSelectedProperty] = useState<
    | ({
        id: string;
        title: string;
        location: string;
        type: "forest" | "solar" | "real-estate";
        image: string;
        availableSupply: number;
        expectedYield: number;
        totalValue: number;
        sustainabilityScore: number;
        tags: string[];
        description: string;
        area?: string;
        established?: string;
        totalShares?: number;
        pricePerShare?: number;
        lastDistribution?: string;
        nextDistribution?: string;
      } & { status?: string; revenueGenerated?: number | null })
    | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State to track which selectors are open
  const [openSelectors, setOpenSelectors] = useState({
    category: false,
    region: false,
    yield: false,
    status: false,
  });

  // Only fetch properties when wallet is connected
  useEffect(() => {
    const fetchProperties = async () => {
      if (!account) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Fetched properties:', data.properties?.length || 0, 'properties');
          console.log('📋 Properties:', data.properties);
          setProperties(data.properties || []);
        } else {
          console.error('❌ Failed to fetch properties:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Failed to fetch properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [account]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || property.type === selectedCategory;
    const matchesRegion =
      selectedRegion === "all" ||
      property.location.includes(selectedRegion) ||
      (selectedRegion === "Africa" &&
        (property.location.includes("Morocco") ||
          property.location.includes("Kenya"))) ||
      (selectedRegion === "Middle East" &&
        (property.location.includes("Dubai") ||
          property.location.includes("UAE"))) ||
      (selectedRegion === "Oceania" &&
        property.location.includes("Australia")) ||
      (selectedRegion === "Asia" &&
        (property.location.includes("India") ||
          property.location.includes("Indonesia") ||
          property.location.includes("Japan"))) ||
      (selectedRegion === "Americas" &&
        (property.location.includes("Chile") ||
          property.location.includes("Canada") ||
          property.location.includes("Brazil"))) ||
      (selectedRegion === "Europe" &&
        (property.location.includes("Norway") ||
          property.location.includes("Denmark") ||
          property.location.includes("Scotland")));
    const matchesYield =
      yieldRange === "all" ||
      (yieldRange === "low" && (property.expectedYield || 0) < 7) ||
      (yieldRange === "medium" &&
        (property.expectedYield || 0) >= 7 &&
        (property.expectedYield || 0) < 10) ||
      (yieldRange === "high" && (property.expectedYield || 0) >= 10);
    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesRegion &&
      matchesYield &&
      matchesStatus
    );
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case "search":
        setSearchTerm(value);
        break;
      case "category":
        setSelectedCategory(value);
        break;
      case "region":
        setSelectedRegion(value);
        break;
      case "yield":
        setYieldRange(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
    }
  };

  const handleViewDetail = (property: (typeof mockProperties)[0]) => {
    // Cast to the stricter type expected by PropertyDetail
    setSelectedProperty({
      ...property,
      type: property.type as "forest" | "solar" | "real-estate",
    });
  };

  const handleBackToMarketplace = () => {
    setSelectedProperty(null);
  };

  if (selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        onBack={handleBackToMarketplace}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      <div
        className=" bg-white flex gap-[16px] h-[54px] items-center justify-center px-[48px] py-[10px]"
        style={{
          display: "flex",
          height: "54px",
          padding: "10px 48px",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(46, 46, 46, 0.05)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute border-[0px_0px_1px] border-[rgba(46,46,46,0.05)] border-solid inset-0 pointer-events-none"
        />
        <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.6025 1.614C8.7217 1.5395 8.85944 1.5 9 1.5C9.14057 1.5 9.2783 1.5395 9.3975 1.614L14.5755 4.85025L9 8.13L3.4245 4.85025L8.6025 1.614ZM2.256 5.90325C2.25192 5.93534 2.24991 5.96766 2.25 6V12C2.25 12.1272 2.28236 12.2523 2.34402 12.3636C2.40568 12.4748 2.49463 12.5686 2.6025 12.636L8.25 16.1655V9.429L2.256 5.90325ZM9.75 16.1655L15.3975 12.636C15.5054 12.5686 15.5943 12.4748 15.656 12.3636C15.7176 12.2523 15.75 12.1272 15.75 12V6C15.75 5.9675 15.748 5.93525 15.744 5.90325L9.75 9.42825V16.1655Z" fill="black"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M8.6025 1.614C8.7217 1.5395 8.85944 1.5 9 1.5C9.14057 1.5 9.2783 1.5395 9.3975 1.614L14.5755 4.85025L9 8.13L3.4245 4.85025L8.6025 1.614ZM2.256 5.90325C2.25192 5.93534 2.24991 5.96766 2.25 6V12C2.25 12.1272 2.28236 12.2523 2.34402 12.3636C2.40568 12.4748 2.49463 12.5686 2.6025 12.636L8.25 16.1655V9.429L2.256 5.90325ZM9.75 16.1655L15.3975 12.636C15.5054 12.5686 15.5943 12.4748 15.656 12.3636C15.7176 12.2523 15.75 12.1272 15.75 12V6C15.75 5.9675 15.748 5.93525 15.744 5.90325L9.75 9.42825V16.1655Z" fill="url(#paint0_linear_64_47)"></path>
              <defs>
                <linearGradient id="paint0_linear_64_47" x1="9" y1="1.5" x2="9" y2="16.1655" gradientUnits="userSpaceOnUse">
                  <stop></stop>
                  <stop offset="1" stopColor="#666666"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#0a0d14] text-[16px]">
            Marketplace
          </p>
        </div>
      </div>
      
      {/* Wallet Connection Prompt */}
      {!account && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
              <Wallet className="h-16 w-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                Connect Your Wallet
              </h3>
              <p className="text-slate-500 text-lg mb-6">
                Please connect your wallet to view and invest in sustainable properties.
              </p>
              <Button
                onClick={connect}
                disabled={connecting}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md shadow-emerald-500/25"
              >
                {connecting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when wallet is connected */}
      {account && (
        <section className={`${isMobile ? 'p-4' : 'p-6 px-10'} space-y-6`}>
          <div className={`flex flex-col ${isMobile ? 'gap-4' : 'lg:flex-row gap-6'} items-center`}>
          <div className={`relative flex-1 ${isMobile ? 'w-full' : 'min-w-[320px]'}`}>
            <div
              className="flex items-center transition focus-within:border-slate-300 focus-within:shadow"
              style={{
                height: isMobile ? "44px" : "34px",
                borderRadius: "6px",
                gap: "10px",
                transform: "rotate(0deg)",
                opacity: 1,
                paddingTop: isMobile ? "10px" : "6px",
                paddingRight: isMobile ? "8px" : "5px",
                paddingBottom: isMobile ? "10px" : "6px",
                paddingLeft: isMobile ? "12px" : "10px",
                background: "#F5F5F5",
                boxShadow: "0px 0px 0px 1px #0000000D",
              }}
            >
              <Search className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-slate-400`} aria-hidden="true" />
              <input
                placeholder="Search everything..."
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className={`flex-1 bg-transparent ${isMobile ? 'text-base' : 'text-sm'} text-slate-600 placeholder:text-slate-400 focus:outline-none`}
                aria-label="Search marketplace"
              />
              {!isMobile && (
                <kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col w-full gap-3' : 'flex-wrap gap-[17px]'}`}>
            <Select
              value={selectedCategory}
              onValueChange={(value) => handleFilterChange("category", value)}
              onOpenChange={(open) =>
                setOpenSelectors((prev) => ({ ...prev, category: open }))
              }
            >
              <SelectTrigger
                className={`relative rounded-[6px] px-[10px] py-[6px] ${isMobile ? 'w-full min-w-0' : 'min-w-[109px]'} ${isMobile ? 'h-[44px]' : 'h-[34px]'} transition-all duration-200 ${
                  openSelectors.category
                    ? "bg-[#20232d] text-white border border-[#20232d]"
                    : selectedCategory !== "all"
                      ? "bg-[#20232d] text-white border border-[#20232d]"
                      : "bg-white border border-[rgba(0,0,0,0.09)]"
                }`}
                style={{
                  height: isMobile ? "44px" : "34px",
                  borderRadius: "6px",
                  gap: "8px",
                  transform: "rotate(0deg)",
                  opacity: 1,
                  paddingTop: isMobile ? "10px" : "6px",
                  paddingRight: isMobile ? "12px" : "10px",
                  paddingBottom: isMobile ? "10px" : "6px",
                  paddingLeft: isMobile ? "12px" : "10px",
                  borderWidth: "1px",
                  ...(openSelectors.category && {
                    background: "var(--bg-surface-700, #20232D)",
                    border: "1px solid var(--bg-surface-700, #20232D)",
                  }),
                }}
              >
                <div className="flex items-center gap-[8px]">
                  <Building className="h-3 w-3 text-[#868c98]" />
                  <SelectValue
                    placeholder="Assets"
                    className={`font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-nowrap whitespace-pre ${
                      openSelectors.category
                        ? "text-[#0a0d14]"
                        : "text-[#0a0d14]"
                    }`}
                    style={{
                      color: openSelectors.category
                        ? "var(--icon-strong-900, #0A0D14)"
                        : "var(--icon-strong-900, #0A0D14)",
                      fontFeatureSettings: "'liga' off, 'calt' off",
                      fontFamily: "Inter",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "20px",
                    }}
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white p-2">
                <SelectItem value="all" className="rounded-xl">
                  All Assets
                </SelectItem>
                <SelectItem value="forest" className="rounded-xl">
                  🌲 Forest
                </SelectItem>
                <SelectItem value="solar" className="rounded-xl">
                  ⚡ Energy
                </SelectItem>
                <SelectItem value="real-estate" className="rounded-xl">
                  🏢 Real Estate
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedRegion}
              onValueChange={(value) => handleFilterChange("region", value)}
              onOpenChange={(open) =>
                setOpenSelectors((prev) => ({ ...prev, region: open }))
              }
            >
              <SelectTrigger
                className={`relative rounded-[6px] px-[10px] py-[6px] ${isMobile ? 'w-full min-w-0' : 'min-w-[129px]'} ${isMobile ? 'h-[44px]' : 'h-[34px]'} transition-all duration-200 ${
                  openSelectors.region
                    ? "bg-[#20232d] text-white border border-[#20232d]"
                    : selectedRegion !== "all"
                      ? "bg-[#20232d] text-white border border-[#20232d]"
                      : "bg-white border border-[rgba(0,0,0,0.09)]"
                }`}
                style={{
                  height: isMobile ? "44px" : "34px",
                  borderRadius: "6px",
                  gap: "8px",
                  transform: "rotate(0deg)",
                  opacity: 1,
                  paddingTop: isMobile ? "10px" : "6px",
                  paddingRight: isMobile ? "12px" : "10px",
                  paddingBottom: isMobile ? "10px" : "6px",
                  paddingLeft: isMobile ? "12px" : "10px",
                  borderWidth: "1px",
                  ...(openSelectors.region && {
                    background: "var(--bg-surface-700, #20232D)",
                    border: "1px solid var(--bg-surface-700, #20232D)",
                  }),
                }}
              >
                <div className="flex items-center gap-[8px]">
                  <MapPin className="h-3 w-3 text-[#868c98]" />
                  <SelectValue
                    placeholder="Locations"
                    className={`font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-nowrap whitespace-pre ${
                      openSelectors.region ? "text-[#0a0d14]" : "text-[#0a0d14]"
                    }`}
                    style={{
                      color: openSelectors.region
                        ? "var(--icon-strong-900, #0A0D14)"
                        : "var(--icon-strong-900, #0A0D14)",
                      fontFeatureSettings: "'liga' off, 'calt' off",
                      fontFamily: "Inter",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "20px",
                    }}
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white p-2">
                <SelectItem value="all" className="rounded-xl">
                  All Locations
                </SelectItem>
                <SelectItem value="USA" className="rounded-xl">
                  🇺🇸 USA
                </SelectItem>
                <SelectItem value="Europe" className="rounded-xl">
                  🇪🇺 Europe
                </SelectItem>
                <SelectItem value="Asia" className="rounded-xl">
                  🌏 Asia
                </SelectItem>
                <SelectItem value="Americas" className="rounded-xl">
                  🌎 Americas
                </SelectItem>
                <SelectItem value="Africa" className="rounded-xl">
                  🌍 Africa
                </SelectItem>
                <SelectItem value="Middle East" className="rounded-xl">
                  🕌 Middle East
                </SelectItem>
                <SelectItem value="Oceania" className="rounded-xl">
                  🏝️ Oceania
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={yieldRange}
              onValueChange={(value) => handleFilterChange("yield", value)}
              onOpenChange={(open) =>
                setOpenSelectors((prev) => ({ ...prev, yield: open }))
              }
            >
              <SelectTrigger
                className={`relative rounded-[6px] px-[10px] py-[6px] ${isMobile ? 'w-full min-w-0' : 'min-w-[107px]'} ${isMobile ? 'h-[44px]' : 'h-[34px]'} transition-all duration-200 ${
                  openSelectors.yield
                    ? "bg-[#20232d] text-white border border-[#20232d]"
                    : yieldRange !== "all"
                      ? "bg-[#20232d] text-white border border-[#20232d]"
                      : "bg-white border border-[rgba(0,0,0,0.09)]"
                }`}
                style={{
                  height: isMobile ? "44px" : "34px",
                  borderRadius: "6px",
                  gap: "8px",
                  transform: "rotate(0deg)",
                  opacity: 1,
                  paddingTop: isMobile ? "10px" : "6px",
                  paddingRight: isMobile ? "12px" : "10px",
                  paddingBottom: isMobile ? "10px" : "6px",
                  paddingLeft: isMobile ? "12px" : "10px",
                  borderWidth: "1px",
                  ...(openSelectors.yield && {
                    background: "var(--bg-surface-700, #20232D)",
                    border: "1px solid var(--bg-surface-700, #20232D)",
                  }),
                }}
              >
                <div className="flex items-center gap-[8px]">
                  <TrendingUp className="h-3 w-3 text-[#868c98]" />
                  <SelectValue
                    placeholder="Yields"
                    className={`font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-nowrap whitespace-pre ${
                      openSelectors.yield ? "text-[#0a0d14]" : "text-[#0a0d14]"
                    }`}
                    style={{
                      color: openSelectors.yield
                        ? "var(--icon-strong-900, #0A0D14)"
                        : "var(--icon-strong-900, #0A0D14)",
                      fontFeatureSettings: "'liga' off, 'calt' off",
                      fontFamily: "Inter",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "20px",
                    }}
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white p-2">
                <SelectItem value="all" className="rounded-xl">
                  All Yields
                </SelectItem>
                <SelectItem value="low" className="rounded-xl">
                  📈 Under 7%
                </SelectItem>
                <SelectItem value="medium" className="rounded-xl">
                  📊 7% - 10%
                </SelectItem>
                <SelectItem value="high" className="rounded-xl">
                  🚀 Over 10%
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => handleFilterChange("status", value)}
              onOpenChange={(open) =>
                setOpenSelectors((prev) => ({ ...prev, status: open }))
              }
            >
              <SelectTrigger
                className={`relative rounded-[6px] px-[10px] py-[6px] ${isMobile ? 'w-full min-w-0' : 'min-w-[109px]'} ${isMobile ? 'h-[44px]' : 'h-[34px]'} transition-all duration-200 ${
                  openSelectors.status
                    ? "bg-[#20232d] text-white border border-[#20232d]"
                    : statusFilter !== "all"
                      ? "bg-[#20232d] text-white border border-[#20232d]"
                      : "bg-white border border-[rgba(0,0,0,0.09)]"
                }`}
                style={{
                  height: isMobile ? "44px" : "34px",
                  borderRadius: "6px",
                  gap: "8px",
                  transform: "rotate(0deg)",
                  opacity: 1,
                  paddingTop: isMobile ? "10px" : "6px",
                  paddingRight: isMobile ? "12px" : "10px",
                  paddingBottom: isMobile ? "10px" : "6px",
                  paddingLeft: isMobile ? "12px" : "10px",
                  borderWidth: "1px",
                  ...(openSelectors.status && {
                    background: "var(--bg-surface-700, #20232D)",
                    border: "1px solid var(--bg-surface-700, #20232D)",
                  }),
                }}
              >
                <div className="flex items-center gap-[8px]">
                  <Activity className="h-3 w-3 text-[#868c98]" />
                  <SelectValue
                    placeholder="Status"
                    className={`font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-nowrap whitespace-pre ${
                      openSelectors.status ? "text-[#0a0d14]" : "text-[#0a0d14]"
                    }`}
                    style={{
                      color: openSelectors.status
                        ? "var(--icon-strong-900, #0A0D14)"
                        : "var(--icon-strong-900, #0A0D14)",
                      fontFeatureSettings: "'liga' off, 'calt' off",
                      fontFamily: "Inter",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "20px",
                    }}
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white p-2">
                <SelectItem value="all" className="rounded-xl">
                  All Status
                </SelectItem>
                <SelectItem value="open" className="rounded-xl">
                  🟢 Open
                </SelectItem>
                <SelectItem value="closed" className="rounded-xl">
                  🔴 Closed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-600">Loading properties...</p>
            </div>
          </div>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
          {paginatedProperties.map((property) => {
            const apy = `${property.expectedYield || 8.5}% APY`;
            const totalValue = property.totalShares * property.pricePerShare;
            const value = `$${(totalValue / 1_000_000).toFixed(1)}M`;
            const category =
              property.type === "real-estate"
                ? "Real Estate"
                : property.type === "forest"
                ? "Forest"
                : property.type === "solar"
                ? "Energy"
                : "Other";
            const availableShares = property.availableShares || property.totalShares || 1000;
            const totalShares = property.totalShares || 1000;
            const availablePercentage = (availableShares / totalShares) * 100;
            const availability = `${availablePercentage.toFixed(0)}% available`;
            const ownership = `${(100 - availablePercentage).toFixed(0)}% owned`;
            const status = property.status === "closed" || availableShares === 0 ? "Closed" : "Open";
            
            return (
              <div
                key={property._id || property.id}
                onClick={() => handleViewDetail({
                  ...property,
                  id: property._id || property.id,
                  title: property.name,
                  availableSupply: availablePercentage,
                  totalValue: totalValue,
                  tokenAddress: property.tokenAddress,
                  saleContractAddress: property.saleContractAddress,
                  dividendContractAddress: property.dividendContractAddress,
                  totalShares: property.totalShares,
                  pricePerShare: property.pricePerShare,
                })}
                className="focus:outline-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleViewDetail({
                      ...property,
                      id: property._id || property.id,
                      title: property.name,
                      availableSupply: availablePercentage,
                      totalValue: totalValue,
                      tokenAddress: property.tokenAddress,
                      saleContractAddress: property.saleContractAddress,
                      dividendContractAddress: property.dividendContractAddress,
                      totalShares: property.totalShares,
                      pricePerShare: property.pricePerShare,
                    });
                  }
                }}
              >
                <InvestmentCard
                  id={Number(property._id || property.id)}
                  image={property.image || "/placeholder.svg"}
                  location={property.location}
                  title={property.name}
                  description={property.description}
                  category={category}
                  apy={apy}
                  value={value}
                  status={status}
                  availability={availability}
                  ownership={ownership}
                />
              </div>
            );
          })}
          </div>
        )}

        {filteredProperties.length > itemsPerPage && (
          <div className={`flex justify-center items-center ${isMobile ? 'mt-8' : 'mt-16'}`}>
            <div className={`flex items-center gap-1 bg-white rounded-2xl ${isMobile ? 'p-1' : 'p-2'} shadow-lg border border-slate-100/50 backdrop-blur-sm`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded-xl ${isMobile ? 'h-12 w-12' : 'h-10 w-10'} p-0 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200`}
              >
                <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-slate-600`} />
              </Button>

              <div className={`flex items-center gap-1 ${isMobile ? 'mx-1' : 'mx-2'}`}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-xl ${isMobile ? 'h-12 min-w-[48px] px-4' : 'h-10 min-w-[40px] px-3'} font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`rounded-xl ${isMobile ? 'h-12 w-12' : 'h-10 w-10'} p-0 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200`}
              >
                <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-slate-600`} />
              </Button>
            </div>
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 max-w-md mx-auto shadow-sm border border-slate-100">
              <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                No properties found
              </h3>
              <p className="text-slate-500 text-lg">
                {properties.length === 0 
                  ? "No properties have been created yet. Create your first property to get started!"
                  : "Try adjusting your search criteria or filters."
                }
              </p>
            </div>
          </div>
        )}
        </section>
      )}
    </div>
  );
}
