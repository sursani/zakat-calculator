"use client";

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { SilverAsset, FamilyMember } from '../../types';

interface SilverAssetsFormProps {
  assets: SilverAsset[];
  familyMembers: FamilyMember[];
  silverPricePerGram: number;
  onUpdate: (assets: SilverAsset[]) => void;
}

const SilverAssetsForm: React.FC<SilverAssetsFormProps> = ({
  assets,
  familyMembers,
  silverPricePerGram,
  onUpdate,
}) => {
  const [silverAssets, setSilverAssets] = useState<SilverAsset[]>(assets);

  const handleAddAsset = () => {
    const newAsset: SilverAsset = {
      id: uuidv4(),
      ownerId: familyMembers[0]?.id || '',
      type: 'silver',
      description: '',
      weightInGrams: 0,
      purity: 92.5, // Default to sterling silver
      isJoint: false,
      ownershipPercentage: 100,
      jointOwnerId: 'external',
      jointOwnerName: '',
    };

    setSilverAssets([...silverAssets, newAsset]);
    onUpdate([...silverAssets, newAsset]);
  };

  const handleRemoveAsset = (index: number) => {
    const updatedAssets = [...silverAssets];
    updatedAssets.splice(index, 1);
    setSilverAssets(updatedAssets);
    onUpdate(updatedAssets);
  };

  const handleAssetChange = (index: number, field: keyof SilverAsset, value: string | number | boolean) => {
    const updatedAssets = [...silverAssets];
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

    setSilverAssets(updatedAssets);
    onUpdate(updatedAssets);
  };

  // Calculate the value of silver based on weight, purity, and current price
  const calculateSilverValue = (weight: number, purity: number): number => {
    const purityFactor = purity / 100;
    return weight * silverPricePerGram * purityFactor;
  };

  // Generate joint owner options: family members + external option
  const getJointOwnerOptions = (currentOwnerId: string) => {
    const otherFamilyMembers = familyMembers
      .filter(member => member.id !== currentOwnerId)
      .map(member => ({
        value: member.id,
        label: member.name || `Family Member ${member.id.slice(0, 4)}`
      }));
    
    return [
      { value: 'external', label: 'Someone outside the family' },
      ...otherFamilyMembers
    ];
  };

  const getSilverPurityOptions = () => [
    { value: '99.9', label: 'Fine Silver (99.9%)' },
    { value: '95.8', label: 'Britannia Silver (95.8%)' },
    { value: '92.5', label: 'Sterling Silver (92.5%)' },
    { value: '90.0', label: 'Coin Silver (90%)' },
    { value: '80.0', label: 'Silver Plate (80%)' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mb-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Silver Assets</h3>
        <p className="text-blue-600 dark:text-blue-300">
          Include all silver jewelry, coins, bars and other silver items.
          Current silver price: <strong>${silverPricePerGram.toFixed(2)}/gram</strong> of fine silver (99.9%).
        </p>
      </div>

      {silverAssets.map((asset, index) => {
        const silverValue = calculateSilverValue(asset.weightInGrams, asset.purity);
        
        return (
          <Card 
            key={asset.id} 
            title={`Silver Asset ${index + 1}`}
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
                placeholder="e.g., Silver necklace, Silver coins"
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
                  label="Purity"
                  options={getSilverPurityOptions()}
                  value={asset.purity.toString()}
                  onChange={(value) => handleAssetChange(index, 'purity', parseFloat(value))}
                  fullWidth
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                <p>Estimated value: <strong>${silverValue.toFixed(2)}</strong></p>
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
                      and <strong>
                        {asset.jointOwnerId === 'external' 
                          ? (asset.jointOwnerName || 'someone outside the family') 
                          : (familyMembers.find(m => m.id === asset.jointOwnerId)?.name || 'another family member')}
                      </strong> owns {100 - asset.ownershipPercentage}%
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
          + Add Silver Asset
        </Button>
      </div>
    </div>
  );
};

export default SilverAssetsForm; 