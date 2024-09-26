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
  const mintUsdTxnArgs = [
    //
    accountId,
    poolId,
    tokenAddress,
    mintUsdAmount,
  ];
  console.log('mintUsdTxnArgs', mintUsdTxnArgs);

  console.time('mintUsd');
  const tx: ethers.ContractTransaction = await CoreProxy.mintUsd(...mintUsdTxnArgs);
  console.timeEnd('mintUsd');
  console.log({ tx });
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
