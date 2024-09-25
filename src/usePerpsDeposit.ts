import { useMutation } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useSynthetix } from './useSynthetix';

export function usePerpsDeposit({
  onSuccess,
  tokenAddress,
  provider,
  walletAddress,
  perpsAccountId,
}: {
  onSuccess: () => void;
  tokenAddress?: string;
  provider?: ethers.providers.Web3Provider;
  walletAddress?: string;
  perpsAccountId?: ethers.BigNumber;
}) {
  const { chainId } = useSynthetix();

  return useMutation({
    mutationFn: async (amount: ethers.BigNumber) => {
      if (!(chainId && tokenAddress && provider && walletAddress && perpsAccountId)) {
        throw 'OMFG';
      }

      const signer = provider.getSigner(walletAddress);
      const Token = new ethers.Contract(tokenAddress, ['function deposit() payable'], signer);
      const tx = await Token.deposit({
        value: amount,
      });
      const txResult = await tx.wait();
      return txResult;
    },
    onSuccess: () => {
      onSuccess();
    },
  });
}
