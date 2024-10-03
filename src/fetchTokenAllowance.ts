import { type BigNumberish, ethers } from 'ethers';

export async function fetchTokenAllowance({
  provider,
  tokenAddress,
  ownerAddress,
  spenderAddress,
}: {
  provider: ethers.providers.BaseProvider;
  tokenAddress: BigNumberish;
  ownerAddress: BigNumberish;
  spenderAddress: BigNumberish;
}) {
  const Token = new ethers.Contract(
    tokenAddress.toString(),
    ['function allowance(address owner, address spender) view returns (uint256)'],
    provider
  );
  return Token.allowance(ownerAddress, spenderAddress);
}
