import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createAutomation } from '../lib/airtable';
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  Card,
} from '../theme';
import styled from 'styled-components';

interface AutomationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 42rem;
  background: ${({ theme }) => theme.background};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const InputTypeButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InputTypeButton = styled(Button)`
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
`;

const inputTypes = [
  { label: 'Text', icon: 'Text' },
  { label: 'Audio Recording', icon: 'Audio' },
  { label: 'Audio File', icon: 'Audio' },
  { label: 'Document', icon: 'Document' },
  { label: 'Tone', icon: 'Tone' },
];

export default function AutomationForm({ onClose, onSuccess }: AutomationFormProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [inputs, setInputs] = useState<Array<{ label: string; type: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAutomation({
        title,
        subtitle,
        webhookUrl,
        inputs: inputs.map((input, index) => ({
          label: input.label,
          type: input.type as any,
          value: '',
          order: index + 1,
          automationId: '',
          id: '',
        })),
      });
      
      toast.success('Automation created successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create automation');
    }
  };

  const addInput = (type: string) => {
    setInputs([...inputs, { label: '', type }]);
  };

  return (
    <Modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <ModalHeader>
          <ModalTitle>New Automation</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="text"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="url"
              placeholder="Webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              required
            />
          </FormGroup>

          <InputTypeButtons>
            {inputTypes.map((type) => (
              <InputTypeButton
                key={type.label}
                type="button"
                onClick={() => addInput(type.icon)}
                secondary
              >
                <Plus size={16} />
                {type.label}
              </InputTypeButton>
            ))}
          </InputTypeButtons>

          {inputs.map((input, index) => (
            <FormGroup key={index}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Input
                  type="text"
                  placeholder="Label"
                  value={input.label}
                  onChange={(e) => {
                    const newInputs = [...inputs];
                    newInputs[index].label = e.target.value;
                    setInputs(newInputs);
                  }}
                  required
                />
                <CloseButton
                  type="button"
                  onClick={() => {
                    const newInputs = inputs.filter((_, i) => i !== index);
                    setInputs(newInputs);
                  }}
                >
                  <Trash2 size={24} />
                </CloseButton>
              </div>
            </FormGroup>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit">
              Create
            </Button>
            <Button type="button" onClick={onClose} secondary>
              Cancel
            </Button>
          </div>
        </Form>
      </ModalContent>
    </Modal>
  );
}