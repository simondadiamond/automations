import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createAutomation, updateAutomation, deleteAutomation } from '../lib/airtable';
import { Form, FormGroup, Input, Button, Card, TextArea } from '../theme';
import styled from 'styled-components';
import { TONE_PAIRS } from '../constants/tones';
import { useNavigate } from 'react-router-dom';

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
  max-width: 42rem; /* Updated max-width */
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

const DeleteIcon = styled(Trash2)`
  color: ${({ theme }) => theme.neonRed};
  cursor: pointer;
  transition: color 0.2s ease;
  margin-left: 10px; // Add margin for spacing

  &:hover {
    color: red; // Change to red on hover
  }
`;

const InputTypeButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 0rem;
`;

const InputTypeButton = styled(Button)`
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
`;

const InputsContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  padding: 1.5rem 1rem 1rem 1rem; /* Increased padding to create space for the delete icon */

  &:hover .delete-icon {
    display: block;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px; /* Add margin for space between label and textarea/drop-down */

  &:focus {
    border-color: ${({ theme }) => theme.neonCyan};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.neonCyan};
  }
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
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
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    color: ${({ theme }) => theme.neonGreen};
  }
`;

const ConfirmationModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfirmationContent = styled(ModalContent)`
  padding: 1rem; /* Adjust padding for smaller size */
  max-width: 400px; /* Set a smaller max-width */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around; /* Space between buttons */
  margin-top: 1rem; /* Add margin above buttons */
`;

interface AutomationFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  mode?: 'edit' | 'new';
}

const AutomationForm: React.FC<AutomationFormProps> = ({
  onClose,
  onSuccess,
  initialData = {},
  mode = 'edit',
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData.title || '');
  const [subtitle, setSubtitle] = useState(initialData.subtitle || '');
  const [webhookUrl, setWebhookUrl] = useState(initialData.webhookUrl || '');
  const [inputs, setInputs] = useState(initialData.inputs || []);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const addInput = (type: string) => {
    setInputs([...inputs, { label: '', type, value: '' }]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleDeleteInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'new') {
        await createAutomation({
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
        toast.success('New automation created successfully');
      } else {
        await updateAutomation(initialData.id, {
          title,
          subtitle,
          webhookUrl,
          inputs: inputs.map((input, index) => ({
            id: input.id, // May be undefined if new
            label: input.label,
            type: input.type,
            value: input.value,
            order: index + 1,
          })),
        });
        toast.success('Automation updated successfully');
      }
      onSuccess(); // Refresh parent data
      onClose();   // Close modal
    } catch (error) {
      toast.error('Failed to save automation');
    }
  };

  const handleDelete = async () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAutomation(initialData.id);
      toast.success('Automation deleted successfully');
      onSuccess(); // Call the function to refresh the automation list
      navigate('/'); // Redirect to main page
    } catch (error) {
      toast.error('Failed to delete automation');
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <>
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
            <ModalTitle>{mode === 'new' ? 'Create Automation' : 'Edit Automation'}</ModalTitle>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {mode === 'edit' && (
                <DeleteIcon onClick={handleDelete} size={20} />
              )}
              <CloseButton onClick={onClose}>
                <X size={24} />
              </CloseButton>
            </div>
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
                  <DeleteIcon
                    className="delete-icon"
                    onClick={() => handleDeleteInput(index)}
                    size={20}
                    style={{ position: 'absolute', top: '1rem', right: '1rem' }} // Positioning the delete icon
                  />
                  <StyledInput
                    type="text"
                    placeholder="Enter label..."
                    value={input.label}
                    onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                    required
                  />

                  {input.type === 'Text' && (
                    <StyledInput
                      placeholder="Enter text..."
                      rows={3}
                      value={input.value}
                      onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                    />
                  )}
                  {input.type === 'Audio' && (
                    <DropArea>Drop your audio file here</DropArea>
                  )}
                  {input.type === 'Document' && (
                    <DropArea>Drop your document here</DropArea>
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
                </InputContainer>
              ))}
            </InputsContainer>

            <Button type="submit">
              {mode === 'new' ? 'Create Automation' : 'Save Changes'}
            </Button>
          </Form>
        </ModalContent>
      </Modal>

      {showConfirmation && (
        <ConfirmationModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ConfirmationContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ModalTitle>Confirm Deletion</ModalTitle>
            <p>Are you sure you want to delete this automation?</p>
            <ButtonContainer>
              <Button onClick={confirmDelete}>Confirm</Button>
              <Button onClick={cancelDelete}>Cancel</Button>
            </ButtonContainer>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AutomationForm;
