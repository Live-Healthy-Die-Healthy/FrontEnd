import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Make sure the container takes the full height of the viewport */
  text-align: center;
`;

export default function HomePage() {

  return (
    <Container>
      <h1>Home</h1>
    </Container>
  );
}
