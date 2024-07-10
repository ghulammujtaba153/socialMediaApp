// app/components/ClientLayout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

const ClientLayout = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default ClientLayout;
