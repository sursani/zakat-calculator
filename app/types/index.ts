// Family Member Types
export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'primary' | 'spouse' | 'child';
  isPubescent?: boolean; // Only relevant for children
}

// Base Asset Type
export interface BaseAsset {
  id: string;
  ownerId: string;
  type: string;
  description: string;
  isJoint: boolean;
  ownershipPercentage: number; // 1-100
  jointOwnerId?: string; // ID of the joint owner (another family member or "external")
  jointOwnerName?: string; // Optional name for external joint owners
}

// Cash Asset Type
export interface CashAsset extends BaseAsset {
  type: 'cash';
  amount: number;
  currency: string;
}

// Gold Asset Type
export interface GoldAsset extends BaseAsset {
  type: 'gold';
  weightInGrams: number;
  karat: number; // 10, 14, 18, 21, 22, 24
}

// Silver Asset Type
export interface SilverAsset extends BaseAsset {
  type: 'silver';
  weightInGrams: number;
  purity: number; // Percentage (e.g., 92.5 for sterling silver)
}

// Investment Asset Type
export interface InvestmentAsset extends BaseAsset {
  type: 'investment';
  currentValue: number;
  assetClass: 'stocks' | 'bonds' | 'mutual_funds' | 'etfs' | 'crypto' | 'other';
  zakatable: boolean;
}

// Real Estate Asset Type
export interface RealEstateAsset extends BaseAsset {
  type: 'real_estate';
  currentValue: number;
  propertyType: 'residential' | 'commercial' | 'land' | 'other';
  isForInvestment: boolean; // If true, it's zakatable
}

// Business Asset Type
export interface BusinessAsset extends BaseAsset {
  type: 'business';
  inventoryValue: number;
  cashValue: number;
  receivablesValue: number;
  liabilities: number;
}

// Debt Type
export interface Debt {
  id: string;
  ownerId: string;
  description: string;
  amount: number;
  isShortTerm: boolean; // Short-term debts are deductible
}

// Combined Asset Type
export type Asset = 
  | CashAsset 
  | GoldAsset 
  | SilverAsset 
  | InvestmentAsset 
  | RealEstateAsset 
  | BusinessAsset;

// Zakat Calculation Result
export interface ZakatCalculation {
  familyMemberId: string;
  totalAssetValue: number;
  totalDeductibleDebt: number;
  nisabThreshold: number;
  isEligibleForZakat: boolean;
  zakatAmount: number;
}

// Application State
export interface AppState {
  familyMembers: FamilyMember[];
  assets: Asset[];
  debts: Debt[];
  calculations: ZakatCalculation[];
  settings: {
    currency: string;
    goldPricePerGram: number;
    silverPricePerGram: number;
    nisabMethod: 'gold' | 'silver';
    zakatRate: number; // Usually 2.5%
  };
}

// Liability types
export interface PersonalLiability {
  id: string;
  ownerId: string;
  type: 'personal';
  description: string;
  amount: number;
  currency: string;
  isJoint: boolean;
  ownershipPercentage: number;
}

export interface BusinessLiability {
  id: string;
  ownerId: string;
  type: 'business';
  description: string;
  amount: number;
  currency: string;
  isJoint: boolean;
  ownershipPercentage: number;
}

export type Liability = PersonalLiability | BusinessLiability;

// Zakat calculation types
export interface NisabThreshold {
  goldValue: number;
  silverValue: number;
  currency: string;
}

// Form state types
export interface ZakatFormState {
  familyMembers: FamilyMember[];
  assets: Asset[];
  liabilities: Liability[];
  calculations: ZakatCalculation[];
  currentStep: number;
  metalPrices: {
    gold: number;
    silver: number;
    timestamp: string;
    currency: string;
  };
}

// API response types
export interface GoldPriceApiResponse {
  gold_price_per_gram_24k: number;
  gold_price_per_gram_22k: number;
  gold_price_per_gram_21k: number;
  gold_price_per_gram_18k: number;
  gold_price_per_gram_14k: number;
  gold_price_per_gram_10k: number;
  gold_price_per_oz: number;
  gold_price_per_kg: number;
  timestamp: string;
  currency: string;
}

export interface SilverPriceApiResponse {
  silver_price_per_gram: number;
  silver_price_per_oz: number;
  silver_price_per_kg: number;
  timestamp: string;
  currency: string;
}

// Multi-step form types
export type FormStep = 
  | 'family'
  | 'assets-cash'
  | 'assets-gold'
  | 'assets-silver'
  | 'assets-investments'
  | 'assets-business'
  | 'assets-other'
  | 'liabilities-personal'
  | 'liabilities-business'
  | 'results'; 