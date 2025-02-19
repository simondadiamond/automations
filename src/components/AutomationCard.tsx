import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, FormGroup, Label, Input, TextArea } from '../theme';
import { TONE_PAIRS } from '../constants/tones';
import styled from 'styled-components';
import { type Automation } from '../lib/airtable';

interface AutomationCardProps {
  automation: Automation;
  onDelete: () => void;
}

const CardHeader = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  cursor: pointer;
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

export default function AutomationCard({ automation }: AutomationCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/automation/${automation.id}`);
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>{automation.title}</CardTitle>
        <CardSubtitle>{automation.subtitle}</CardSubtitle>
      </CardHeader>

      <FormGroup>
        {automation.inputs.map((input) => (
          <FormGroup key={input.id}>
            <Label>{input.label}</Label>
            {input.type === 'Text' && (
              <TextArea
                placeholder="Enter text..."
                rows={3}
                disabled
              />
            )}
            {input.type === 'Tone' && (
              <Input
                as="select"
                defaultValue={TONE_PAIRS[0]}
                disabled
              >
                {TONE_PAIRS.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </Input>
            )}
          </FormGroup>
        ))}
      </FormGroup>
    </Card>
  );
}
