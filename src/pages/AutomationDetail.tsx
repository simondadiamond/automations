import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, Button, TextArea } from '../theme';
import { getAutomationById } from '../lib/airtable';
import { TONE_PAIRS } from '../constants/tones';
import AutomationForm from '../components/AutomationForm';
import { toast } from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.neonGreen};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.neonCyan};
  }
`;

// On mobile, the panels will stack vertically.
const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 2000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled(Card)`
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const RightPanel = styled(Card)`
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

// Styled editable title input.
const TitleInput = styled.input`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
`;

// Styled editable subtitle textarea.
const SubtitleInput = styled.input`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2rem;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
`;

const InputLabel = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
`;

// Retained in case you want to style a drop area.
// (Not used when we replace it with a file input below.)
const DropArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  background: rgba(0, 0, 0, 0.2);
  margin-top: 0.5rem;
  width: 100%;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const EditIcon = styled(Edit)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: ${({ theme }) => theme.neonCyan};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.neonGreen};
  }
`;

// New styled container for the button.
const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automation, setAutomation] = useState(null);
  // Local state holding current page values (title, subtitle, inputs)
  const [pageData, setPageData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState("");
  const [isCallingWebhook, setIsCallingWebhook] = useState(false);

  useEffect(() => {
  const fetchAutomation = async () => {
    try {
      const data = await getAutomationById(id);
      // Set a default tone value if it's missing.
      const inputsWithDefaults = data.inputs.map(input =>
        input.type === 'Tone' && !input.value
          ? { ...input, value: TONE_PAIRS[0] }
          : input
      );
      setAutomation(data);
      setPageData({
        title: data.title,
        subtitle: data.subtitle,
        inputs: inputsWithDefaults,
      });
    } catch (error) {
      console.error('Failed to fetch automation:', error);
    }
  };

  fetchAutomation();
}, [id]);

  // When the form is submitted, re-fetch and reinitialize.
  const handleUpdate = async () => {
    try {
      const updatedData = await getAutomationById(id);
      setAutomation(updatedData);
      setPageData({
        title: updatedData.title,
        subtitle: updatedData.subtitle,
        inputs: updatedData.inputs,
      });
      toast.success('Automation updated successfully');
    } catch (error) {
      toast.error('Failed to update automation');
    }
  };

  // Build and send a payload constructed from the current page elements.
  const callWebhook = async () => {
    if (!automation.webhookUrl) {
      toast.error("No webhook URL provided");
      return;
    }
    setIsCallingWebhook(true);
    try {
      const payload = {
        title: pageData.title,
        subtitle: pageData.subtitle,
        // For each input, create an array [label, type, value]
        inputs: pageData.inputs.map((input) => [
          input.label,
          input.type,
          input.value,
        ]),
      };

      const res = await fetch(automation.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Webhook call failed with status: ${res.status}`);
      }
      const data = await res.text();
      setWebhookResponse(data);
      toast.success("Webhook called successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to call webhook");
    } finally {
      setIsCallingWebhook(false);
    }
  };

  // Handlers for updating the pageData state.
  const handleTitleChange = (e) => {
    setPageData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSubtitleChange = (e) => {
    setPageData((prev) => ({ ...prev, subtitle: e.target.value }));
  };

  const handleInputChange = (index, newValue) => {
    setPageData((prev) => {
      const newInputs = [...prev.inputs];
      newInputs[index] = { ...newInputs[index], value: newValue };
      return { ...prev, inputs: newInputs };
    });
  };

  if (!automation || !pageData) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Back to Automations
      </BackButton>

      <PageLayout>
        <LeftPanel>
          <EditIcon onClick={() => setIsEditing(true)} size={20} />
          {/* Editable title and subtitle */}
          <TitleInput
            value={pageData.title}
            onChange={handleTitleChange}
            placeholder="Enter title..."
          />
          <SubtitleInput
            value={pageData.subtitle}
            onChange={handleSubtitleChange}
            placeholder="Enter subtitle..."
          />
          {pageData.inputs.map((input, index) => (
            <div key={input.id}>
              <InputLabel>{input.label}</InputLabel>
              {input.type === 'Text' ? (
                <TextArea
                  value={input.value}
                  placeholder="Enter text..."
                  rows={3}
                  style={{ width: '100%' }}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              ) : input.type === 'Audio' || input.type === 'Document' ? (
                // Replace the drop area with a file input so the selection is captured.
                <input
                  type="file"
                  style={{ width: '100%', padding: '0.5rem' }}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      e.target.files[0]?.name || ""
                    )
                  }
                />
              ) : input.type === 'Tone' ? (
                <select
                  value={input.value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  style={{ width: '100%' }}
                >
                  {TONE_PAIRS.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}
          <ButtonContainer>
            <Button
              onClick={callWebhook}
              disabled={isCallingWebhook || !automation.webhookUrl}
            >
              {isCallingWebhook
                ? "Calling Webhook..."
                : !automation.webhookUrl
                ? "Webhook URL required"
                : "Call Webhook"}
            </Button>
          </ButtonContainer>
        </LeftPanel>

        <RightPanel>
          <Title>Response</Title>
          <TextArea
            value={webhookResponse}
            placeholder="Response will appear here after submission..."
            rows={10}
            readOnly
            style={{ width: '100%' }}
          />
        </RightPanel>
      </PageLayout>

      {isEditing && (
        <AutomationForm
          onClose={() => setIsEditing(false)}
          onSuccess={handleUpdate} // Refresh automation data after update
          initialData={automation}
          mode="edit"
        />
      )}
    </PageContainer>
  );
};

export default AutomationDetail;
