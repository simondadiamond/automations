import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --electric-blue: #007BFF;
    --midnight-navy: #1A1F36;
    --graphite-gray: #2E2E2E;
    --silver-gray: #B0BEC5;
    --neon-green: #00FF99;
    --neon-cyan: #00E7FF;
    --text: #FFFFFF;
    --background: #1A1F36;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-family);
    color: var(--text);
    line-height: 1.5;
    background: var(--background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 900;
    letter-spacing: -0.025em;
    color: #FFFFFF;
  }

  a {
    color: var(--neon-cyan);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: var(--neon-green);
      text-shadow: 0 0 10px rgba(0, 231, 255, 0.5);
    }
  }

  button {
    font-family: var(--font-family);
  }

  ::selection {
    background: var(--neon-cyan);
    color: var(--midnight-navy);
  }
`;