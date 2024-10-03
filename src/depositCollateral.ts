import { type BigNumberish, ethers } from 'ethers';

export async function depositCollateral({
  provider,
  walletAddress,
  CoreProxyContract,
  accountId,
  tokenAddress,
  depositAmount,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: BigNumberish;
  CoreProxyContract: { address: string; abi: string[] };
  accountId: BigNumberish;
  tokenAddress: BigNumberish;
  depositAmount: BigNumberish;
}) {
  const signer = provider.getSigner(walletAddress.toString());

  const CoreProxy = new ethers.Contract(CoreProxyContract.address, CoreProxyContract.abi, signer);
  const tx: ethers.ContractTransaction = await CoreProxy.deposit(
    //
    accountId,
    tokenAddress,
    depositAmount
  );
  console.log({ tx });
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
