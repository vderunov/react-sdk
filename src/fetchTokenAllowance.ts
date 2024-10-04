import { ethers } from 'ethers';

export async function fetchTokenAllowance({
  provider,
  tokenAddress,
  ownerAddress,
  spenderAddress,
}: {
  provider: ethers.providers.BaseProvider;
  tokenAddress: ethers.BigNumberish;
  ownerAddress: ethers.BigNumberish;
  spenderAddress: ethers.BigNumberish;
}) {
  const Token = new ethers.Contract(
    tokenAddress.toString(),
    ['function allowance(address owner, address spender) view returns (uint256)'],
    provider
  );
  return Token.allowance(ownerAddress, spenderAddress);
}
