import { useMutation } from '@tanstack/react-query';
import type { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { depositCollateral } from './depositCollateral';
import { fetchApproveToken } from './fetchApproveToken';
import { fetchTokenAllowance } from './fetchTokenAllowance';
import { fetchTokenBalance } from './fetchTokenBalance';
import { useErrorParser } from './useErrorParser';
import { useImportContract } from './useImports';
import { useSynthetix } from './useSynthetix';

export function useDeposit({
  provider,
  walletAddress,
  accountId,
  poolId,
  collateralTypeTokenAddress,
  onSuccess,
}: {
  provider?: ethers.providers.Web3Provider;
  walletAddress?: BigNumberish;
  accountId?: BigNumberish;
  poolId?: BigNumberish;
  collateralTypeTokenAddress?: BigNumberish;
  onSuccess: () => void;
}) {
  const { chainId, queryClient } = useSynthetix();
  const errorParser = useErrorParser();

  const { data: CoreProxyContract } = useImportContract('CoreProxy');

  return useMutation({
    mutationFn: async (depositAmount: BigNumberish) => {
      if (!(chainId && provider && CoreProxyContract && walletAddress && accountId && poolId && collateralTypeTokenAddress)) {
        throw 'OMFG';
      }

      if (ethers.BigNumber.from(depositAmount).lte(0)) {
        throw new Error('Amount required');
      }

      const freshBalance = await fetchTokenBalance({
        provider,
        ownerAddress: walletAddress,
        tokenAddress: collateralTypeTokenAddress,
      });
      console.log('freshBalance', freshBalance);

      if (freshBalance.lt(depositAmount)) {
        throw new Error('Not enough balance');
      }

      const freshAllowance = await fetchTokenAllowance({
        provider,
        ownerAddress: walletAddress,
        tokenAddress: collateralTypeTokenAddress,
        spenderAddress: CoreProxyContract?.address,
      });
      console.log('freshAllowance', freshAllowance);

      if (freshAllowance.lt(depositAmount)) {
        await fetchApproveToken({
          provider,
          walletAddress,
          tokenAddress: collateralTypeTokenAddress,
          spenderAddress: CoreProxyContract.address,
          allowance: ethers.BigNumber.from(depositAmount).sub(freshAllowance),
        });
      }

      console.log('-> depositCollateral');
      await depositCollateral({
        provider,
        walletAddress,
        CoreProxyContract,
        accountId,
        tokenAddress: collateralTypeTokenAddress,
        depositAmount,
      });
    },
    throwOnError: (error) => {
      // TODO: show toast
      errorParser(error);
      return false;
    },
    onSuccess: () => {
      if (!queryClient) return;

      // Intentionally do not await
      queryClient.invalidateQueries({
        queryKey: [
          chainId,
          'AccountAvailableCollateral',
          { CoreProxy: CoreProxyContract?.address },
          {
            accountId: accountId ? ethers.BigNumber.from(accountId).toHexString() : undefined,
            tokenAddress: collateralTypeTokenAddress,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          chainId,
          'PositionCollateral',
          { CoreProxy: CoreProxyContract?.address },
          {
            accountId: accountId ? ethers.BigNumber.from(accountId).toHexString() : undefined,
            poolId: poolId ? ethers.BigNumber.from(poolId).toHexString() : undefined,
            tokenAddress: collateralTypeTokenAddress,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [chainId, 'Balance', { tokenAddress: collateralTypeTokenAddress, ownerAddress: walletAddress }],
      });

      onSuccess();
    },
  });
}
