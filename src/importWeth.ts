const abi = [
  'function name() view returns (string)',
  'function approve(address guy, uint256 wad) returns (bool)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address src, address dst, uint256 wad) returns (bool)',
  'function withdraw(uint256 wad)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
  'function transfer(address dst, uint256 wad) returns (bool)',
  'function deposit() payable',
  'function allowance(address, address) view returns (uint256)',
  'event Approval(address indexed src, address indexed guy, uint256 wad)',
  'event Transfer(address indexed src, address indexed dst, uint256 wad)',
  'event Deposit(address indexed dst, uint256 wad)',
  'event Withdrawal(address indexed src, uint256 wad)',
];

export async function importWeth(chainId: number, preset: string): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;
  switch (deployment) {
    case '1-main': {
      return { address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', abi: abi };
    }
    // TODO: define correct WETH contract addresses for this chains
    // case '11155111-main': {
    //   const { sepolia } = await import('viem/chains');
    //   return { address: sepolia.contracts.multicall3.address, abi: abi };
    // }
    // case '10-main': {
    //   const { optimism } = await import('viem/chains');
    //   return { address: optimism.contracts.multicall3.address, abi: abi };
    // }
    // case '8453-andromeda': {
    //   const [{ default: meta }, { default: abi }] = await Promise.all([
    //     import('@synthetixio/v3-contracts/8453-andromeda/meta.json'),
    //     import('@synthetixio/v3-contracts/8453-andromeda/TrustedMulticallForwarder.readable.json'),
    //   ]);
    //   return { address: meta.contracts.TrustedMulticallForwarder, abi };
    // }
    // case '84532-andromeda': {
    //   const [{ default: meta }, { default: abi }] = await Promise.all([
    //     import('@synthetixio/v3-contracts/84532-andromeda/meta.json'),
    //     import('@synthetixio/v3-contracts/84532-andromeda/TrustedMulticallForwarder.readable.json'),
    //   ]);
    //   return { address: meta.contracts.TrustedMulticallForwarder, abi };
    // }
    // case '42161-main': {
    //   const [{ default: meta }, { default: abi }] = await Promise.all([
    //     import('@synthetixio/v3-contracts/42161-main/meta.json'),
    //     import('@synthetixio/v3-contracts/42161-main/TrustedMulticallForwarder.readable.json'),
    //   ]);
    //   return { address: meta.contracts.TrustedMulticallForwarder, abi };
    // }
    // case '42161-arbthetix': {
    //   const [{ default: meta }, { default: abi }] = await Promise.all([
    //     import('@synthetixio/v3-contracts/42161-arbthetix/meta.json'),
    //     import('@synthetixio/v3-contracts/42161-arbthetix/TrustedMulticallForwarder.readable.json'),
    //   ]);
    //   return { address: meta.contracts.TrustedMulticallForwarder, abi };
    // }
    case '421614-main': {
      return { address: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73', abi: abi };
    }
    default: {
      throw new Error(`Unsupported deployment ${deployment} for WETH`);
    }
  }
}
