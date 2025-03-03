"use client";

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { CashAsset, FamilyMember } from '../../types';

interface CashAssetsFormProps {
  assets: CashAsset[];
  familyMembers: FamilyMember[];
  onUpdate: (assets: CashAsset[]) => void;
}

const CashAssetsForm: React.FC<CashAssetsFormProps> = ({
  assets,
  familyMembers,
  onUpdate,
}) => {
  const [cashAssets, setCashAssets] = useState<CashAsset[]>(assets);

  const handleAddAsset = () => {
    const newAsset: CashAsset = {
      id: uuidv4(),
      ownerId: familyMembers[0]?.id || '',
      type: 'cash',
      description: '',
      amount: 0,
      currency: 'USD',
      isJoint: false,
      ownershipPercentage: 100,
      jointOwnerId: 'external',
      jointOwnerName: '',
    };

    setCashAssets([...cashAssets, newAsset]);
    onUpdate([...cashAssets, newAsset]);
  };

  const handleRemoveAsset = (index: number) => {
    const updatedAssets = [...cashAssets];
    updatedAssets.splice(index, 1);
    setCashAssets(updatedAssets);
    onUpdate(updatedAssets);
  };

  const handleAssetChange = (index: number, field: keyof CashAsset, value: any) => {
    const updatedAssets = [...cashAssets];
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

    setCashAssets(updatedAssets);
    onUpdate(updatedAssets);
  };

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

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mb-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Cash Assets</h3>
        <p className="text-blue-600 dark:text-blue-300">
          Include all cash holdings such as bank accounts, cash on hand, savings accounts, 
          certificates of deposit, and money market accounts.
        </p>
      </div>

      {cashAssets.map((asset, index) => (
        <Card 
          key={asset.id} 
          title={`Cash Asset ${index + 1}`}
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
              placeholder="e.g., Checking Account, Savings, Cash on hand"
              value={asset.description}
              onChange={(e) => handleAssetChange(index, 'description', e.target.value)}
              fullWidth
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                min="0"
                step="0.01"
                value={asset.amount.toString()}
                onChange={(e) => handleAssetChange(index, 'amount', parseFloat(e.target.value) || 0)}
                fullWidth
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

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
      ))}

      <div className="flex justify-center">
        <Button 
          onClick={handleAddAsset} 
          variant="outline" 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          + Add Cash Asset
        </Button>
      </div>
    </div>
  );
};

export default CashAssetsForm; 