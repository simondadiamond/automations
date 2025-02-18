import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { getAutomations, type Automation } from './lib/airtable';
import AutomationForm from './components/AutomationForm';
import AutomationCard from './components/AutomationCard';
import { Section, Container, Title, Subtitle, Button, Grid } from './theme';
import styled from 'styled-components';

const LoadingSpinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.borderColor};
  border-bottom-color: ${({ theme }) => theme.neonGreen};
  border-radius: 50%;
  margin: 0 auto;
`;

function App() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      const data = await getAutomations();
      setAutomations(data);
    } catch (error) {
      toast.error('Failed to load automations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <Toaster position="top-right" />
      
      <Container>
        <Title>
          <span>AI</span> Automations
        </Title>
        <Subtitle>
          Streamline your workflow with powerful AI-driven automation tools
        </Subtitle>

        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Add Automation
        </Button>

        <AnimatePresence>
          {showForm && (
            <AutomationForm
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                loadAutomations();
              }}
            />
          )}
        </AnimatePresence>

        <Grid>
          {loading ? (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            automations.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onDelete={loadAutomations}
              />
            ))
          )}
        </Grid>
      </Container>
    </Section>
  );
}

export default App