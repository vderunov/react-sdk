import { useQuery } from '@tanstack/react-query';
import type { ethers } from 'ethers';
import { fetchGetMarketSummary } from './fetchGetMarketSummary';
import { fetchGetMarketSummaryWithPriceUpdate } from './fetchGetMarketSummaryWithPriceUpdate';
import { useImportContract } from './useImports';
import { usePriceUpdateTxn } from './usePriceUpdateTxn';
import { useSynthetix } from './useSynthetix';

interface GetMarketSummary {
  skew: ethers.BigNumber;
  size: ethers.BigNumber;
  maxOpenInterest: ethers.BigNumber;
  currentFundingRate: ethers.BigNumber;
  currentFundingVelocity: ethers.BigNumber;
  indexPrice: ethers.BigNumber;
}

export function useGetMarketSummary({
  provider,
  priceIds,
  marketId,
}: { provider?: ethers.providers.BaseProvider; priceIds?: string[]; marketId: ethers.BigNumber }) {
  const { chainId } = useSynthetix();
  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');
  const { data: MulticallContract } = useImportContract('Multicall');
  const { data: priceUpdateTxn } = usePriceUpdateTxn({ provider, priceIds });

  return useQuery<GetMarketSummary>({
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
        return await fetchGetMarketSummaryWithPriceUpdate({
          provider,
          marketId,
          PerpsMarketProxyContract,
          MulticallContract,
          priceUpdateTxn,
        });
      }

      return await fetchGetMarketSummary({ provider, marketId, PerpsMarketProxyContract });
    },
  });
}
