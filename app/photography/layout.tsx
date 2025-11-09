import { ReactNode } from 'react';

export default function PhotographyLayout({
  children,
  modal
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
