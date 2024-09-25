import { useQuery } from '@tanstack/react-query';
import type { ethers } from 'ethers';
import { fetchPerpsGetMarketSummary } from './fetchPerpsGetMarketSummary';
import { fetchPerpsGetMarketSummaryWithPriceUpdate } from './fetchPerpsGetMarketSummaryWithPriceUpdate';
import { useImportContract } from './useImports';
import { usePriceUpdateTxn } from './usePriceUpdateTxn';
import { useSynthetix } from './useSynthetix';

interface PerpsGetMarketSummary {
  skew: ethers.BigNumber;
  size: ethers.BigNumber;
  maxOpenInterest: ethers.BigNumber;
  currentFundingRate: ethers.BigNumber;
  currentFundingVelocity: ethers.BigNumber;
  indexPrice: ethers.BigNumber;
}

export function usePerpsGetMarketSummary({
  provider,
  priceIds,
  marketId,
}: { provider?: ethers.providers.BaseProvider; priceIds?: string[]; marketId: ethers.BigNumber }) {
  const { chainId } = useSynthetix();
  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');
  const { data: MulticallContract } = useImportContract('Multicall');
  const { data: priceUpdateTxn } = usePriceUpdateTxn({ provider, priceIds });

  return useQuery<PerpsGetMarketSummary>({
    enabled: Boolean(
      chainId && provider && priceIds && marketId && PerpsMarketProxyContract?.address && MulticallContract?.address && priceUpdateTxn
    ),
    queryKey: [
      chainId,
      'Perps GetMarketSummary',
      { PerpsMarketProxy: PerpsMarketProxyContract?.address, Multicall: MulticallContract?.address },
      { marketId: marketId.toString() },
    ],
    queryFn: async () => {
      if (
        !(chainId && provider && priceIds && marketId && PerpsMarketProxyContract?.address && MulticallContract?.address && priceUpdateTxn)
      ) {
        throw 'OMFG';
      }

      if (priceUpdateTxn.value) {
        return await fetchPerpsGetMarketSummaryWithPriceUpdate({
          provider,
          marketId,
          PerpsMarketProxyContract,
          MulticallContract,
          priceUpdateTxn,
        });
      }

      return await fetchPerpsGetMarketSummary({ provider, marketId, PerpsMarketProxyContract });
    },
  });
}
