"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import { FamilyMember } from '../../types';

interface FamilyFormProps {
  familyMembers: FamilyMember[];
  onUpdate: (familyMembers: FamilyMember[]) => void;
}

const FamilyForm: React.FC<FamilyFormProps> = ({ familyMembers, onUpdate }) => {
  const [hasSpouse, setHasSpouse] = useState(
    familyMembers.some(member => member.relationship === 'spouse')
  );
  
  const [childrenCount, setChildrenCount] = useState(
    familyMembers.filter(member => member.relationship === 'child').length
  );
  
  const [primaryMember, setPrimaryMember] = useState<FamilyMember>(
    familyMembers.find(member => member.relationship === 'primary') || {
      id: uuidv4(),
      name: '',
      relationship: 'primary',
      isPubescent: true
    }
  );
  
  const [spouse, setSpouse] = useState<FamilyMember>(
    familyMembers.find(member => member.relationship === 'spouse') || {
      id: uuidv4(),
      name: '',
      relationship: 'spouse',
      isPubescent: true
    }
  );
  
  const [children, setChildren] = useState<FamilyMember[]>(
    familyMembers.filter(member => member.relationship === 'child') || []
  );

  const [errors, setErrors] = useState<{
    primaryMember: string;
    spouse: string;
    children: string[];
  }>({
    primaryMember: '',
    spouse: '',
    children: []
  });
  
  const handlePrimaryMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryMember({
      ...primaryMember,
      name: e.target.value
    });

    // Clear errors when user types
    if (e.target.value.trim()) {
      setErrors(prev => ({
        ...prev,
        primaryMember: ''
      }));
    }
  };
  
  const handleSpouseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpouse({
      ...spouse,
      name: e.target.value
    });

    // Clear errors when user types
    if (e.target.value.trim()) {
      setErrors(prev => ({
        ...prev,
        spouse: ''
      }));
    }
  };
  
  const handleChildNameChange = (index: number, value: string) => {
    const updatedChildren = [...children];
    if (updatedChildren[index]) {
      updatedChildren[index] = {
        ...updatedChildren[index],
        name: value
      };
    } else {
      updatedChildren[index] = {
        id: uuidv4(),
        name: value,
        relationship: 'child',
        isPubescent: false
      };
    }
    setChildren(updatedChildren);

    // Clear errors when user types
    if (value.trim()) {
      setErrors(prev => {
        const updatedChildrenErrors = [...prev.children];
        updatedChildrenErrors[index] = '';
        return {
          ...prev,
          children: updatedChildrenErrors
        };
      });
    }
  };
  
  const handleChildPubertyChange = (index: number, value: boolean) => {
    const updatedChildren = [...children];
    if (updatedChildren[index]) {
      updatedChildren[index] = {
        ...updatedChildren[index],
        isPubescent: value
      };
      setChildren(updatedChildren);
    }
  };
  
  const handleChildrenCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setChildrenCount(count);
    
    // Adjust children array size
    if (count > children.length) {
      // Add new children
      const newChildren = [...children];
      for (let i = children.length; i < count; i++) {
        newChildren.push({
          id: uuidv4(),
          name: '',
          relationship: 'child',
          isPubescent: false
        });
      }
      setChildren(newChildren);

      // Initialize errors for new children
      setErrors(prev => {
        const updatedChildrenErrors = [...prev.children];
        for (let i = prev.children.length; i < count; i++) {
          updatedChildrenErrors[i] = '';
        }
        return {
          ...prev,
          children: updatedChildrenErrors
        };
      });
    } else if (count < children.length) {
      // Remove excess children
      setChildren(children.slice(0, count));
      
      // Remove errors for removed children
      setErrors(prev => ({
        ...prev,
        children: prev.children.slice(0, count)
      }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      primaryMember: '',
      spouse: '',
      children: [...errors.children]
    };

    // Validate primary member
    if (!primaryMember.name.trim()) {
      newErrors.primaryMember = 'Please enter your name';
      isValid = false;
    }

    // Validate spouse if selected
    if (hasSpouse && !spouse.name.trim()) {
      newErrors.spouse = 'Please enter your spouse\'s name';
      isValid = false;
    }

    // Validate children
    if (childrenCount > 0) {
      for (let i = 0; i < childrenCount; i++) {
        if (!children[i]?.name.trim()) {
          newErrors.children[i] = `Please enter child ${i + 1}'s name`;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  
  const updateFamilyMembers = React.useCallback(() => {
    const allMembers: FamilyMember[] = [primaryMember];
    
    if (hasSpouse) {
      allMembers.push(spouse);
    }
    
    if (childrenCount > 0) {
      allMembers.push(...children.slice(0, childrenCount));
    }
    
    // Validate form before updating
    validateForm();
    
    onUpdate(allMembers);
  }, [primaryMember, spouse, children, hasSpouse, childrenCount, onUpdate]);
  
  useEffect(() => {
    updateFamilyMembers();
  }, [updateFamilyMembers]);
  
  return (
    <div className="space-y-6">
      <Card title="Primary Member">
        <Input
          label="Your Name"
          value={primaryMember.name}
          onChange={handlePrimaryMemberChange}
          placeholder="Enter your name"
          fullWidth
          error={errors.primaryMember}
        />
      </Card>
      
      <Card title="Spouse Information">
        <div className="mb-4">
          <Checkbox
            label="I have a spouse"
            checked={hasSpouse}
            onChange={(e) => setHasSpouse(e.target.checked)}
          />
        </div>
        
        {hasSpouse && (
          <Input
            label="Spouse's Name"
            value={spouse.name}
            onChange={handleSpouseChange}
            placeholder="Enter spouse's name"
            fullWidth
            error={errors.spouse}
          />
        )}
      </Card>
      
      <Card title="Children Information">
        <Input
          label="Number of Children"
          type="number"
          min="0"
          value={childrenCount.toString()}
          onChange={handleChildrenCountChange}
          fullWidth
        />
        
        {childrenCount > 0 && (
          <div className="mt-4 space-y-4">
            {Array.from({ length: childrenCount }).map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <Input
                  label={`Child ${index + 1} Name`}
                  value={children[index]?.name || ''}
                  onChange={(e) => handleChildNameChange(index, e.target.value)}
                  placeholder={`Enter child ${index + 1}'s name`}
                  fullWidth
                  error={errors.children[index]}
                />
                <Checkbox
                  label="Has reached puberty"
                  checked={children[index]?.isPubescent || false}
                  onChange={(e) => handleChildPubertyChange(index, e.target.checked)}
                  helperText="Children who have reached puberty have their own Zakat obligations if they own eligible assets"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FamilyForm; 