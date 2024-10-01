import { ethers } from 'ethers';

export async function fetchAccountAvailableCollateral({
  provider,
  CoreProxyContract,
  accountId,
  tokenAddress,
}: {
  provider: ethers.providers.BaseProvider;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: ethers.BigNumber;
  tokenAddress: string;
}) {
  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, provider);
  console.time('fetchAccountAvailableCollateral');
  const accountAvailableCollateral = await CoreProxy.getAccountAvailableCollateral(accountId, tokenAddress);
  console.timeEnd('fetchAccountAvailableCollateral');
  return accountAvailableCollateral;
}
