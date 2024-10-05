import { ethers } from 'ethers';

export async function fetchCollateralPrice({
  provider,
  CoreProxyContract,
  tokenAddress,
}: {
  provider: ethers.providers.BaseProvider;
  CoreProxyContract: { address: string; abi: string[] };
  tokenAddress: string;
}) {
  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, provider);
  console.time('fetchCollateralPrice');
  const collateralPrice = await CoreProxy.getCollateralPrice(tokenAddress);
  console.timeEnd('fetchCollateralPrice');
  return collateralPrice;
}
