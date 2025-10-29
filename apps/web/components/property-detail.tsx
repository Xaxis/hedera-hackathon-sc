"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyPanel } from "@/components/buy-panel";
import { ActivityTimeline } from "@/components/activity-timeline";
import { DocumentDrawer } from "@/components/document-drawer";
import {
  MapPin,
  TrendingUp,
  Leaf,
  Sun,
  Home,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  FileText,
  ArrowLeft,
  Share,
  Heart,
  X,
  ExternalLink,
} from "lucide-react";

interface Property {
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
  tokenAddress?: string;
  saleContractAddress?: string;
  dividendContractAddress?: string;
}

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

const typeIcons = {
  forest: Leaf,
  solar: Sun,
  "real-estate": Home,
};

const typeColors = {
  forest: "text-green-600",
  solar: "text-yellow-600",
  "real-estate": "text-blue-600",
};

export function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false); // Added state for photo modal
  const [shareSuccess, setShareSuccess] = useState(false); // Added state for share success
  const [downloadingProspectus, setDownloadingProspectus] = useState(false);
  const [schedulingVisit, setSchedulingVisit] = useState(false);
  const [viewingReports, setViewingReports] = useState(false);
  const Icon = typeIcons[property.type];
  const iconColor = typeColors[property.type];
  const ownedPercentage = 100 - property.availableSupply;

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this ${property.type} investment opportunity: ${property.title} in ${property.location}`,
      url: window.location.href,
    };

    try {
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      // If sharing fails, try to copy to clipboard as fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (clipboardError) {
        console.error("Failed to share or copy to clipboard:", clipboardError);
      }
    }
  };

  const handleDownloadProspectus = async () => {
    setDownloadingProspectus(true);
    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create a mock PDF download
      const link = document.createElement("a");
      link.href = "/placeholder.pdf"; // In a real app, this would be the actual PDF URL
      link.download = `${property.title.replace(/\s+/g, "_")}_Prospectus.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download prospectus:", error);
    } finally {
      setDownloadingProspectus(false);
    }
  };

  const handleScheduleVisit = () => {
    setSchedulingVisit(true);
    // Simulate scheduling process
    setTimeout(() => {
      alert(
        `Site visit scheduling for ${property.title} will be available soon. We'll contact you within 24 hours to arrange your visit.`
      );
      setSchedulingVisit(false);
    }, 1000);
  };

  const handleViewReports = () => {
    setViewingReports(true);
    // Simulate loading reports
    setTimeout(() => {
      alert(
        `Financial reports for ${property.title} are being prepared. You'll receive an email with the latest reports within the next hour.`
      );
      setViewingReports(false);
    }, 1000);
  };

  const allImages = [
    {
      src:
        property.image ||
        "/stunning-aerial-view-of-pristine-amazon-rainforest.jpg",
      alt: `${property.title} - Main view`,
    },
    {
      src: "/colorful-exotic-birds-and-wildlife-in-amazon-rainf.jpg",
      alt: "Amazon rainforest wildlife and biodiversity",
    },
    {
      src: "/dense-amazon-rainforest-canopy-from-below--towerin.jpg",
      alt: "Amazon rainforest canopy from ground level",
    },
    {
      src: "/winding-amazon-river-through-rainforest--crystal-c.jpg",
      alt: "Amazon river system through rainforest",
    },
    {
      src: "/conservation-scientists-researching-in-amazon-rain.jpg",
      alt: "Conservation research and protection activities",
    },
    {
      src: "/amazon-rainforest-waterfall-cascading-through-lush.jpg",
      alt: "Amazon rainforest waterfall and natural pools",
    },
    {
      src: "/indigenous-amazon-community-sustainable-practices-.jpg",
      alt: "Indigenous community forest stewardship",
    },
    {
      src: "/amazon-rainforest-at-sunset--golden-hour-lighting-.jpg",
      alt: "Amazon rainforest at golden hour sunset",
    },
  ];

  const mockStats = {
    area: property.area || "1,000 hectares",
    established: property.established || "2023",
    totalShares: property.totalShares || 10000,
    pricePerShare: property.pricePerShare || 250,
    lastDistribution: property.lastDistribution || "$12.50",
    nextDistribution: property.nextDistribution || "Q2 2024",
  };

  return (
    <div className="bg-gradient-to-br from-slate-50/30 via-white to-slate-50/30 min-h-screen">
      <div
        className=" bg-white flex gap-[16px] !pl-7 h-[54px] items-center justify-center px-[48px] py-[10px]"
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="grid grid-cols-4 gap-2 h-64 md:h-80">
                    {/* Main large image */}
                    <div
                      className="col-span-2 relative group cursor-pointer"
                      onClick={() => setShowPhotoModal(true)}
                    >
                      <img
                        src={
                          property.image ||
                          "/stunning-aerial-view-of-pristine-amazon-rainforest.jpg" ||
                          "/colorful-exotic-birds-and-wildlife-in-amazon-rainf.jpg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={property.title}
                        className="w-full h-full object-cover rounded-l-2xl hover:brightness-95 transition-all duration-200"
                      />
                    </div>

                    {/* Grid of smaller images */}
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowPhotoModal(true)}
                      >
                        <img
                          src="/colorful-exotic-birds-and-wildlife-in-amazon-rainf.jpg"
                          alt="Amazon rainforest wildlife and exotic birds"
                          className="w-full h-full object-cover hover:brightness-95 transition-all duration-200"
                        />
                      </div>
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowPhotoModal(true)}
                      >
                        <img
                          src="/dense-amazon-rainforest-canopy-from-below--towerin.jpg"
                          alt="Amazon rainforest canopy from ground level"
                          className="w-full h-full object-cover hover:brightness-95 transition-all duration-200"
                        />
                      </div>
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowPhotoModal(true)}
                      >
                        <img
                          src="/winding-amazon-river-through-rainforest--crystal-c.jpg"
                          alt="Amazon river winding through rainforest"
                          className="w-full h-full object-cover hover:brightness-95 transition-all duration-200"
                        />
                      </div>
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowPhotoModal(true)}
                      >
                        <img
                          src="/conservation-scientists-researching-in-amazon-rain.jpg"
                          alt="Conservation research activities in Amazon"
                          className="w-full h-full object-cover rounded-br-2xl hover:brightness-95 transition-all duration-200"
                        />
                        {/* Show all photos button */}
                        <div className="absolute inset-0 bg-black/20 rounded-br-2xl flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/90 hover:bg-white text-slate-900 font-medium px-4 py-2 rounded-lg shadow-sm backdrop-blur-sm border border-white/20 hover:shadow-md transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              setShowPhotoModal(true);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                              </div>
                              <span className="text-sm">Show all photos</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property type and sustainability badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-lg text-slate-800 font-semibold px-3 py-1.5 rounded-full hover:bg-white/95 transition-all duration-200"
                    >
                      <Icon className={`h-3.5 w-3.5 mr-2 ${iconColor}`} />
                      {property.type === "real-estate"
                        ? "Real Estate"
                        : property.type.charAt(0).toUpperCase() +
                          property.type.slice(1)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50/90 backdrop-blur-lg border border-emerald-200/60 shadow-lg text-emerald-800 font-semibold px-3 py-1.5 rounded-full hover:bg-emerald-50/95 transition-all duration-200"
                    >
                      Sustainability: {property.sustainabilityScore}/100
                    </Badge>
                  </div>
                </div>

                {/* Property Information Section */}
                <div className="p-6 sm:p-8 mt-20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                        {property.title}
                      </h1>
                      <div className="flex items-center text-slate-600 mb-6">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                        <span className="text-base font-medium">
                          {property.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-8">
                      <div className="text-3xl font-bold text-slate-900 mb-1">
                        ${(property.totalValue / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-slate-500 font-medium">
                        Total Value
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed text-base max-w-4xl">
                    {property.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {property.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors px-4 py-2 rounded-full font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 font-semibold">
                  <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
                  Property Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-sm">
                    <div className="text-lg font-semibold text-slate-900">
                      {mockStats.area}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      Total Area
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-sm">
                    <div className="text-lg font-semibold text-slate-900">
                      {mockStats.established}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      Established
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-sm">
                    <div className="text-lg font-semibold text-slate-900">
                      {mockStats.totalShares.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      Total Shares
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-sm">
                    <div className="text-lg font-semibold text-slate-900">
                      ${mockStats.pricePerShare}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      Price per Share
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Contracts */}
            {(property.tokenAddress || property.saleContractAddress || property.dividendContractAddress) && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-slate-900 font-semibold">
                    <FileText className="h-5 w-5 mr-2 text-slate-600" />
                    Smart Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {property.tokenAddress && (
                      <div className="p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-600 mb-2">
                              Equity Token Contract
                            </div>
                            <code className="text-xs bg-white px-3 py-2 rounded border border-slate-200 font-mono block break-all">
                              {property.tokenAddress}
                            </code>
                          </div>
                          <a
                            href={`https://hashscan.io/testnet/contract/${property.tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View on HashScan"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {property.saleContractAddress && (
                      <div className="p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-600 mb-2">
                              PropertySale Contract
                            </div>
                            <code className="text-xs bg-white px-3 py-2 rounded border border-slate-200 font-mono block break-all">
                              {property.saleContractAddress}
                            </code>
                          </div>
                          <a
                            href={`https://hashscan.io/testnet/contract/${property.saleContractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View on HashScan"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {property.dividendContractAddress && (
                      <div className="p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-600 mb-2">
                              DividendDistributor Contract
                            </div>
                            <code className="text-xs bg-white px-3 py-2 rounded border border-slate-200 font-mono block break-all">
                              {property.dividendContractAddress}
                            </code>
                          </div>
                          <a
                            href={`https://hashscan.io/testnet/contract/${property.dividendContractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View on HashScan"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ownership Breakdown */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 font-semibold">
                  <Users className="h-5 w-5 mr-2 text-slate-600" />
                  Ownership Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">
                      Owned by Investors
                    </span>
                    <span className="font-bold text-slate-900">
                      {ownedPercentage}%
                    </span>
                  </div>
                  <Progress value={ownedPercentage} className="h-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">
                      Available for Purchase
                    </span>
                    <span className="font-bold text-emerald-600">
                      {property.availableSupply}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-emerald-50/80 hover:bg-emerald-100/80 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-200 hover:shadow-sm">
                      <div className="text-lg font-bold text-emerald-700">
                        {Math.floor(
                          (ownedPercentage / 100) * mockStats.totalShares
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        Shares Owned
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50/80 hover:bg-blue-100/80 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-sm">
                      <div className="text-lg font-bold text-blue-700">
                        {Math.floor(
                          (property.availableSupply / 100) *
                            mockStats.totalShares
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        Shares Available
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Timeline and Documents */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <Tabs defaultValue="timeline" className="w-full">
                <div className="px-6 pt-6 pb-4">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="timeline"
                      className="rounded-md font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-800 transition-all duration-200"
                    >
                      Activity Timeline
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="rounded-md font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-800 transition-all duration-200"
                    >
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="timeline" className="px-6 pb-6 pt-0">
                  <ActivityTimeline propertyId={property.id} />
                </TabsContent>
                <TabsContent value="documents" className="px-6 pb-6 pt-0">
                  <DocumentDrawer propertyId={property.id} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Buy Panel */}
            <BuyPanel property={property} />

            {/* Yield Information */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm mb-[27px]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 font-semibold">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                  Yield Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="flex justify-between items-center p-4 bg-emerald-50/80 hover:bg-emerald-100/80 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-200">
                  <span className="text-slate-600 font-medium">
                    Expected Annual Yield
                  </span>
                  <span className="text-xl font-bold text-emerald-600">
                    {property.expectedYield}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-lg border border-slate-100 hover:border-slate-200 transition-all duration-200">
                  <span className="text-slate-600 font-medium">
                    Last Distribution
                  </span>
                  <span className="font-semibold text-slate-900">
                    {mockStats.lastDistribution}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-lg border border-slate-100 hover:border-slate-200 transition-all duration-200">
                  <span className="text-slate-600 font-medium">
                    Next Distribution
                  </span>
                  <span className="font-semibold text-slate-900">
                    {mockStats.nextDistribution}
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-600 font-medium mb-3">
                    Distribution History (12 months)
                  </div>
                  <div className="h-32 bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all duration-200">
                    <div className="h-full flex items-end justify-between space-x-1">
                      {/* Mock chart bars */}
                      <div
                        className="flex-1 bg-emerald-100 rounded-t-sm"
                        style={{ height: "60%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-200 rounded-t-sm"
                        style={{ height: "80%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-300 rounded-t-sm"
                        style={{ height: "45%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-200 rounded-t-sm"
                        style={{ height: "70%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-400 rounded-t-sm"
                        style={{ height: "90%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-300 rounded-t-sm"
                        style={{ height: "65%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-200 rounded-t-sm"
                        style={{ height: "55%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-300 rounded-t-sm"
                        style={{ height: "75%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-400 rounded-t-sm"
                        style={{ height: "85%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-500 rounded-t-sm"
                        style={{ height: "95%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-400 rounded-t-sm"
                        style={{ height: "80%" }}
                      ></div>
                      <div
                        className="flex-1 bg-emerald-300 rounded-t-sm"
                        style={{ height: "70%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Jan</span>
                      <span>Jun</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-200 rounded-xl py-3 h-auto font-medium hover:shadow-sm"
                  onClick={handleDownloadProspectus}
                  disabled={downloadingProspectus}
                >
                  <FileText className="h-4 w-4 mr-3 text-slate-500" />
                  {downloadingProspectus
                    ? "Downloading..."
                    : "Download Prospectus"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-200 rounded-xl py-3 h-auto font-medium hover:shadow-sm"
                  onClick={handleScheduleVisit}
                  disabled={schedulingVisit}
                >
                  <Calendar className="h-4 w-4 mr-3 text-slate-500" />
                  {schedulingVisit ? "Scheduling..." : "Schedule Site Visit"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-200 rounded-xl py-3 h-auto font-medium hover:shadow-sm"
                  onClick={handleViewReports}
                  disabled={viewingReports}
                >
                  <DollarSign className="h-4 w-4 mr-3 text-slate-500" />
                  {viewingReports ? "Loading..." : "View Financial Reports"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-full overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">
                {property.title} - Photos
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPhotoModal(false)}
                className="text-white hover:bg-white/10 rounded-full p-2"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
