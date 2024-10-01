import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useErrorParser } from './useErrorParser';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function usePerpsGetSettlementStrategy({
  provider,
  settlementStrategyId,
  market,
}: { settlementStrategyId?: string; provider?: ethers.providers.BaseProvider; market?: string }) {
  const { chainId } = useSynthetix();
  const errorParser = useErrorParser();

  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');

  return useQuery<{
    commitmentPriceDelay: ethers.BigNumber;
    disabled: boolean;
    feedId: string;
    priceVerificationContract: string;
    settlementDelay: ethers.BigNumber;
    settlementReward: ethers.BigNumber;
    settlementWindowDuration: ethers.BigNumber;
    strategyType: number;
  }>({
    enabled: Boolean(chainId && provider && PerpsMarketProxyContract?.address && settlementStrategyId && market),
    queryKey: [
      chainId,
      'PerpsGetSettlementStrategy',
      { PerpsMarketProxy: PerpsMarketProxyContract?.address },
      { market, settlementStrategyId },
    ],
    queryFn: async () => {
      if (!(chainId && provider && PerpsMarketProxyContract?.address && settlementStrategyId && market)) {
        throw 'OMFG';
      }

      const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, provider);
      const settlementStrategy = await PerpsMarketProxy.getSettlementStrategy(market, settlementStrategyId);
      console.log({ settlementStrategy });
      return settlementStrategy;
    },
    throwOnError: (error) => {
      // TODO: show toast
      errorParser(error);
      return false;
    },
  });
}
