import { type BigNumberish, ethers } from 'ethers';

export async function fetchPositionCollateral({
  provider,
  CoreProxyContract,
  accountId,
  poolId,
  tokenAddress,
}: {
  provider: ethers.providers.BaseProvider;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: BigNumberish;
  poolId: BigNumberish;
  tokenAddress: BigNumberish;
}) {
  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, provider);
  const positionCollateral = await CoreProxy.getPositionCollateral(accountId, poolId, tokenAddress);
  console.log({ positionCollateral });
  return positionCollateral;
}
