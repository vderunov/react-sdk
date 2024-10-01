import { ethers } from 'ethers';

export async function delegateCollateral({
  provider,
  walletAddress,
  CoreProxyContract,
  accountId,
  poolId,
  tokenAddress,
  delegateAmount,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: ethers.BigNumber;
  poolId: ethers.BigNumber;
  tokenAddress: string;
  delegateAmount: ethers.BigNumber;
}) {
  const signer = provider.getSigner(walletAddress);
  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, signer);

  const delegateCollateralTxnArgs = [
    //
    accountId,
    poolId,
    tokenAddress,
    delegateAmount,
    ethers.utils.parseEther('1'), // Leverage
  ];
  console.log('delegateCollateralTxnArgs', delegateCollateralTxnArgs);

  console.time('delegateCollateral');
  const tx: ethers.ContractTransaction = await CoreProxy.delegateCollateral(...delegateCollateralTxnArgs);
  console.timeEnd('delegateCollateral');
  console.log({ tx });
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
