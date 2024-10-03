import { type BigNumberish, ethers } from 'ethers';

export async function fetchWithdrawCollateral({
  provider,
  walletAddress,
  CoreProxyContract,
  accountId,
  tokenAddress,
  withdrawAmount,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: BigNumberish;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: BigNumberish;
  tokenAddress: BigNumberish;
  withdrawAmount: BigNumberish;
}) {
  const signer = provider.getSigner(walletAddress.toString());
  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, signer);

  const withdrawCollateralTxnArgs = [
    //
    accountId,
    tokenAddress,
    withdrawAmount,
  ];
  console.log({ withdrawCollateralTxnArgs });

  console.time('withdrawCollateral');
  const tx: ethers.ContractTransaction = await CoreProxy.withdraw(...withdrawCollateralTxnArgs);
  console.timeEnd('withdrawCollateral');
  console.log({ tx });
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
