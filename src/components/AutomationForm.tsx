import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createAutomation, updateAutomation } from '../lib/airtable';
import { Form, FormGroup, Input, Button, Label, Card, TextArea } from '../theme';
import styled from 'styled-components';
import { TONE_PAIRS } from '../constants/tones';

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

const InputsContainer = styled.div`
  max-height: 300px; /* Set a maximum height */
  overflow-y: auto; /* Enable scrolling */
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  padding: 1rem;

  &:hover .delete-icon {
    display: block; /* Show delete icon on hover */
  }
`;

const InputLabel = styled.label`
  color: ${({ theme }) => theme.neonCyan};
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled(Input)`
  width: 100%; /* Set width to 100% */
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};

  &:focus {
    border-color: ${({ theme }) => theme.neonCyan};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.neonCyan};
  }
`;

const StyledTextArea = styled(TextArea)`
  width: 100%; /* Set width to 100% */
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};

  &:focus {
    border-color: ${({ theme }) => theme.neonCyan};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.neonCyan};
  }
`;

const DropArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  background: rgba(0, 0, 0, 0.2);
  margin-top: 0.5rem;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const DeleteIcon = styled(Trash2)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: ${({ theme }) => theme.neonRed};
  cursor: pointer;
  display: none; /* Hidden by default */
`;

const AutomationForm = ({ onClose, onSuccess, initialData }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [subtitle, setSubtitle] = useState(initialData.subtitle || '');
  const [webhookUrl, setWebhookUrl] = useState(initialData.webhookUrl || '');
  const [inputs, setInputs] = useState(initialData.inputs || []);

  const addInput = (type) => {
    setInputs([...inputs, { label: '', type, value: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleDeleteInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateAutomation(initialData.id, {
        title,
        subtitle,
        webhookUrl,
        inputs: inputs.map((input, index) => ({
          label: input.label,
          type: input.type,
          value: input.value,
          order: index + 1,
        })),
      });
      
      toast.success('Automation updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update automation');
    }
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
          <ModalTitle>Edit Automation</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <StyledInput
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <StyledInput
              type="text"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <StyledInput
              type="url"
              placeholder="Webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </FormGroup>

          <InputTypeButtons>
            {['Text', 'Audio', 'Document', 'Tone'].map((type) => (
              <InputTypeButton
                key={type}
                type="button"
                onClick={() => addInput(type)}
                secondary
              >
                <Plus size={16} />
                {type}
              </InputTypeButton>
            ))}
          </InputTypeButtons>

          <InputsContainer>
            {inputs.map((input, index) => (
              <InputContainer key={index}>
                <InputLabel>Label</InputLabel>
                <StyledInput
                  type="text"
                  placeholder="Enter label..."
                  value={input.label}
                  onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                  required
                />
                <InputLabel>{input.type}</InputLabel>
                {input.type === 'Text' && (
                  <StyledTextArea
                    placeholder="Enter text..."
                    rows={3}
                    value={input.value}
                    onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                  />
                )}
                {input.type === 'Audio' && (
                  <DropArea>
                    Drop your audio file here
                  </DropArea>
                )}
                {input.type === 'Document' && (
                  <DropArea>
                    Drop your document here
                  </DropArea>
                )}
                {input.type === 'Tone' && (
                  <StyledInput
                    as="select"
                    value={input.value}
                    onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                  >
                    {TONE_PAIRS.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </StyledInput>
                )}
                <DeleteIcon
                  className="delete-icon"
                  onClick={() => handleDeleteInput(index)}
                  size={20}
                />
              </InputContainer>
            ))}
          </InputsContainer>

          <Button type="submit">
            Save Changes
          </Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default AutomationForm;
