import styled from 'styled-components';

// On exporte une div stylisé avec styled.div
export const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 80px;
  @media screen and (max-width: 800px) {
    padding: 20px 0;
  }
`;
