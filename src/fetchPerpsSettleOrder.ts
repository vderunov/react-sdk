import { type BigNumberish, ethers } from 'ethers';

export async function fetchPerpsSettleOrder({
  provider,
  walletAddress,
  PerpsMarketProxyContract,
  perpsAccountId,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: BigNumberish;
  PerpsMarketProxyContract: { address: string; abi: string[] };
  perpsAccountId: BigNumberish;
}) {
  const signer = provider.getSigner(walletAddress.toString());
  const PerpsMarketProxy = new ethers.Contract(PerpsMarketProxyContract.address, PerpsMarketProxyContract.abi, signer);

  console.time('fetchPerpsSettleOrder');
  const tx: ethers.ContractTransaction = await PerpsMarketProxy.settleOrder(perpsAccountId);
  console.timeEnd('fetchPerpsSettleOrder');
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
