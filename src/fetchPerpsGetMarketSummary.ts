import { ethers } from 'ethers';

export async function fetchPerpsGetMarketSummary({
  provider,
  marketId,
  PerpsMarketProxyContract,
}: {
  provider: ethers.providers.BaseProvider;
  marketId: ethers.BigNumber;
  PerpsMarketProxyContract: { address: string; abi: string[] };
}) {
  const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, provider);
  const marketSummary = await PerpsMarketProxy.getMarketSummary(marketId);
  return marketSummary;
}
