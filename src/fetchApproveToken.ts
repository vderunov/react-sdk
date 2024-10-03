import { type BigNumberish, ethers } from 'ethers';

export async function fetchApproveToken({
  provider,
  walletAddress,
  tokenAddress,
  spenderAddress,
  allowance,
}: {
  provider: ethers.providers.Web3Provider;
  walletAddress: BigNumberish;
  tokenAddress: BigNumberish;
  spenderAddress: BigNumberish;
  allowance: BigNumberish;
}) {
  const signer = provider.getSigner(walletAddress.toString());
  const Token = new ethers.Contract(tokenAddress.toString(), ['function approve(address spender, uint256 amount) returns (bool)'], signer);
  const tx: ethers.ContractTransaction = await Token.approve(spenderAddress, allowance);
  console.log({ tx });
  const txResult = await tx.wait();
  console.log({ txResult });
  return txResult;
}
