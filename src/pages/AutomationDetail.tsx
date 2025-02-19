import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, X, Edit } from 'lucide-react'; // Import Edit icon
import { Card, Button, TextArea } from '../theme';
import { getAutomationById, updateAutomation } from '../lib/airtable'; // Ensure you have this function to fetch automation details
import { TONE_PAIRS } from '../constants/tones';
import AutomationForm from '../components/AutomationForm'; // Import the AutomationForm component
import { toast } from 'react-hot-toast'; // Import toast

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

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 2000px;
  margin: 0 auto;
`;

const LeftPanel = styled(Card)`
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative; /* For positioning the edit icon */
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

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2rem;
`;

const InputLabel = styled.span`
  color: ${({ theme }) => theme.neonCyan};
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
`;

const InputValue = styled.p`
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const DropArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  background: rgba(0, 0, 0, 0.2);
  margin-top: 0.5rem;
  width: 100%; /* Set width to 100% */

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

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automation, setAutomation] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchAutomation = async () => {
      try {
        const data = await getAutomationById(id);
        console.log('Fetched Automation Data:', data); // Log the fetched data
        setAutomation(data);
      } catch (error) {
        console.error('Failed to fetch automation:', error);
      }
    };

    fetchAutomation();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await updateAutomation(id, updatedData);
      toast.success('Automation updated successfully');
      setIsEditing(false); // Close the modal after saving
      const data = await getAutomationById(id); // Refresh the data
      setAutomation(data);
    } catch (error) {
      toast.error('Failed to update automation');
    }
  };

  if (!automation) {
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
          <Title>{automation.title}</Title>
          <Subtitle>{automation.subtitle}</Subtitle>
          {automation.inputs.map((input) => (
            <div key={input.id}>
              <InputLabel>{input.label}</InputLabel>
              {input.type === 'Text' ? (
                <TextArea
                  value={input.value}
                  placeholder="Enter text..."
                  rows={3}
                  onChange={(e) => handleInputChange(input.id, 'value', e.target.value)} // Make it editable
                  style={{ width: '100%' }} // Ensure full width
                />
              ) : input.type === 'Audio' ? (
                <DropArea>Drop your audio file here</DropArea>
              ) : input.type === 'Document' ? (
                <DropArea>Drop your document here</DropArea>
              ) : input.type === 'Tone' ? (
                <select defaultValue={input.value} style={{ width: '100%' }}>
                  {TONE_PAIRS.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}
        </LeftPanel>

        <RightPanel>
          <Title>Response</Title>
          <InputValue>
            Response will appear here after submission...
          </InputValue>
        </RightPanel>
      </PageLayout>

      {isEditing && (
        <AutomationForm
          onClose={() => setIsEditing(false)}
          onSuccess={handleUpdate}
          initialData={automation} // Pass the current automation data to the form
        />
      )}
    </PageContainer>
  );
};

export default AutomationDetail;
