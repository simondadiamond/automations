import styled from 'styled-components';
import { motion } from 'framer-motion';

// Common Components
export const Section = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.isDark ? theme.background : theme.cardBg};
  color: ${({ theme }) => theme.text};
`;

export const Container = styled.div<{ center?: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  text-align: ${({ center }) => center ? 'center' : 'left'};
`;

export const Title = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin: 40px 0;
  letter-spacing: -0.02em;
  text-align: center;

  span {
    background: ${({ theme }) => theme.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

// Button Components
const ButtonBase = styled(motion.button)<{ secondary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme, secondary }) => secondary ? 'transparent' : theme.neonGreen};
  color: ${({ theme, secondary }) => secondary ? theme.text : theme.background};
  border: ${({ theme, secondary }) => secondary ? `2px solid ${theme.primary}` : 'none'};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${({ theme, secondary }) => secondary ? 'none' : theme.glowGreen};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme, secondary }) => secondary ? theme.glowBlue : theme.glowGreen};
    background: ${({ theme, secondary }) => secondary ? theme.neonCyan : theme.neonGreen};
    border-color: ${({ theme, secondary }) => secondary ? theme.neonCyan : 'transparent'};
    color: ${({ theme, secondary }) => secondary ? 'black' : theme.background}; /* Change text color to black on hover for secondary buttons */
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Button = styled(ButtonBase).attrs(props => ({
  as: props.href ? 'a' : 'button',
}))``;

export const ButtonDarkBg = styled(ButtonBase)`
  background-color: transparent;
  color: ${({ theme }) => theme.textwhite};
`;

// Card Components
export const Card = styled(motion.div)<{ center?: boolean }>`
  padding: 1rem;
  background: ${({ theme }) => theme.isDark ? theme.cardBg : theme.background + ' !important'};
  border-radius: 1rem;
  text-align: ${({ center }) => center ? 'center' : 'left'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.glowBlue};
  }
`;

// Icon Components
export const IconWrapper = styled.div<{ center?: boolean }>`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ center }) => center ? '0 auto 1.5rem' : '0 0 1.5rem'};
  color: ${({ theme }) => theme.primary};
  box-shadow: ${({ theme }) => theme.glowBlue};
  border: 2px solid ${({ theme }) => theme.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.glowGreen};
    border-color: ${({ theme }) => theme.neonGreen};
    color: ${({ theme }) => theme.neonGreen};
  }
`;

// Grid Components
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

// Form Components
export const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  width: 100%;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

export const Input = styled.input`
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.5;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  background: ${({ theme }) => theme.inputbg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  min-height: 100px;
  outline: none;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.neonGreen};
    box-shadow: ${({ theme }) => theme.glowGreen};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.5;
  }
`;

// Modal Components
export const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

export const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

// Loading Components
export const LoadingSpinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.borderColor};
  border-bottom-color: ${({ theme }) => theme.neonGreen};
  border-radius: 50%;
  margin: 2rem auto;
`;

// Alert Components
export const Alert = styled.div<{ variant?: 'success' | 'error' | 'warning' | 'info' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: ${({ theme, variant }) => 
    variant === 'success' ? theme.success + '20' :
    variant === 'error' ? theme.error + '20' :
    variant === 'warning' ? theme.warning + '20' :
    theme.info + '20'};
  border: 1px solid ${({ theme, variant }) => 
    variant === 'success' ? theme.success :
    variant === 'error' ? theme.error :
    variant === 'warning' ? theme.warning :
    theme.info};
  color: ${({ theme }) => theme.text};
`;

// Badge Component
export const Badge = styled.span<{ variant?: 'success' | 'error' | 'warning' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ theme, variant }) => 
    variant === 'success' ? theme.success + '20' :
    variant === 'error' ? theme.error + '20' :
    variant === 'warning' ? theme.warning + '20' :
    theme.info + '20'};
  color: ${({ theme, variant }) => 
    variant === 'success' ? theme.success :
    variant === 'error' ? theme.error :
    variant === 'warning' ? theme.warning :
    theme.info};
`;

// Divider Component
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  margin: 1.5rem 0;
`;
