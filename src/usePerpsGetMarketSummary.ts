import { useQuery } from '@tanstack/react-query';
import type { ethers } from 'ethers';
import { fetchPerpsGetMarketSummary } from './fetchPerpsGetMarketSummary';
import { fetchPerpsGetMarketSummaryWithPriceUpdate } from './fetchPerpsGetMarketSummaryWithPriceUpdate';
import { useImportContract } from './useImports';
import { usePriceUpdateTxn } from './usePriceUpdateTxn';
import { useSynthetix } from './useSynthetix';

export function usePerpsGetMarketSummary({
  provider,
  priceIds,
  perpsMarketId,
}: { provider?: ethers.providers.BaseProvider; priceIds?: string[]; perpsMarketId: ethers.BigNumber }) {
  const { chainId } = useSynthetix();
  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');
  const { data: MulticallContract } = useImportContract('Multicall');
  const { data: priceUpdateTxn } = usePriceUpdateTxn({ provider, priceIds });

  return useQuery({
    enabled: Boolean(
      chainId && provider && priceIds && perpsMarketId && PerpsMarketProxyContract?.address && MulticallContract?.address && priceUpdateTxn
    ),
    queryKey: [
      chainId,
      'Perps GetMarketSummary',
      { PerpsMarketProxy: PerpsMarketProxyContract?.address, Multicall: MulticallContract?.address },
      { perpsMarketId: perpsMarketId.toString() },
    ],
    queryFn: async () => {
      if (
        !(
          chainId &&
          provider &&
          priceIds &&
          perpsMarketId &&
          PerpsMarketProxyContract?.address &&
          MulticallContract?.address &&
          priceUpdateTxn
        )
      ) {
        throw 'OMFG';
      }

      if (priceUpdateTxn.value) {
        return await fetchPerpsGetMarketSummaryWithPriceUpdate({
          provider,
          perpsMarketId,
          PerpsMarketProxyContract,
          MulticallContract,
          priceUpdateTxn,
        });
      }

      return await fetchPerpsGetMarketSummary({ provider, perpsMarketId, PerpsMarketProxyContract });
    },
  });
}
