import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Edit, X } from 'lucide-react';
import { Card, Button, TextArea } from '../theme';
import { getAutomationById } from '../lib/airtable';
import { TONE_PAIRS } from '../constants/tones';
import AutomationForm from '../components/AutomationForm';
import { toast } from 'react-hot-toast';

// Helper function to read a file and return its contents as a data URL
const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

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

const TitleInput = styled.input`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
`;

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

const DropArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  background: ${({ isDragging }) => (isDragging ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)')};
  margin-top: 0.5rem;
  width: 100%;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    color: ${({ theme }) => theme.neonGreen};
  }
`;

const FileDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const RemoveIcon = styled(X)`
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: red;
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

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automation, setAutomation] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState("");
  const [isCallingWebhook, setIsCallingWebhook] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [isDragging, setIsDragging] = useState([]);

  useEffect(() => {
    const fetchAutomation = async () => {
      try {
        const data = await getAutomationById(id);
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
        setIsDragging(new Array(data.inputs.length).fill(false));
      } catch (error) {
        console.error('Failed to fetch automation:', error);
      }
    };

    fetchAutomation();
  }, [id]);

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

  const callWebhook = async () => {
    if (!automation.webhookUrl) {
      toast.error("No webhook URL provided");
      return;
    }
    setIsCallingWebhook(true);
    try {
      // Read file contents if files exist
      const audioData = audioFile ? await readFileContent(audioFile) : null;
      const documentData = documentFile ? await readFileContent(documentFile) : null;

      const payload = {
        title: pageData.title,
        subtitle: pageData.subtitle,
        inputs: pageData.inputs.map((input) => {
          if (input.type === 'Audio') {
            return [
              input.label,
              input.type,
              audioFile
                ? { fileName: audioFile.name, fileData: audioData }
                : input.value,
            ];
          } else if (input.type === 'Document') {
            return [
              input.label,
              input.type,
              documentFile
                ? { fileName: documentFile.name, fileData: documentData }
                : input.value,
            ];
          }
          return [input.label, input.type, input.value];
        }),
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

  const handleFileDrop = (index, files, type) => {
    if (files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const fileType = file.type;

      // Validate file type
      if (type === 'Audio' && !fileType.startsWith('audio/')) {
        toast.error('Please upload a valid audio file');
        return;
      }
      if (type === 'Document' && !['application/', 'text/xml', 'application/json', 'application/xml'].some(prefix => fileType.startsWith(prefix))) {
        toast.error('Please upload a valid document file');
        return;
      }
      if (fileType === 'application/x-msdownload') {
        toast.error('Executable files are not allowed');
        return;
      }

      if (type === 'Audio') {
        setAudioFile(file);
      } else if (type === 'Document') {
        setDocumentFile(file);
      }
      setPageData((prev) => {
        const newInputs = [...prev.inputs];
        newInputs[index] = { ...newInputs[index], value: fileName };
        return { ...prev, inputs: newInputs };
      });
    }
    setIsDragging((prev) => {
      const newDragging = [...prev];
      newDragging[index] = false;
      return newDragging;
    });
  };

  const removeFile = (index, type) => {
    if (type === 'Audio') {
      setAudioFile(null);
    } else if (type === 'Document') {
      setDocumentFile(null);
    }
    setPageData((prev) => {
      const newInputs = [...prev.inputs];
      newInputs[index] = { ...newInputs[index], value: "" };
      return { ...prev, inputs: newInputs };
    });
  };

  const handleDragEnter = (index) => {
    setIsDragging((prev) => {
      const newDragging = [...prev];
      newDragging[index] = true;
      return newDragging;
    });
  };

  const handleDragLeave = (index) => {
    setIsDragging((prev) => {
      const newDragging = [...prev];
      newDragging[index] = false;
      return newDragging;
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
              ) : input.type === 'Audio' ? (
                audioFile ? (
                  <FileDisplay>
                    <span>{audioFile.name}</span>
                    <RemoveIcon onClick={() => removeFile(index, 'Audio')} size={16} />
                  </FileDisplay>
                ) : (
                  <DropArea
                    isDragging={isDragging[index]}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileDrop(index, e.dataTransfer.files, 'Audio');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragLeave={() => handleDragLeave(index)}
                  >
                    Drop your audio file here
                  </DropArea>
                )
              ) : input.type === 'Document' ? (
                documentFile ? (
                  <FileDisplay>
                    <span>{documentFile.name}</span>
                    <RemoveIcon onClick={() => removeFile(index, 'Document')} size={16} />
                  </FileDisplay>
                ) : (
                  <DropArea
                    isDragging={isDragging[index]}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileDrop(index, e.dataTransfer.files, 'Document');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragLeave={() => handleDragLeave(index)}
                  >
                    Drop your document file here
                  </DropArea>
                )
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
          onSuccess={handleUpdate}
          initialData={automation}
          mode="edit"
        />
      )}
    </PageContainer>
  );
};

export default AutomationDetail;
