"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Coins, FileText, Shield } from "lucide-react";

interface EquityTokenForm {
  // Create Equity
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
  isin: string;

  // Specific Details
  nominalValue: string;
  currency: string;
  numberOfShares: string;
  totalValue: string;
  chosenRights: string[];
  dividendType: string;

  // Regulation
  regulationType: string;
  regulationSubType: string;
  blockedCountries: string[];
}

const RIGHTS_OPTIONS = [
  "Voting Rights",
  "Liquidation Rights",
  "Information Rights",
  "Conversion Rights",
  "Put Right",
];

const DIVIDEND_TYPES = [
  "Fixed Dividend",
  "Variable Dividend",
  "Cumulative Dividend",
  "Non-Cumulative Dividend",
];

const REGULATION_TYPES = [
  "Regulation D",
  "Regulation S",
  "Regulation A+",
  "Regulation CF",
];

const REGULATION_SUB_TYPES = [
  "506(b)",
  "506(c)",
  "Rule 144A",
  "Tier I",
  "Tier II",
];

const COUNTRIES = [
  "United States",
  "China",
  "Russia",
  "Iran",
  "North Korea",
  "Syria",
  "Cuba",
];

export function CreateEquityTokenForm() {
  const [formData, setFormData] = useState<EquityTokenForm>({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: "18",
    isin: "",
    nominalValue: "",
    currency: "USD",
    numberOfShares: "",
    totalValue: "",
    chosenRights: [],
    dividendType: "",
    regulationType: "",
    regulationSubType: "",
    blockedCountries: [],
  });

  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof EquityTokenForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRightsChange = (right: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      chosenRights: checked
        ? [...prev.chosenRights, right]
        : prev.chosenRights.filter((r) => r !== right),
    }));
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      blockedCountries: checked
        ? [...prev.blockedCountries, country]
        : prev.blockedCountries.filter((c) => c !== country),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tokenName) newErrors.tokenName = "Token name is required";
    if (!formData.tokenSymbol)
      newErrors.tokenSymbol = "Token symbol is required";
    if (!formData.isin) newErrors.isin = "ISIN is required";
    if (!formData.nominalValue)
      newErrors.nominalValue = "Nominal value is required";
    if (!formData.numberOfShares)
      newErrors.numberOfShares = "Number of shares is required";
    if (!formData.totalValue) newErrors.totalValue = "Total value is required";
    if (formData.chosenRights.length === 0)
      newErrors.chosenRights = "At least one right must be selected";
    if (!formData.dividendType)
      newErrors.dividendType = "Dividend type is required";
    if (!formData.regulationType)
      newErrors.regulationType = "Regulation type is required";
    if (!formData.regulationSubType)
      newErrors.regulationSubType = "Regulation sub-type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateToken = async () => {
    if (!validateForm()) return;

    setIsCreating(true);

    try {
      // Check if wallet is connected
      const { ethereum } = window as any;
      if (!ethereum) {
        alert('Please install MetaMask to create equity tokens');
        setIsCreating(false);
        return;
      }

      // Import ethers
      const { ethers } = await import('ethers');
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      console.log('🚀 Deploying equity token from frontend...');
      console.log('📋 Token details:', {
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        totalShares: formData.numberOfShares,
        isin: formData.isin,
        nominalValue: formData.nominalValue,
        currency: formData.currency,
        rights: formData.chosenRights,
      });

      // Import the EquityToken contract ABI and bytecode
      const EquityTokenABI = await import('@/lib/contracts/EquityToken.json');

      console.log('📝 Deploying EquityToken contract...');

      // Prepare rights array
      const rights = [
        formData.chosenRights.includes('Voting Rights'),
        formData.chosenRights.includes('Information Rights'),
        formData.chosenRights.includes('Liquidation Rights'),
        formData.chosenRights.includes('Subscription Rights'),
        formData.chosenRights.includes('Conversion Rights'),
        formData.chosenRights.includes('Redemption Rights'),
        formData.chosenRights.includes('Put Rights'),
        formData.chosenRights.includes('Dividend Rights'),
      ];

      // Create contract factory
      const TokenFactory = new ethers.ContractFactory(
        EquityTokenABI.abi,
        EquityTokenABI.bytecode,
        signer
      );

      // Deploy the token with all parameters
      const token = await TokenFactory.deploy(
        formData.tokenName,
        formData.tokenSymbol,
        formData.numberOfShares,
        formData.isin,
        ethers.utils.parseEther(formData.nominalValue), // Convert to wei
        formData.currency,
        rights
      );

      console.log('⏳ Waiting for deployment confirmation...');
      await token.deployed();

      const tokenAddress = token.address;
      const evmTokenAddress = token.address;
      const transactionHash = token.deployTransaction.hash;

      console.log('✅ Token deployed successfully!');
      console.log('📄 Token address:', tokenAddress);
      console.log('📄 Transaction hash:', transactionHash);

      alert(
        `Equity token created successfully!\n\nToken Address: ${tokenAddress}\n\nYou can view it on HashScan: https://hashscan.io/testnet/contract/${tokenAddress}`
      );

      // Reset form
      setFormData({
        tokenName: "",
        tokenSymbol: "",
        tokenDecimals: "18",
        isin: "",
        nominalValue: "",
        currency: "USD",
        numberOfShares: "",
        totalValue: "",
        chosenRights: [],
        dividendType: "",
        regulationType: "",
        regulationSubType: "",
        blockedCountries: [],
      });
    } catch (error) {
      console.error("Error creating token:", error);
      alert(`Failed to create equity token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Coins className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Create Equity Token
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Configure and deploy a new equity token on the blockchain
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Equity Section */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Coins className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Create Equity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="tokenName"
                className="text-sm font-medium text-slate-700"
              >
                Token Name
              </Label>
              <Input
                id="tokenName"
                value={formData.tokenName}
                onChange={(e) => handleInputChange("tokenName", e.target.value)}
                placeholder="e.g., Amazon Rainforest Conservation"
                className={`rounded-xl border-slate-200 ${errors.tokenName ? "border-red-300" : ""}`}
              />
              {errors.tokenName && (
                <p className="text-red-500 text-xs">{errors.tokenName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tokenSymbol"
                className="text-sm font-medium text-slate-700"
              >
                Token Symbol
              </Label>
              <Input
                id="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={(e) =>
                  handleInputChange("tokenSymbol", e.target.value.toUpperCase())
                }
                placeholder="e.g., ARC"
                className={`rounded-xl border-slate-200 ${errors.tokenSymbol ? "border-red-300" : ""}`}
                maxLength={10}
              />
              {errors.tokenSymbol && (
                <p className="text-red-500 text-xs">{errors.tokenSymbol}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tokenDecimals"
                className="text-sm font-medium text-slate-700"
              >
                Token Decimals
              </Label>
              <Select
                value={formData.tokenDecimals}
                onValueChange={(value) =>
                  handleInputChange("tokenDecimals", value)
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="isin"
                className="text-sm font-medium text-slate-700"
              >
                ISIN
              </Label>
              <Input
                id="isin"
                value={formData.isin}
                onChange={(e) =>
                  handleInputChange("isin", e.target.value.toUpperCase())
                }
                placeholder="e.g., US1234567890"
                className={`rounded-xl border-slate-200 ${errors.isin ? "border-red-300" : ""}`}
                maxLength={12}
              />
              {errors.isin && (
                <p className="text-red-500 text-xs">{errors.isin}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Specific Details Section */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Specific Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="nominalValue"
                  className="text-sm font-medium text-slate-700"
                >
                  Nominal Value
                </Label>
                <Input
                  id="nominalValue"
                  type="number"
                  value={formData.nominalValue}
                  onChange={(e) =>
                    handleInputChange("nominalValue", e.target.value)
                  }
                  placeholder="1.00"
                  className={`rounded-xl border-slate-200 ${errors.nominalValue ? "border-red-300" : ""}`}
                />
                {errors.nominalValue && (
                  <p className="text-red-500 text-xs">{errors.nominalValue}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="currency"
                  className="text-sm font-medium text-slate-700"
                >
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="HBAR">HBAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="numberOfShares"
                  className="text-sm font-medium text-slate-700"
                >
                  Number of Shares
                </Label>
                <Input
                  id="numberOfShares"
                  type="number"
                  value={formData.numberOfShares}
                  onChange={(e) =>
                    handleInputChange("numberOfShares", e.target.value)
                  }
                  placeholder="1000"
                  className={`rounded-xl border-slate-200 ${errors.numberOfShares ? "border-red-300" : ""}`}
                />
                {errors.numberOfShares && (
                  <p className="text-red-500 text-xs">
                    {errors.numberOfShares}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="totalValue"
                  className="text-sm font-medium text-slate-700"
                >
                  Total Value
                </Label>
                <Input
                  id="totalValue"
                  type="number"
                  value={formData.totalValue}
                  onChange={(e) =>
                    handleInputChange("totalValue", e.target.value)
                  }
                  placeholder="100000"
                  className={`rounded-xl border-slate-200 ${errors.totalValue ? "border-red-300" : ""}`}
                />
                {errors.totalValue && (
                  <p className="text-red-500 text-xs">{errors.totalValue}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Chosen Rights
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {RIGHTS_OPTIONS.map((right) => (
                  <div key={right} className="flex items-center space-x-2">
                    <Checkbox
                      id={right}
                      checked={formData.chosenRights.includes(right)}
                      onCheckedChange={(checked) =>
                        handleRightsChange(right, checked as boolean)
                      }
                    />
                    <Label htmlFor={right} className="text-sm text-slate-600">
                      {right}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.chosenRights && (
                <p className="text-red-500 text-xs">{errors.chosenRights}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dividendType"
                className="text-sm font-medium text-slate-700"
              >
                Dividend Type
              </Label>
              <Select
                value={formData.dividendType}
                onValueChange={(value) =>
                  handleInputChange("dividendType", value)
                }
              >
                <SelectTrigger
                  className={`rounded-xl border-slate-200 ${errors.dividendType ? "border-red-300" : ""}`}
                >
                  <SelectValue placeholder="Select dividend type" />
                </SelectTrigger>
                <SelectContent>
                  {DIVIDEND_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dividendType && (
                <p className="text-red-500 text-xs">{errors.dividendType}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulation Section */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Regulation
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="regulationType"
                  className="text-sm font-medium text-slate-700"
                >
                  Regulation Type
                </Label>
                <Select
                  value={formData.regulationType}
                  onValueChange={(value) =>
                    handleInputChange("regulationType", value)
                  }
                >
                  <SelectTrigger
                    className={`rounded-xl border-slate-200 ${errors.regulationType ? "border-red-300" : ""}`}
                  >
                    <SelectValue placeholder="Select regulation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGULATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regulationType && (
                  <p className="text-red-500 text-xs">
                    {errors.regulationType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="regulationSubType"
                  className="text-sm font-medium text-slate-700"
                >
                  Regulation Sub-type
                </Label>
                <Select
                  value={formData.regulationSubType}
                  onValueChange={(value) =>
                    handleInputChange("regulationSubType", value)
                  }
                >
                  <SelectTrigger
                    className={`rounded-xl border-slate-200 ${errors.regulationSubType ? "border-red-300" : ""}`}
                  >
                    <SelectValue placeholder="Select regulation sub-type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGULATION_SUB_TYPES.map((subType) => (
                      <SelectItem key={subType} value={subType}>
                        {subType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regulationSubType && (
                  <p className="text-red-500 text-xs">
                    {errors.regulationSubType}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Blocked Countries
              </Label>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={country}
                      checked={formData.blockedCountries.includes(country)}
                      onCheckedChange={(checked) =>
                        handleCountryChange(country, checked as boolean)
                      }
                    />
                    <Label htmlFor={country} className="text-sm text-slate-600">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary and Action */}
      <Card className="shadow-sm rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                Ready to Create Token?
              </h3>
              <p className="text-slate-600 text-sm">
                Review your configuration and click create to deploy your equity
                token on the blockchain.
              </p>
              {formData.chosenRights.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.chosenRights.map((right) => (
                    <Badge
                      key={right}
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    >
                      {right}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                // Auto-compute total value if missing
                if (
                  !formData.totalValue &&
                  formData.numberOfShares &&
                  formData.nominalValue
                ) {
                  const total =
                    Number(formData.numberOfShares) *
                    Number(formData.nominalValue);
                  if (!Number.isNaN(total)) {
                    handleInputChange("totalValue", total.toString());
                  }
                }
                handleCreateToken();
              }}
              disabled={
                isCreating || !formData.tokenName || !formData.tokenSymbol
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-sm transition-all duration-200 min-w-[200px]"
            >
              {isCreating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Creating Token...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Equity Token
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
