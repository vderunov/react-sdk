import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function usePerpsAccounts({
  provider,
  walletAddress,
}: {
  provider?: ethers.providers.BaseProvider;
  walletAddress?: string;
}) {
  const { chainId } = useSynthetix();
  const { data: PerpsAccountProxyContract } = useImportContract('PerpsAccountProxy');

  return useQuery({
    enabled: Boolean(chainId && provider && walletAddress && PerpsAccountProxyContract?.address),
    queryKey: [chainId, 'Perps Accounts', { PerpsAccountProxy: PerpsAccountProxyContract?.address }, { ownerAddress: walletAddress }],
    queryFn: async () => {
      if (!(chainId && provider && walletAddress && PerpsAccountProxyContract?.address)) throw 'OMFG';
      const PerpsAccountProxy = new ethers.Contract(PerpsAccountProxyContract.address, PerpsAccountProxyContract.abi, provider);
      const numberOfAccountTokens = await PerpsAccountProxy.balanceOf(walletAddress);
      if (numberOfAccountTokens.eq(0)) {
        // No accounts created yet
        return [];
      }
      const accountIndexes = Array.from(Array(numberOfAccountTokens.toNumber()).keys());
      const accounts = await Promise.all(accountIndexes.map((i) => PerpsAccountProxy.tokenOfOwnerByIndex(walletAddress, i)));
      return accounts;
    },
    select: (accounts) => accounts.map((accountId) => ethers.BigNumber.from(accountId)),
  });
}
