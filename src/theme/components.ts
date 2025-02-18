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
`;

// Button Component
const ButtonBase = styled(motion.button)<{ secondary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: ${({ theme, secondary }) => secondary ? 'transparent' : theme.neonGreen};
  color: ${({ theme, secondary }) => secondary ? theme.text : theme.background};
  border: ${({ theme, secondary }) => secondary ? `2px solid ${theme.primary}` : 'none'};
  border-radius: 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${({ theme, secondary }) => secondary ? 'none' : theme.glowGreen};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme, secondary }) => secondary ? theme.glowBlue : theme.glowGreen};
    background: ${({ theme, secondary }) => secondary ? theme.neonCyan : theme.neonGreen};
    border: ${({ theme, secondary }) => secondary ? `2px solid ${theme.neonCyan}` : 'none'};
    color: ${({ theme }) => theme.background};
  }
`;

export const ButtonDarkBg = styled(ButtonBase)`
  background-color: transparent;
  color: ${({ theme }) => theme.textwhite};
`;

export const Button = styled(ButtonBase).attrs(props => ({
  as: props.href ? 'a' : 'button',
}))``;

// Card Components
export const Card = styled(motion.div)<{ center?: boolean }>`
  padding: 2rem;
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
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ center }) => center ? '0 auto 1.5rem' : '0 0 1.5rem'};
  font-size: 1.75rem;
  color: ${({ theme }) => theme.primary};
  box-shadow: ${({ theme }) => theme.glowBlue};
  border: 2px solid ${({ theme }) => theme.primary};
`;

// Grid Components
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

// Form Components
export const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 3rem;
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
  text-align: left;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-align: left;
  display: block;
`;

export const Input = styled.input`
  padding: 0.75rem;
  background: ${({ theme }) => theme.inputbg};
  border: 1px solid #CCCCCC;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  color: ${({ theme }) => theme.text};
  transition: all 0.2s ease;

  &:focus {
    border-color: #00FF99;
    box-shadow: 0 0 5px rgba(0, 255, 153, 0.5);
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.5;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  background: ${({ theme }) => theme.inputbg};
  border: 1px solid #CCCCCC;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 150px;
  outline: none;
  color: ${({ theme }) => theme.text};
  transition: all 0.2s ease;

  &:focus {
    border-color: #00FF99;
    box-shadow: 0 0 5px rgba(0, 255, 153, 0.5);
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.5;
  }
`;