import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { type Automation, deleteAutomation } from '../lib/airtable';
import { Card, Button, FormGroup, Label, Input, TextArea } from '../theme';
import styled from 'styled-components';

interface AutomationCardProps {
  automation: Automation;
  onDelete: () => void;
}

const CardHeader = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const CardSubtitle = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ variant?: 'delete' | 'edit' }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme, variant }) => 
    variant === 'delete' ? theme.neonGreen : 
    variant === 'edit' ? theme.neonCyan : 
    theme.text};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme, variant }) => 
      variant === 'delete' ? '#ff4444' : 
      variant === 'edit' ? theme.neonGreen : 
      theme.neonCyan};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.inputbg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.neonGreen};
    box-shadow: ${({ theme }) => theme.glowGreen};
  }
`;

export default function AutomationCard({ automation, onDelete }: AutomationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this automation?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAutomation(automation.id);
      toast.success('Automation deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete automation');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <CardHeader>
        <CardTitle>{automation.title}</CardTitle>
        <CardSubtitle>{automation.subtitle}</CardSubtitle>
        <ActionButtons>
          <ActionButton
            onClick={handleDelete}
            disabled={isDeleting}
            variant="delete"
          >
            <Trash2 size={20} />
          </ActionButton>
          <ActionButton variant="edit">
            <Edit2 size={20} />
          </ActionButton>
        </ActionButtons>
      </CardHeader>

      <FormGroup>
        <Label>Inputs</Label>
        {automation.inputs.map((input) => (
          <FormGroup key={input.id}>
            <Label>{input.label}</Label>
            {input.type === 'Text' && (
              <TextArea
                placeholder="Enter text..."
                rows={3}
              />
            )}
            {input.type === 'Tone' && (
              <Select defaultValue="friendly">
                <option value="friendly">Friendly + Professional</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </Select>
            )}
          </FormGroup>
        ))}

        <Button>Submit</Button>
      </FormGroup>
    </Card>
  );
}