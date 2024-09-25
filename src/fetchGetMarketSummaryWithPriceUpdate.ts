import { ethers } from 'ethers';

export async function fetchGetMarketSummaryWithPriceUpdate({
  provider,
  marketId,
  PerpsMarketProxyContract,
  MulticallContract,
  priceUpdateTxn,
}: {
  provider: ethers.providers.BaseProvider;
  marketId: ethers.BigNumber;
  PerpsMarketProxyContract: { address: string; abi: string[] };
  MulticallContract: { address: string; abi: string[] };
  priceUpdateTxn: {
    target: string;
    callData: string;
    value: number;
    requireSuccess: boolean;
  };
}) {
  const PerpsMarketProxyInterface = new ethers.utils.Interface(PerpsMarketProxyContract.abi);
  const MulticallInterface = new ethers.utils.Interface(MulticallContract.abi);

  const getMarketSummaryTxn = {
    target: PerpsMarketProxyContract.address,
    callData: PerpsMarketProxyInterface.encodeFunctionData('getMarketSummary', [marketId]),
    value: 0,
    requireSuccess: true,
  };

  const response = await provider.call({
    to: MulticallContract.address,
    data: MulticallInterface.encodeFunctionData('aggregate3Value', [[priceUpdateTxn, getMarketSummaryTxn]]),
    value: priceUpdateTxn.value,
  });

  if (response) {
    const decodedMulticall = MulticallInterface.decodeFunctionResult('aggregate3Value', response);
    if (decodedMulticall?.returnData?.[1]?.returnData) {
      const getMarketSummaryTxnData = decodedMulticall.returnData[1].returnData;
      const marketSummary = PerpsMarketProxyInterface.decodeFunctionResult('getMarketSummary', getMarketSummaryTxnData);
      return marketSummary[0];
    }

    throw new Error('Unexpected multicall response');
  }
  throw new Error('Empty multicall response');
}
