import { ethers } from 'ethers';

export async function fetchAccountCollateral({
  provider,
  CoreProxyContract,
  accountId,
  tokenAddress,
}: {
  provider: ethers.providers.BaseProvider;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: ethers.BigNumberish;
  tokenAddress: string;
}) {
  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, provider);
  console.time('fetchAccountCollateral');
  const accountCollateral = await CoreProxy.getAccountCollateral(accountId, tokenAddress);
  console.timeEnd('fetchAccountCollateral');
  return {
    totalAssigned: accountCollateral.totalAssigned,
    totalDeposited: accountCollateral.totalDeposited,
    totalLocked: accountCollateral.totalLocked,
  };
}
