import { PropsWithChildren } from 'react';

import { Body } from 'components/Body';
import { Main } from 'components/Main';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Body>
      <Main>{children}</Main>
    </Body>
  );
}
