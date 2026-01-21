import { useState, useCallback } from 'react';

type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

interface TransactionState {
  status: TransactionStatus;
  txId: string | null;
  error: string | null;
}

interface UseTransactionStatusOptions {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export function useTransactionStatus(options?: UseTransactionStatusOptions) {
  const [state, setState] = useState<TransactionState>({
    status: 'idle',
    txId: null,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      txId: null,
      error: null,
    });
  }, []);

  const setPending = useCallback(() => {
    setState({
      status: 'pending',
      txId: null,
      error: null,
    });
  }, []);

  const setSuccess = useCallback(
    (txId: string) => {
      setState({
        status: 'success',
        txId,
        error: null,
      });
      options?.onSuccess?.(txId);
    },
    [options]
  );

  const setError = useCallback(
    (error: string) => {
      setState({
        status: 'error',
        txId: null,
        error,
      });
      options?.onError?.(error);
    },
    [options]
  );

  const wrapTransaction = useCallback(
    async <T>(
      transactionFn: () => Promise<T>,
      txIdExtractor?: (result: T) => string
    ): Promise<T | null> => {
      setPending();
      try {
        const result = await transactionFn();
        if (txIdExtractor) {
          setSuccess(txIdExtractor(result));
        } else {
          setState((prev) => ({ ...prev, status: 'success' }));
        }
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Transaction failed';
        setError(errorMessage);
        return null;
      }
    },
    [setPending, setSuccess, setError]
  );

  return {
    ...state,
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    reset,
    setPending,
    setSuccess,
    setError,
    wrapTransaction,
  };
}
