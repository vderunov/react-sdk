import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function usePerpsMetadata({
  provider,
  perpsMarketId,
}: { provider?: ethers.providers.BaseProvider; perpsMarketId?: ethers.BigNumber }) {
  const { chainId } = useSynthetix();
  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');

  return useQuery<{
    name: string;
    symbol: string;
  }>({
    enabled: Boolean(chainId && provider && perpsMarketId && PerpsMarketProxyContract?.address),
    queryKey: [
      chainId,
      'Perps Metadata',
      { PerpsMarketProxy: PerpsMarketProxyContract?.address },
      { perpsMarketId: perpsMarketId?.toString() },
    ],
    queryFn: async () => {
      if (!(chainId && provider && perpsMarketId && PerpsMarketProxyContract?.address)) {
        throw 'OMFG';
      }

      const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, provider);
      const { symbol, name } = await PerpsMarketProxy.metadata(perpsMarketId);

      return { symbol, name };
    },
  });
}
