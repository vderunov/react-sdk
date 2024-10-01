import { ethers } from 'ethers';
import React from 'react';

const pools = [ethers.BigNumber.from('1')];

export function useSelectedPoolId({ poolId }: { poolId?: string }) {
  return React.useMemo(() => {
    if (!poolId) {
      return ethers.BigNumber.from('1');
    }
    const bigNumberPoolId = ethers.BigNumber.from(poolId);
    return pools.find((id) => bigNumberPoolId.eq(id));
  }, [poolId]);
}
