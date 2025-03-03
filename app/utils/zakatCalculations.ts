import { Asset, FamilyMember, Liability, ZakatCalculation } from '../types';

// Constants for Zakat calculation
const ZAKAT_RATE = 0.025; // 2.5%
const NISAB_GOLD_WEIGHT_GRAMS = 87.48; // 87.48 grams of gold
const NISAB_SILVER_WEIGHT_GRAMS = 612.36; // 612.36 grams of silver

/**
 * Calculate the nisab threshold based on gold and silver prices
 * @param goldPricePerGram - Current gold price per gram in USD
 * @param silverPricePerGram - Current silver price per gram in USD
 * @returns The nisab threshold in USD (lower of gold or silver nisab)
 */
export const calculateNisabThreshold = (
  goldPricePerGram: number,
  silverPricePerGram: number
): number => {
  const goldNisab = NISAB_GOLD_WEIGHT_GRAMS * goldPricePerGram;
  const silverNisab = NISAB_SILVER_WEIGHT_GRAMS * silverPricePerGram;
  
  // According to Hanafi school, we use the lower of the two nisab values
  return Math.min(goldNisab, silverNisab);
};

/**
 * Calculate the total value of all assets for a specific family member
 * @param assets - List of all assets
 * @param familyMemberId - ID of the family member
 * @param goldPricePerGram - Current gold price per gram in USD
 * @param silverPricePerGram - Current silver price per gram in USD
 * @returns Total value of assets in USD
 */
export const calculateTotalAssets = (
  assets: Asset[],
  familyMemberId: string,
  goldPricePerGram: number,
  silverPricePerGram: number
): number => {
  return assets.reduce((total, asset) => {
    // Skip assets that don't belong to this family member
    if (asset.ownerId !== familyMemberId) {
      return total;
    }

    // Calculate value based on asset type
    let assetValue = 0;
    
    switch (asset.type) {
      case 'cash':
        assetValue = asset.amount;
        break;
      
      case 'gold':
        // Calculate gold value based on karat
        const purityFactor = asset.karat / 24;
        assetValue = asset.weightInGrams * goldPricePerGram * purityFactor;
        break;
      
      case 'silver':
        // Calculate silver value based on purity
        assetValue = asset.weightInGrams * silverPricePerGram * (asset.purity / 100);
        break;
      
      case 'investment':
        assetValue = asset.currentValue;
        break;
      
      case 'business':
        // For business assets, we include inventory, cash, and receivables
        assetValue = asset.inventoryValue + asset.cashValue + asset.receivablesValue;
        break;
      
      case 'real_estate':
        // Only include if it's for investment
        assetValue = asset.isForInvestment ? asset.currentValue : 0;
        break;
    }

    // Adjust for joint ownership
    if (asset.isJoint) {
      assetValue = assetValue * (asset.ownershipPercentage / 100);
    }

    return total + assetValue;
  }, 0);
};

/**
 * Calculate the total liabilities for a specific family member
 * @param liabilities - List of all liabilities
 * @param familyMemberId - ID of the family member
 * @returns Total liabilities in USD
 */
export const calculateTotalLiabilities = (
  liabilities: Liability[],
  familyMemberId: string
): number => {
  return liabilities.reduce((total, liability) => {
    // Skip liabilities that don't belong to this family member
    if (liability.ownerId !== familyMemberId) {
      return total;
    }

    let liabilityValue = liability.amount;

    // Adjust for joint liability
    if (liability.isJoint) {
      liabilityValue = liabilityValue * (liability.ownershipPercentage / 100);
    }

    return total + liabilityValue;
  }, 0);
};

/**
 * Calculate Zakat for all eligible family members
 * @param familyMembers - List of family members
 * @param assets - List of all assets
 * @param liabilities - List of all liabilities
 * @param goldPricePerGram - Current gold price per gram in USD
 * @param silverPricePerGram - Current silver price per gram in USD
 * @returns Array of Zakat calculations for each eligible family member
 */
export const calculateZakat = (
  familyMembers: FamilyMember[],
  assets: Asset[],
  liabilities: Liability[],
  goldPricePerGram: number,
  silverPricePerGram: number
): ZakatCalculation[] => {
  const nisabThreshold = calculateNisabThreshold(goldPricePerGram, silverPricePerGram);
  
  return familyMembers
    // Only calculate Zakat for family members who have reached puberty
    .filter(member => member.isPubescent)
    .map(member => {
      const totalAssetValue = calculateTotalAssets(
        assets,
        member.id,
        goldPricePerGram,
        silverPricePerGram
      );
      
      const totalDeductibleDebt = calculateTotalLiabilities(liabilities, member.id);
      const netWorth = totalAssetValue - totalDeductibleDebt;
      const isEligibleForZakat = netWorth >= nisabThreshold;
      const zakatAmount = isEligibleForZakat ? netWorth * ZAKAT_RATE : 0;
      
      return {
        familyMemberId: member.id,
        totalAssetValue,
        totalDeductibleDebt,
        nisabThreshold,
        isEligibleForZakat,
        zakatAmount
      };
    });
}; 