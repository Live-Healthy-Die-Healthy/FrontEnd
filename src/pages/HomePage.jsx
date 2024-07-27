import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import ThreeModel from '../components/ThreeModel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

export default function HomePage() {

  return (
    <Container>
      <ThreeModel/>
    </Container>
  );
}