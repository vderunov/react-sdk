import { useQuery } from '@tanstack/react-query';
import { type BigNumber, ethers } from 'ethers';
import { useErrorParser } from './useErrorParser';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function usePerpsGetOpenPosition({
  provider,
  walletAddress,
  perpsAccountId,
  market,
}: { provider?: ethers.providers.Web3Provider; walletAddress?: string; perpsAccountId?: ethers.BigNumber; market?: string }) {
  const { chainId } = useSynthetix();
  const errorParser = useErrorParser();

  const { data: PerpsMarketProxyContract } = useImportContract('PerpsMarketProxy');

  return useQuery<{
    accruedFunding: BigNumber;
    owedInterest: BigNumber;
    positionSize: BigNumber;
    totalPnl: BigNumber;
  }>({
    enabled: Boolean(chainId && provider && PerpsMarketProxyContract?.address && walletAddress && perpsAccountId && market),
    queryKey: [
      chainId,
      'PerpsGetOpenPosition',
      { market },
      { PerpsMarketProxy: PerpsMarketProxyContract?.address },
      perpsAccountId,
      { walletAddress },
    ],
    queryFn: async () => {
      if (!(chainId && provider && PerpsMarketProxyContract?.address && walletAddress && perpsAccountId && market)) {
        throw 'OMFG';
      }

      const signer = provider.getSigner(walletAddress);
      const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, signer);
      const openPosition = await PerpsMarketProxy.getOpenPosition(perpsAccountId, market);
      console.log({ openPosition });
      return openPosition;
    },
    throwOnError: (error) => {
      // TODO: show toast
      errorParser(error);
      return false;
    },
  });
}
