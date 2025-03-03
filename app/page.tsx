"use client";

import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchMetalPrices } from './services/metalPrices';
import FamilyForm from './components/forms/FamilyForm';
import CashAssetsForm from './components/forms/CashAssetsForm';
import GoldAssetsForm from './components/forms/GoldAssetsForm';
import SilverAssetsForm from './components/forms/SilverAssetsForm';
import Card from './components/ui/Card';
import ProgressBar from './components/ui/ProgressBar';
import FormStep from './components/ui/FormStep';
import ThemeToggle from './components/ui/ThemeToggle';
import { 
  FamilyMember, 
  CashAsset, 
  GoldAsset, 
  SilverAsset, 
  FormStep as FormStepType,
  ZakatCalculation
} from './types';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [cashAssets, setCashAssets] = useState<CashAsset[]>([]);
  const [goldAssets, setGoldAssets] = useState<GoldAsset[]>([]);
  const [silverAssets, setSilverAssets] = useState<SilverAsset[]>([]);
  const [goldPrice, setGoldPrice] = useState(75); // Default price per gram in USD
  const [silverPrice, setSilverPrice] = useState(1.2); // Default price per gram in USD
  const [zakatCalculations, setZakatCalculations] = useState<ZakatCalculation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Define steps
  const steps: FormStepType[] = useMemo(() => [
    'family',
    'assets-cash',
    'assets-gold',
    'assets-silver',
    'results'
  ], []);

  const stepTitles = useMemo(() => [
    'Family Information',
    'Cash Assets',
    'Gold Assets',
    'Silver Assets',
    'Zakat Calculation Results'
  ], []);

  // Fetch metal prices on component mount
  useEffect(() => {
    let isMounted = true;
    
    const getMetalPrices = async () => {
      try {
        const prices = await fetchMetalPrices();
        if (prices && isMounted) {
          setGoldPrice(prices.gold);
          setSilverPrice(prices.silver);
        }
      } catch (error) {
        console.error('Failed to fetch metal prices:', error);
      }
    };

    getMetalPrices();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate Zakat for each family member
  const calculateZakat = useCallback(() => {
    setIsCalculating(true);
    
    // Nisab thresholds (in USD)
    const goldNisab = 85 * goldPrice; // 85 grams of gold
    const silverNisab = 595 * silverPrice; // 595 grams of silver
    
    // Use the lower of the two nisab values
    const nisabThreshold = Math.min(goldNisab, silverNisab);
    
    const calculations: ZakatCalculation[] = [];
    
    // Calculate Zakat for each adult family member
    familyMembers.forEach(member => {
      // Skip children who haven't reached puberty
      if (member.relationship === 'child' && member.isPubescent === false) {
        return;
      }
      
      let totalAssetValue = 0;
      
      // Calculate cash assets
      cashAssets.forEach(asset => {
        if (asset.ownerId === member.id) {
          // If solely owned
          if (!asset.isJoint) {
            totalAssetValue += asset.amount;
          } else {
            // If jointly owned, calculate based on ownership percentage
            totalAssetValue += asset.amount * (asset.ownershipPercentage / 100);
          }
        } else if (asset.isJoint && asset.jointOwnerId === member.id) {
          // If this member is the joint owner
          totalAssetValue += asset.amount * ((100 - asset.ownershipPercentage) / 100);
        }
      });
      
      // Calculate gold assets
      goldAssets.forEach(asset => {
        if (asset.ownerId === member.id) {
          const purity = asset.karat / 24; // Convert karat to percentage of pure gold
          const value = asset.weightInGrams * goldPrice * purity;
          
          if (!asset.isJoint) {
            totalAssetValue += value;
          } else {
            totalAssetValue += value * (asset.ownershipPercentage / 100);
          }
        } else if (asset.isJoint && asset.jointOwnerId === member.id) {
          const purity = asset.karat / 24;
          const value = asset.weightInGrams * goldPrice * purity;
          totalAssetValue += value * ((100 - asset.ownershipPercentage) / 100);
        }
      });
      
      // Calculate silver assets
      silverAssets.forEach(asset => {
        if (asset.ownerId === member.id) {
          const purity = asset.purity / 100; // Convert purity percentage to decimal
          const value = asset.weightInGrams * silverPrice * purity;
          
          if (!asset.isJoint) {
            totalAssetValue += value;
          } else {
            totalAssetValue += value * (asset.ownershipPercentage / 100);
          }
        } else if (asset.isJoint && asset.jointOwnerId === member.id) {
          const purity = asset.purity / 100;
          const value = asset.weightInGrams * silverPrice * purity;
          totalAssetValue += value * ((100 - asset.ownershipPercentage) / 100);
        }
      });
      
      // Calculate Zakat amount (2.5% of total eligible assets)
      const zakatAmount = totalAssetValue >= nisabThreshold ? totalAssetValue * 0.025 : 0;
      
      calculations.push({
        familyMemberId: member.id,
        totalAssetValue,
        totalDeductibleDebt: 0,
        nisabThreshold,
        isEligibleForZakat: totalAssetValue >= nisabThreshold,
        zakatAmount
      });
    });
    
    setZakatCalculations(calculations);
    setIsCalculating(false);
  }, [familyMembers, cashAssets, goldAssets, silverAssets, goldPrice, silverPrice]);

  const handleNext = useCallback(() => {
    if (currentStep === steps.length - 1) {
      // This is the last step, calculate Zakat
      calculateZakat();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length, calculateZakat]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const updateFamilyMembers = useCallback((members: FamilyMember[]) => {
    setFamilyMembers(members);
  }, []);

  const updateCashAssets = useCallback((assets: CashAsset[]) => {
    setCashAssets(assets);
  }, []);

  const updateGoldAssets = useCallback((assets: GoldAsset[]) => {
    setGoldAssets(assets);
  }, []);

  const updateSilverAssets = useCallback((assets: SilverAsset[]) => {
    setSilverAssets(assets);
  }, []);

  const getStepDescription = useCallback((step: FormStepType): string => {
    switch (step) {
      case 'family':
        return 'Add information about yourself and your family members.';
      case 'assets-cash':
        return 'Add details about your cash holdings, bank accounts, and other monetary assets.';
      case 'assets-gold':
        return 'Add information about your gold possessions including jewelry, coins, and bars.';
      case 'assets-silver':
        return 'Add information about your silver possessions including jewelry, coins, and bars.';
      case 'results':
        return 'Review your Zakat calculation results based on the information provided.';
      default:
        return '';
    }
  }, []);

  // Render Zakat calculation results
  const renderZakatResults = () => {
    if (isCalculating) {
      return <div className="text-center">Calculating...</div>;
    }
    
    if (zakatCalculations.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-lg text-gray-600 dark:text-gray-300">No calculations available. Please make sure you have added family members and assets.</p>
          <button 
            onClick={() => setCurrentStep(0)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Family Information
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-md mb-6 border border-primary-100 dark:border-primary-800">
          <h3 className="text-lg font-medium text-primary-800 dark:text-primary-200 mb-2">Zakat Calculation Results</h3>
          <p className="text-primary-600 dark:text-primary-300">
            Below are the Zakat calculations for each eligible family member based on the provided asset information.
            The Nisab threshold is calculated using the lower value of gold ({goldPrice.toFixed(2)}/gram) or silver ({silverPrice.toFixed(2)}/gram).
          </p>
        </div>
        
        <div className="space-y-8">
          {zakatCalculations.map(calc => {
            const member = familyMembers.find(m => m.id === calc.familyMemberId);
            
            return (
              <Card 
                key={calc.familyMemberId}
                title={`${member?.name || 'Family Member'}'s Zakat Calculation`}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary-50 dark:bg-secondary-200 rounded-md">
                      <p className="text-sm font-medium text-secondary-600 dark:text-secondary-800">Total Assets</p>
                      <p className="text-xl font-bold text-secondary-900 dark:text-secondary-900">
                        ${calc.totalAssetValue.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-secondary-50 dark:bg-secondary-200 rounded-md">
                      <p className="text-sm font-medium text-secondary-600 dark:text-secondary-800">Zakat Amount</p>
                      <p className="text-xl font-bold text-secondary-900 dark:text-secondary-900">
                        ${calc.zakatAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-200 rounded-md">
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-800">Nisab Threshold</p>
                    <p className="text-xl font-bold text-secondary-900 dark:text-secondary-900">
                      ${calc.nisabThreshold.toFixed(2)}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-700 mt-1">
                      Based on the lower value of gold (85g = ${(85 * goldPrice).toFixed(2)}) or silver (595g = ${(595 * silverPrice).toFixed(2)})
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${calc.isEligibleForZakat ? 'bg-success/10' : 'bg-secondary-50 dark:bg-secondary-200'}`}>
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-800">Zakat Status</p>
                    <p className={`text-xl font-bold ${calc.isEligibleForZakat ? 'text-success' : 'text-secondary-500 dark:text-secondary-700'}`}>
                      {calc.isEligibleForZakat ? 'Eligible for Zakat' : 'Not Eligible for Zakat'}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-700 mt-1">
                      {calc.isEligibleForZakat 
                        ? 'Net assets exceed the nisab threshold' 
                        : 'Net assets do not exceed the nisab threshold'}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (steps[currentStep]) {
      case 'family':
        return (
          <FamilyForm 
            familyMembers={familyMembers} 
            onUpdate={updateFamilyMembers} 
          />
        );
      case 'assets-cash':
        return (
          <CashAssetsForm 
            assets={cashAssets} 
            familyMembers={familyMembers} 
            onUpdate={updateCashAssets} 
          />
        );
      case 'assets-gold':
        return (
          <GoldAssetsForm 
            assets={goldAssets} 
            familyMembers={familyMembers} 
            goldPricePerGram={goldPrice} 
            onUpdate={updateGoldAssets} 
          />
        );
      case 'assets-silver':
        return (
          <SilverAssetsForm 
            assets={silverAssets} 
            familyMembers={familyMembers} 
            silverPricePerGram={silverPrice} 
            onUpdate={updateSilverAssets} 
          />
        );
      case 'results':
        return renderZakatResults();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-secondary-900 dark:text-white">
      <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <header className="mb-8 flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-primary-700 dark:text-white mb-3 drop-shadow-sm">
                Zakat Calculator
              </h1>
              <p className="text-lg text-secondary-700 dark:text-blue-200 max-w-2xl mx-auto">
                Calculate your Zakat accurately based on your assets and liabilities
              </p>
            </div>
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </header>
          
          <ProgressBar 
            steps={stepTitles} 
            currentStep={currentStep} 
            onStepClick={handleStepClick} 
          />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <FormStep
              title={stepTitles[currentStep]}
              description={getStepDescription(steps[currentStep])}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              nextButtonText={currentStep === steps.length - 1 ? 'Calculate Zakat' : 'Next'}
            >
              {renderCurrentStep()}
            </FormStep>
          </div>
        </div>
      </div>
    </div>
  );
}
