"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Upload, CheckCircle, Building2, DollarSign, Leaf, ImageIcon, Trash2, Coins, ExternalLink } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useHederaWallet } from "@/context/hedera-wallet-context"
import { useWallet } from "@/context/wallet-context"

interface PropertyFormData {
  title: string
  location: string
  type: string
  description: string
  totalValue: string
  totalShares: string
  expectedYield: string
  sustainabilityScore: string
  tags: string[]
  area: string
  imageUrl: string
  images: File[]
  tokenId: string
}

export function CreatePropertyForm() {
  const { user, wallet, isAuthenticated, connectWallet } = useAuth()
  const { isConnected: hederaConnected, connect: connectHederaWallet, error: hederaError } = useHederaWallet()
  const { account: walletAccount, provider: walletProvider, connect: connectMetaMask } = useWallet()
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    location: "",
    type: "",
    description: "",
    totalValue: "",
    totalShares: "",
    expectedYield: "",
    sustainabilityScore: "",
    tags: [],
    area: "",
    imageUrl: "",
    images: [],
    tokenId: "",
  })

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 10), // Max 10 images
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('🚀 Starting property creation...');
    console.log('📊 Wallet state:', { walletAccount, isAuthenticated, hederaConnected });

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      console.log('🚀 Creating property (contracts will be deployed on backend)...');

      // Upload images first if any
      let uploadedImageUrl = formData.imageUrl;
      if (formData.images.length > 0) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.images[0]); // Use first image as main image
        
        const token = localStorage.getItem('hedera-auth-token');
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedImageUrl = uploadResult.imageUrl;
        } else {
          console.warn('Image upload failed, using provided URL or placeholder');
        }
      }

      // Deploy contracts from frontend using MetaMask
      console.log('🚀 Starting contract deployments from frontend...');
      console.log('📋 Property details:', {
        title: formData.title,
        totalShares: formData.totalShares,
        totalValue: formData.totalValue,
        pricePerShare: parseFloat(formData.totalValue) / parseInt(formData.totalShares)
      });

      // Check if MetaMask is available
      if (!walletProvider) {
        throw new Error('Please connect your MetaMask wallet first');
      }

      const { ethers } = await import('ethers');
      const signer = walletProvider.getSigner();

      // Import contract ABIs
      const PropertySaleABI = await import('@/lib/contracts/PropertySale.json');
      const DividendDistributorABI = await import('@/lib/contracts/DividendDistributor.json');

      const pricePerShare = parseFloat(formData.totalValue) / parseInt(formData.totalShares);
      const saleDuration = 30 * 24 * 60 * 60; // 30 days in seconds

      // Deploy PropertySale contract
      console.log('📝 Step 1/2: Deploying PropertySale Contract...');
      const PropertySaleFactory = new ethers.ContractFactory(
        PropertySaleABI.abi,
        PropertySaleABI.bytecode,
        signer
      );

      const propertySale = await PropertySaleFactory.deploy(
        formData.tokenId,
        ethers.utils.parseEther(pricePerShare.toString()),
        parseInt(formData.totalShares),
        saleDuration
      );

      await propertySale.deployed();
      const saleAddress = propertySale.address;
      console.log('✅ PropertySale deployed:', saleAddress);

      // Deploy DividendDistributor contract
      console.log('📝 Step 2/2: Deploying DividendDistributor Contract...');
      const DividendDistributorFactory = new ethers.ContractFactory(
        DividendDistributorABI.abi,
        DividendDistributorABI.bytecode,
        signer
      );

      const dividendDistributor = await DividendDistributorFactory.deploy(formData.tokenId);
      await dividendDistributor.deployed();
      const dividendAddress = dividendDistributor.address;
      console.log('✅ DividendDistributor deployed:', dividendAddress);

      const tokenAddress = formData.tokenId;

      console.log('✅ All 3 contracts deployed successfully!');
      console.log('📄 Token address:', tokenAddress);
      console.log('📄 Sale contract address:', saleAddress);
      console.log('📄 Dividend contract address:', dividendAddress);

      // Call the API to create the property with real contract addresses
      const token = localStorage.getItem('hedera-auth-token');
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.title,
          location: formData.location,
          description: formData.description,
          totalShares: parseInt(formData.totalShares),
          pricePerShare: parseFloat(formData.totalValue) / parseInt(formData.totalShares),
          tokenId: tokenAddress, // Real token address
          saleContractAddress: saleAddress, // Real sale contract address
          dividendContractAddress: dividendAddress, // Real dividend contract address
          type: formData.type,
          image: uploadedImageUrl || "/placeholder.svg",
          expectedYield: parseFloat(formData.expectedYield) || 8.5,
          sustainabilityScore: parseInt(formData.sustainabilityScore) || 85,
          tags: formData.tags,
          area: formData.area,
          established: new Date().getFullYear().toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again or reconnect your wallet.');
        }
        throw new Error(error.error || 'Failed to create property');
      }

      const result = await response.json();

      setSubmitStatus("success")
      setIsSubmitting(false)

      // Reset form after success
      setTimeout(() => {
        setSubmitStatus("idle")
        setFormData({
          title: "",
          location: "",
          type: "",
          description: "",
          totalValue: "",
          totalShares: "",
          expectedYield: "",
          sustainabilityScore: "",
          tags: [],
          area: "",
          imageUrl: "",
          images: [],
          tokenId: "",
        })
      }, 3000)
    } catch (error) {
      console.error('❌ Property creation error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide helpful error messages
        if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
          errorMessage = 'Transaction rejected in MetaMask. Please try again and approve all 3 transactions.';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient HBAR balance. You need ~10 HBAR to deploy all contracts. Get testnet HBAR from portal.hedera.com';
        } else if (errorMessage.includes('Asset Tokenization SDK not available')) {
          errorMessage = 'Failed to load Hedera SDK. Please refresh the page and try again.';
        } else if (errorMessage.includes('MetaMask not available')) {
          errorMessage = 'MetaMask not detected. Please install MetaMask extension and refresh the page.';
        }
      }

      alert(`Failed to create property: ${errorMessage}`);
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  }

  const isFormValid =
    formData.title &&
    formData.location &&
    formData.type &&
    formData.totalValue &&
    formData.totalShares &&
    formData.tokenId

  if (submitStatus === "success") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Property Listed Successfully!</h3>
          <p className="text-green-700 mb-4">
            {formData.title} has been added to the marketplace with {formData.totalShares} shares available for
            investment.
          </p>
          <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
            Property ID: PROP-{Date.now()}
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Authentication Status */}
      {!isAuthenticated && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Coins className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Authentication Required</h3>
                <p className="text-sm text-orange-700">
                  Please connect your wallet or log in to create a property.
                </p>
              </div>
              <Button 
                onClick={() => connectWallet('metamask')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Connect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-8 py-8 text-[rgba(255,255,255,1)] bg-[rgba(255,255,255,1)]">
        <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-3 bg-emerald-500 rounded-2xl">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          List New Property
        </CardTitle>
        <p className="text-slate-600 mt-2 text-lg">Add a new real-world asset to the marketplace</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Coins className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Equity Token</h3>
            </div>
            <div className="rounded-2xl p-6 space-y-4 bg-white border-2 border-emerald-200">
              <div className="space-y-3">
                <Label htmlFor="tokenId" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  Equity Token ID *
                  <Badge className="bg-emerald-600 text-white px-2 py-1 text-xs font-semibold">REQUIRED</Badge>
                </Label>
                <Input
                  id="tokenId"
                  value={formData.tokenId}
                  onChange={(e) => handleInputChange("tokenId", e.target.value)}
                  placeholder="Enter the Token ID of your Equity Token (e.g., 0x1234...)"
                  required
                  className="h-14 text-lg font-semibold border-2 border-emerald-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 bg-white shadow-md placeholder:text-emerald-400 text-emerald-800"
                />
                <p className="text-sm text-emerald-700 font-medium bg-emerald-100 p-3 rounded-lg border border-emerald-200">
                  💡 This Token ID must match an existing Equity Token created in the "Create Equity Token" tab.
                  This links your property listing to the tokenized shares.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <Building2 className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Basic Information</h3>
            </div>
            <div className="rounded-2xl p-6 space-y-6 bg-[rgba(255,255,255,1)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-semibold text-slate-700">
                    Property Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Amazon Rainforest Conservation"
                    required
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-base font-semibold text-slate-700">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Brazil"
                    required
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="type" className="text-base font-semibold text-slate-700">
                    Property Type *
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forest">Forest Conservation</SelectItem>
                      <SelectItem value="solar">Solar Energy</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="area" className="text-base font-semibold text-slate-700">
                    Area/Size
                  </Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="e.g., 1,000 hectares"
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the property and its investment potential..."
                  rows={4}
                  className="text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-[rgba(241,245,249,1)]">
                <DollarSign className="h-5 w-5 text-[rgba(69,85,108,1)]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Financial Information</h3>
            </div>
            <div className="rounded-2xl p-6 space-y-6 bg-[rgba(255,255,255,1)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="totalValue" className="text-base font-semibold text-slate-700">
                    Total Property Value ($) *
                  </Label>
                  <Input
                    id="totalValue"
                    type="number"
                    value={formData.totalValue}
                    onChange={(e) => handleInputChange("totalValue", e.target.value)}
                    placeholder="2,500,000"
                    required
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="totalShares" className="text-base font-semibold text-slate-700">
                    Total Shares *
                  </Label>
                  <Input
                    id="totalShares"
                    type="number"
                    value={formData.totalShares}
                    onChange={(e) => handleInputChange("totalShares", e.target.value)}
                    placeholder="10,000"
                    required
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="expectedYield" className="text-base font-semibold text-slate-700">
                    Expected Yield (%)
                  </Label>
                  <Input
                    id="expectedYield"
                    type="number"
                    step="0.1"
                    value={formData.expectedYield}
                    onChange={(e) => handleInputChange("expectedYield", e.target.value)}
                    placeholder="8.5"
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {formData.totalValue && formData.totalShares && (
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
                  <div className="text-sm font-medium text-slate-600 mb-2">Price per share:</div>
                  <div className="text-3xl font-bold text-emerald-600">
                    ${(Number.parseInt(formData.totalValue) / Number.parseInt(formData.totalShares)).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-[rgba(241,245,249,1)]">
                <Leaf className="h-5 w-5 text-[rgba(69,85,108,1)]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Images & Details</h3>
            </div>
            <div className="rounded-2xl p-6 space-y-6 bg-background">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="sustainabilityScore" className="text-base font-semibold text-slate-700">
                    Sustainability Score (0-100)
                  </Label>
                  <Input
                    id="sustainabilityScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.sustainabilityScore}
                    onChange={(e) => handleInputChange("sustainabilityScore", e.target.value)}
                    placeholder="95"
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="imageUrl" className="text-base font-semibold text-slate-700">
                    Image URL (Optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-slate-700">
                  Property Images (Max 10 images, 10MB each)
                </Label>

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-700 mb-2">Drop images here or click to browse</p>
                      <p className="text-sm text-slate-500">Supports JPG, PNG, GIF up to 10MB each</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-12 px-6 rounded-xl border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <p className="text-xs text-slate-500 mt-2 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-slate-700">Tags</Label>
                <div className="flex gap-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="h-12 text-base border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    className="h-12 px-6 rounded-xl border-slate-300 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-white border-slate-300 rounded-xl"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="min-w-[240px] h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-3" />
                  Listing Property...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-3" />
                  List Property
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
