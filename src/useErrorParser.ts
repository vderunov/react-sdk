import React from 'react';
import { parseError } from './parseError';
import { useImportContract } from './useImports';

export function useErrorParser() {
  const { data: AllErrorsContract } = useImportContract('AllErrors');
  return React.useCallback(
    async (error: Error) => {
      if (AllErrorsContract) {
        return await parseError({ error, AllErrorsContract });
      }
      throw error;
    },
    [AllErrorsContract]
  );
}
