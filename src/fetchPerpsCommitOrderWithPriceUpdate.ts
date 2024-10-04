import { type BigNumberish, ethers } from 'ethers';

export async function fetchPerpsCommitOrderWithPriceUpdate({
  provider,
  walletAddress,
  PerpsMarketProxyContract,
  MulticallContract,
  orderCommitmentArgs,
  priceUpdateTxn,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  PerpsMarketProxyContract: { address: string; abi: string[] };
  MulticallContract: { address: string; abi: string[] };
  orderCommitmentArgs: {
    perpsMarketId: BigNumberish;
    perpsAccountId: BigNumberish;
    sizeDelta: BigNumberish;
    settlementStrategyId: BigNumberish;
    acceptablePrice: BigNumberish;
    referrer: BigNumberish;
    trackingCode: BigNumberish;
  };
  priceUpdateTxn: {
    target: BigNumberish;
    callData: BigNumberish;
    value: BigNumberish;
    requireSuccess: boolean;
  };
}) {
  const PerpsMarketPoxyInterface = new ethers.utils.Interface(PerpsMarketProxyContract.abi);
  const MulticallInterface = new ethers.utils.Interface(MulticallContract.abi);

  const commitOrderTxn = {
    target: PerpsMarketProxyContract.address,
    callData: PerpsMarketPoxyInterface.encodeFunctionData('commitOrder', [
      {
        marketId: orderCommitmentArgs.perpsMarketId,
        accountId: orderCommitmentArgs.perpsAccountId,
        sizeDelta: orderCommitmentArgs.sizeDelta,
        settlementStrategyId: orderCommitmentArgs.settlementStrategyId,
        acceptablePrice: orderCommitmentArgs.acceptablePrice,
        referrer: orderCommitmentArgs.referrer,
        trackingCode: orderCommitmentArgs.trackingCode,
      },
    ]),
    value: 0,
    requireSuccess: true,
  };
  console.log({ commitOrderTxn });
  const signer = provider.getSigner(walletAddress);

  const multicallTxn = {
    from: walletAddress,
    to: MulticallContract.address,
    data: MulticallInterface.encodeFunctionData('aggregate3Value', [[priceUpdateTxn, commitOrderTxn]]),
    value: priceUpdateTxn.value,
  };
  console.log({ multicallTxn });

  console.time('fetchPerpsCommitOrderWithPriceUpdate');
  const tx: ethers.ContractTransaction = await signer.sendTransaction(multicallTxn);
  console.timeEnd('fetchPerpsCommitOrderWithPriceUpdate');

  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
