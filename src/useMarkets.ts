import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function useMarkets({ provider }: { provider?: ethers.providers.BaseProvider }) {
  const { chainId } = useSynthetix();
  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');

  return useQuery<ethers.BigNumber[]>({
    enabled: Boolean(chainId && provider && PerpsMarketProxyContract?.address),
    queryKey: [chainId, 'Markets', { PerpsMarketProxy: PerpsMarketProxyContract?.address }],
    queryFn: async () => {
      if (!(chainId && provider && PerpsMarketProxyContract?.address)) {
        throw new Error('OMFG');
      }

      const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, provider);

      const markets = await PerpsMarketProxy.getMarkets();

      return markets;
    },
  });
}
