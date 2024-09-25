import { useMutation } from '@tanstack/react-query';
import type { ethers } from 'ethers';
import { fetchMintUsd } from './fetchMintUsd';
import { fetchMintUsdWithPriceUpdate } from './fetchMintUsdWithPriceUpdate';
import { fetchPriceUpdateTxn } from './fetchPriceUpdateTxn';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

interface CollateralType {
  address: string;
  decimals: number;
  depositingEnabled: boolean;
  issuanceRatioD18: ethers.BigNumber;
  liquidationRatioD18: ethers.BigNumber;
  liquidationRewardD18: ethers.BigNumber;
  minDelegationD18: ethers.BigNumber;
  name: string;
  oracleNodeId: string;
  symbol: string;
  tokenAddress: string;
}

export function useMintUsd({
  provider,
  priceIds,
  walletAddress,
  accountId,
  collateralType,
  poolId,
  onSuccess,
}: {
  provider?: ethers.providers.Web3Provider;
  priceIds?: string[];
  walletAddress?: string;
  accountId?: ethers.BigNumber;
  collateralType?: CollateralType;
  poolId?: ethers.BigNumber;
  onSuccess: ({ priceUpdated }: { priceUpdated: boolean }) => void;
}) {
  const { chainId } = useSynthetix();
  const { data: CoreProxyContract } = useImportContract('CoreProxy');
  const { data: MulticallContract } = useImportContract('Multicall');
  const { data: PythERC7412WrapperContract } = useImportContract('PythERC7412Wrapper');

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
          collateralType
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

      if (freshPriceUpdateTxn.value) {
        await fetchMintUsdWithPriceUpdate({
          provider,
          walletAddress,
          CoreProxyContract,
          MulticallContract,
          accountId,
          poolId,
          tokenAddress: collateralType.address,
          mintUsdAmount,
          priceUpdateTxn: freshPriceUpdateTxn,
        });
      } else {
        await fetchMintUsd({
          walletAddress,
          provider,
          CoreProxyContract,
          accountId,
          poolId,
          tokenAddress: collateralType.address,
          mintUsdAmount,
        });
      }
      return { priceUpdated: true };
    },
    onSuccess: ({ priceUpdated }) => {
      onSuccess({ priceUpdated });
    },
  });
}
