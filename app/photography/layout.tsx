import React, { PropsWithChildren } from 'react';

import { Container } from 'components/Container';

export default function Layout({ children, modal }: PropsWithChildren<{ modal: React.ReactNode }>) {
  return (
    <Container footer={false} nav={true}>
      {children}
      {modal}
    </Container>
  );
}
