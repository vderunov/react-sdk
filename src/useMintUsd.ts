import { useMutation } from '@tanstack/react-query';
import type { ethers } from 'ethers';
import { fetchMintUsd } from './fetchMintUsd';
import { fetchMintUsdWithPriceUpdate } from './fetchMintUsdWithPriceUpdate';
import { fetchPriceUpdateTxn } from './fetchPriceUpdateTxn';
import { useErrorParser } from './useErrorParser';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function useMintUsd({
  provider,
  priceIds,
  walletAddress,
  accountId,
  collateralTokenAddress,
  poolId,
  onSuccess,
}: {
  provider?: ethers.providers.Web3Provider;
  priceIds?: string[];
  walletAddress?: string;
  accountId?: ethers.BigNumber;
  collateralTokenAddress?: string;
  poolId?: ethers.BigNumber;
  onSuccess: ({ priceUpdated }: { priceUpdated: boolean }) => void;
}) {
  const { chainId } = useSynthetix();
  const { data: CoreProxyContract } = useImportContract('CoreProxy');
  const { data: MulticallContract } = useImportContract('Multicall');
  const { data: PythERC7412WrapperContract } = useImportContract('PythERC7412Wrapper');
  const errorParser = useErrorParser();

  return useMutation({
    retry: false,
    mutationFn: async (mintUsdAmount: ethers.BigNumber) => {
      if (
        !(
          chainId &&
          provider &&
          walletAddress &&
          CoreProxyContract &&
          MulticallContract &&
          PythERC7412WrapperContract &&
          priceIds &&
          accountId &&
          poolId &&
          collateralTokenAddress
        )
      ) {
        throw 'OMFG';
      }

      if (mintUsdAmount.eq(0)) {
        throw new Error('Amount required');
      }

      const freshPriceUpdateTxn = await fetchPriceUpdateTxn({
        provider,
        MulticallContract,
        PythERC7412WrapperContract,
        priceIds,
      });
      console.log({ freshPriceUpdateTxn });

      if (freshPriceUpdateTxn.value) {
        console.log('-> fetchMintUsdWithPriceUpdate');
        await fetchMintUsdWithPriceUpdate({
          provider,
          walletAddress,
          CoreProxyContract,
          MulticallContract,
          accountId,
          poolId,
          tokenAddress: collateralTokenAddress,
          mintUsdAmount,
          priceUpdateTxn: freshPriceUpdateTxn,
        });
      } else {
        console.log('-> fetchMintUsd');
        await fetchMintUsd({
          walletAddress,
          provider,
          CoreProxyContract,
          accountId,
          poolId,
          tokenAddress: collateralTokenAddress,
          mintUsdAmount,
        });
      }
      return { priceUpdated: true };
    },
    throwOnError: (error) => {
      // TODO: show toast
      errorParser(error);
      return false;
    },
    onSuccess: ({ priceUpdated }) => {
      onSuccess({ priceUpdated });
    },
  });
}
