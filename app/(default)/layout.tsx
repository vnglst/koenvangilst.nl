import { PropsWithChildren } from 'react';

import { Body } from 'components/Body';
import { Footer } from 'components/Footer';
import { Main } from 'components/Main';
import { Nav } from 'components/Nav';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Body>
      <Nav />
      <Main>{children}</Main>
      <Footer />
    </Body>
  );
}
