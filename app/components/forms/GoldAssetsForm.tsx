"use client";

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { GoldAsset, FamilyMember } from '../../types';

interface GoldAssetsFormProps {
  assets: GoldAsset[];
  familyMembers: FamilyMember[];
  goldPricePerGram: number;
  onUpdate: (assets: GoldAsset[]) => void;
}

const GoldAssetsForm: React.FC<GoldAssetsFormProps> = ({
  assets,
  familyMembers,
  goldPricePerGram,
  onUpdate,
}) => {
  const [goldAssets, setGoldAssets] = useState<GoldAsset[]>(assets);

  const handleAddAsset = () => {
    const newAsset: GoldAsset = {
      id: uuidv4(),
      ownerId: familyMembers[0]?.id || '',
      type: 'gold',
      description: '',
      weightInGrams: 0,
      karat: 24,
      isJoint: false,
      ownershipPercentage: 100,
      jointOwnerId: 'external',
      jointOwnerName: '',
    };

    setGoldAssets([...goldAssets, newAsset]);
    onUpdate([...goldAssets, newAsset]);
  };

  const handleRemoveAsset = (index: number) => {
    const updatedAssets = [...goldAssets];
    updatedAssets.splice(index, 1);
    setGoldAssets(updatedAssets);
    onUpdate(updatedAssets);
  };

  const handleAssetChange = (index: number, field: keyof GoldAsset, value: string | number | boolean) => {
    const updatedAssets = [...goldAssets];
    updatedAssets[index] = {
      ...updatedAssets[index],
      [field]: value,
    };

    // If joint ownership is toggled off, reset ownership percentage to 100
    if (field === 'isJoint' && value === false) {
      updatedAssets[index].ownershipPercentage = 100;
      updatedAssets[index].jointOwnerId = 'external';
      updatedAssets[index].jointOwnerName = '';
    }

    setGoldAssets(updatedAssets);
    onUpdate(updatedAssets);
  };

  // Calculate the value of gold based on weight, karat, and current price
  const calculateGoldValue = (weight: number, karat: number): number => {
    const purityFactor = karat / 24;
    return weight * goldPricePerGram * purityFactor;
  };

  // Generate joint owner options: family members + external option
  const getJointOwnerOptions = (currentOwnerId: string) => {
    const familyOptions = familyMembers
      .filter(member => member.id !== currentOwnerId) // Exclude current owner
      .map(member => ({
        value: member.id,
        label: member.name || `Family Member ${member.id.slice(0, 4)}`
      }));
    
    return [
      ...familyOptions,
      { value: 'external', label: 'Someone outside the family' }
    ];
  };

  const karatOptions = [
    { value: '24', label: '24K (99.9% pure)' },
    { value: '22', label: '22K (91.7% pure)' },
    { value: '21', label: '21K (87.5% pure)' },
    { value: '18', label: '18K (75.0% pure)' },
    { value: '14', label: '14K (58.3% pure)' },
    { value: '10', label: '10K (41.7% pure)' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mb-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Gold Assets</h3>
        <p className="text-blue-600 dark:text-blue-300">
          Include all gold jewelry, coins, bars and other gold items.
          Current gold price: <strong>${goldPricePerGram.toFixed(2)}/gram</strong> of 24K gold.
        </p>
      </div>

      {goldAssets.map((asset, index) => {
        const goldValue = calculateGoldValue(asset.weightInGrams, asset.karat);
        const ownerValue = goldValue * (asset.ownershipPercentage / 100);
        
        return (
          <Card 
            key={asset.id} 
            title={`Gold Asset ${index + 1}`}
            className="bg-white dark:bg-gray-800"
            footer={
              <Button 
                variant="outline" 
                onClick={() => handleRemoveAsset(index)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove Asset
              </Button>
            }
          >
            <div className="space-y-4">
              <Input
                label="Description"
                placeholder="e.g., Gold necklace, Gold coins"
                value={asset.description}
                onChange={(e) => handleAssetChange(index, 'description', e.target.value)}
                fullWidth
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Weight (grams)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={asset.weightInGrams.toString()}
                  onChange={(e) => handleAssetChange(index, 'weightInGrams', parseFloat(e.target.value) || 0)}
                  fullWidth
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />

                <Select
                  label="Karat"
                  options={karatOptions}
                  value={asset.karat.toString()}
                  onChange={(value) => handleAssetChange(index, 'karat', parseInt(value))}
                  fullWidth
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                <p>Estimated value: <strong>${goldValue.toFixed(2)}</strong></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Owner"
                  options={familyMembers.map(member => ({
                    value: member.id,
                    label: member.name || `Family Member ${member.id.slice(0, 4)}`
                  }))}
                  value={asset.ownerId}
                  onChange={(value) => handleAssetChange(index, 'ownerId', value)}
                  fullWidth
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <Checkbox
                label="This is jointly owned"
                checked={asset.isJoint}
                onChange={(e) => handleAssetChange(index, 'isJoint', e.target.checked)}
                className="dark:text-white"
              />

              {asset.isJoint && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Ownership Percentage (%)"
                      type="number"
                      min="1"
                      max="99"
                      value={asset.ownershipPercentage.toString()}
                      onChange={(e) => handleAssetChange(
                        index, 
                        'ownershipPercentage', 
                        Math.min(99, Math.max(1, parseInt(e.target.value) || 0))
                      )}
                      helperText="Percentage owned by the selected family member"
                      fullWidth
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    
                    <Select
                      label="Joint Owner"
                      options={getJointOwnerOptions(asset.ownerId)}
                      value={asset.jointOwnerId || 'external'}
                      onChange={(value) => handleAssetChange(index, 'jointOwnerId', value)}
                      helperText="Who owns the remaining portion?"
                      fullWidth
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  {asset.jointOwnerId === 'external' && (
                    <Input
                      label="Joint Owner Name (Optional)"
                      placeholder="e.g., Business Partner, Friend, Spouse's Family"
                      value={asset.jointOwnerName || ''}
                      onChange={(e) => handleAssetChange(index, 'jointOwnerName', e.target.value)}
                      helperText="Name of the person outside your family who co-owns this asset"
                      fullWidth
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  )}
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    <p>
                      <strong>{familyMembers.find(m => m.id === asset.ownerId)?.name || 'Selected member'}</strong> owns {asset.ownershipPercentage}% 
                      (${ownerValue.toFixed(2)}) and <strong>
                        {asset.jointOwnerId === 'external' 
                          ? (asset.jointOwnerName || 'someone outside the family') 
                          : (familyMembers.find(m => m.id === asset.jointOwnerId)?.name || 'another family member')}
                      </strong> owns {100 - asset.ownershipPercentage}% 
                      (${(goldValue - ownerValue).toFixed(2)})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <div className="flex justify-center">
        <Button 
          onClick={handleAddAsset} 
          variant="outline" 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          + Add Gold Asset
        </Button>
      </div>
    </div>
  );
};

export default GoldAssetsForm; 