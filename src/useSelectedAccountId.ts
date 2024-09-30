import { ethers } from 'ethers';
import React from 'react';
import { useAccounts } from './useAccounts';

export function useSelectedAccountId({
  accountId,
  provider,
  walletAddress,
}: { accountId?: string; provider?: ethers.providers.BaseProvider; walletAddress?: string }) {
  const { data: accounts } = useAccounts({ provider, walletAddress });

  return React.useMemo(() => {
    if (!accountId) {
      return;
    }
    if (!accounts) {
      return;
    }
    const accountIdBigNumber = ethers.BigNumber.from(accountId);
    return accounts.find((id) => accountIdBigNumber.eq(id));
  }, [accounts, accountId]);
}
