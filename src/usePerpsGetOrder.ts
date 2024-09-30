import { useQuery } from '@tanstack/react-query';
import { type BigNumber, ethers } from 'ethers';
import { useErrorParser } from './useErrorParser';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function usePerpsGetOrder({
  provider,
  perpsAccountId,
}: { provider?: ethers.providers.BaseProvider; perpsAccountId?: ethers.BigNumber }) {
  const { chainId } = useSynthetix();
  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');

  const errorParser = useErrorParser();

  return useQuery<{
    commitmentTime: BigNumber;
    request: {
      marketId: BigNumber;
      accountId: BigNumber;
      sizeDelta: BigNumber;
      settlementStrategyId: BigNumber;
      acceptablePrice: BigNumber;
      trackingCode: string;
      referrer: string;
    };
  }>({
    enabled: Boolean(chainId && PerpsMarketProxyContract?.address && provider && perpsAccountId),
    queryKey: [chainId, 'PerpsGetOrder', { PerpsMarketProxy: PerpsMarketProxyContract?.address }, perpsAccountId],
    queryFn: async () => {
      if (!(chainId && PerpsMarketProxyContract?.address && provider && perpsAccountId)) {
        throw 'OMFG';
      }

      const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, provider);
      const order = await PerpsMarketProxy.getOrder(perpsAccountId);
      console.log({ order });
      return order;
    },
    throwOnError: (error) => {
      // TODO: show toast
      errorParser(error);
      return false;
    },
  });
}
