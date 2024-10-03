import { type BigNumberish, ethers } from 'ethers';

export async function fetchTokenBalance({
  provider,
  tokenAddress,
  ownerAddress,
}: {
  provider: ethers.providers.BaseProvider;
  tokenAddress: BigNumberish;
  ownerAddress: BigNumberish;
}) {
  const Token = new ethers.Contract(tokenAddress.toString(), ['function balanceOf(address account) view returns (uint256)'], provider);
  return Token.balanceOf(ownerAddress);
}
