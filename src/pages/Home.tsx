import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Home = () => {
  return (
    <PageContainer>
      <Title>Welcome to the Home Page</Title>
    </PageContainer>
  );
};

export default Home;
