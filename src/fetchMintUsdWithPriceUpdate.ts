import { type BigNumberish, ethers } from 'ethers';

export async function fetchMintUsdWithPriceUpdate({
  provider,
  walletAddress,
  CoreProxyContract,
  MulticallContract,
  accountId,
  poolId,
  tokenAddress,
  mintUsdAmount,
  priceUpdateTxn,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: BigNumberish;
  CoreProxyContract: { address: string; abi: string[] };
  MulticallContract: { address: string; abi: string[] };
  accountId: BigNumberish;
  poolId: BigNumberish;
  tokenAddress: BigNumberish;
  mintUsdAmount: BigNumberish;
  priceUpdateTxn: {
    target: BigNumberish;
    callData: BigNumberish;
    value: BigNumberish;
    requireSuccess: boolean;
  };
}) {
  const CoreProxyInterface = new ethers.utils.Interface(CoreProxyContract.abi);
  const MulticallInterface = new ethers.utils.Interface(MulticallContract.abi);

  const mintUsdTxnArgs = [
    //
    accountId,
    poolId,
    tokenAddress,
    mintUsdAmount,
  ];
  console.log({ mintUsdTxnArgs });

  const mintUsdTxn = {
    target: CoreProxyContract.address,
    callData: CoreProxyInterface.encodeFunctionData('mintUsd', [...mintUsdTxnArgs]),
    value: 0,
    requireSuccess: true,
  };
  console.log({ mintUsdTxn });

  const signer = provider.getSigner(walletAddress.toString());
  const multicallTxn = {
    from: walletAddress.toString(),
    to: MulticallContract.address,
    data: MulticallInterface.encodeFunctionData('aggregate3Value', [[priceUpdateTxn, mintUsdTxn]]),
    value: priceUpdateTxn.value,
  };
  console.log({ multicallTxn });

  console.time('mintUsd');
  const tx: ethers.ContractTransaction = await signer.sendTransaction(multicallTxn);
  console.timeEnd('mintUsd');
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
