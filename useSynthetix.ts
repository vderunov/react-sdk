import { QueryClient } from '@tanstack/react-query';
import React from 'react';

export const SynthetixContext = React.createContext<{
  chainId?: number;
  setChainId: (chainId: number) => void;
  preset: string;
  setPreset: (preset: string) => void;
  queryClient?: QueryClient;
  setQueryClient: (queryClient: QueryClient) => void;
}>({
  chainId: undefined,
  setChainId: () => {},
  preset: 'main',
  setPreset: () => {},
  queryClient: undefined,
  setQueryClient: () => {},
});

export function getDefaultQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        throwOnError: (e) => {
          console.error(e);
          return false;
        },
      },
      mutations: {
        retry: false,
        throwOnError: (e) => {
          console.error(e);
          return false;
        },
      },
    },
  });
}

export function SynthetixProvider({
  chainId: initialChainId,
  preset: initialPreset = 'main',
  queryClient: initialQueryClient,
  children,
}: {
  chainId?: number;
  preset: string;
  queryClient?: QueryClient;
  children?: React.ReactNode;
}) {
  const [chainId, setChainId] = React.useState(initialChainId);
  const [preset, setPreset] = React.useState(initialPreset);
  const [queryClient, setQueryClient] = React.useState(initialQueryClient ?? getDefaultQueryClient());

  return React.createElement(
    SynthetixContext.Provider,
    {
      value: {
        chainId,
        setChainId,
        preset,
        setPreset,
        queryClient,
        setQueryClient,
      },
    },
    children
  );
}

export function useSynthetix() {
  return React.useContext(SynthetixContext);
}
