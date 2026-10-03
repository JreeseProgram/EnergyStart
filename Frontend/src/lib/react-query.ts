/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  UseMutationOptions,
  DefaultOptions,
  UseQueryResult,
} from "@tanstack/react-query"
import type { ReactNode } from "react"

export const queryConfig = {
  queries: {
    // throwOnError: true,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>

type BaseCellOptions<TData, TError> = {
  Loading: (props: { ctx: UseQueryResult<TData, TError> }) => ReactNode

  Failure: (props: {
    error: TError
    ctx: UseQueryResult<TData, TError>
  }) => ReactNode

  Success: (props: {
    data: TData
    ctx: UseQueryResult<TData, TError>
  }) => ReactNode
}

type CellWithEmpty<TData, TError> = {
  Empty: (props: { ctx: UseQueryResult<TData, TError> }) => ReactNode

  isEmpty: (props: { data: TData }) => boolean
}

type CellWithoutEmpty = {
  Empty?: never
  isEmpty?: never
}

export type CellOptions<TData, TError> = BaseCellOptions<TData, TError> &
  (CellWithEmpty<TData, TError> | CellWithoutEmpty)

export function createCell<TData, TError>(
  query: UseQueryResult<TData, TError>,
  options: CellOptions<TData, TError>
) {
  if (query.isPending) {
    return options.Loading({ ctx: query })
  }

  if (query.isError) {
    return options.Failure({
      error: query.error,
      ctx: query,
    })
  }

  if (options.isEmpty?.({ data: query.data })) {
    return options.Empty?.({ ctx: query })
  }

  return options.Success({
    data: query.data,
    ctx: query,
  })
}
