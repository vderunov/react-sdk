import { ethers } from 'ethers';

export async function fetchMintUsd({
  provider,
  walletAddress,
  CoreProxyContract,
  accountId,
  poolId,
  tokenAddress,
  mintUsdAmount,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: ethers.BigNumber;
  poolId: ethers.BigNumber;
  tokenAddress: string;
  mintUsdAmount: ethers.BigNumber;
}) {
  const signer = provider.getSigner(walletAddress);

  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, signer);
  const tx: ethers.ContractTransaction = await CoreProxy.mintUsd(accountId, poolId, tokenAddress, mintUsdAmount);
  const txResult = await tx.wait();

  return txResult;
}
