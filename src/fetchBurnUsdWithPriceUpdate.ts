import { type BigNumberish, ethers } from 'ethers';

export async function fetchBurnUsdWithPriceUpdate({
  provider,
  walletAddress,
  CoreProxyContract,
  MulticallContract,
  accountId,
  poolId,
  tokenAddress,
  burnUsdAmount,
  priceUpdateTxn,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: BigNumberish;
  CoreProxyContract: { address: string; abi: string[] };
  MulticallContract: { address: string; abi: string[] };
  accountId: BigNumberish;
  poolId: BigNumberish;
  tokenAddress: BigNumberish;
  burnUsdAmount: BigNumberish;
  priceUpdateTxn: {
    target: BigNumberish;
    callData: BigNumberish;
    value: BigNumberish;
    requireSuccess: boolean;
  };
}) {
  const CoreProxyInterface = new ethers.utils.Interface(CoreProxyContract.abi);
  const MulticallInterface = new ethers.utils.Interface(MulticallContract.abi);

  const burnUsdTxnArgs = [
    //
    accountId,
    poolId,
    tokenAddress,
    burnUsdAmount,
  ];
  console.log('burnUsdTxnArgs', burnUsdTxnArgs);

  const burnUsdTxn = {
    target: CoreProxyContract.address,
    callData: CoreProxyInterface.encodeFunctionData('burnUsd', [
      //
      ...burnUsdTxnArgs,
    ]),
    value: 0,
    requireSuccess: true,
  };
  console.log('burnUsdTxn', burnUsdTxn);

  const signer = provider.getSigner(walletAddress.toString());

  const multicallTxn = {
    from: walletAddress.toString(),
    to: MulticallContract.address,
    data: MulticallInterface.encodeFunctionData('aggregate3Value', [[priceUpdateTxn, burnUsdTxn]]),
    value: priceUpdateTxn.value,
  };
  console.log({ multicallTxn });

  console.time('burnUsd');
  const tx: ethers.ContractTransaction = await signer.sendTransaction(multicallTxn);
  console.timeEnd('burnUsd');
  console.log({ tx });
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
