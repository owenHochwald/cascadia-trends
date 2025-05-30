// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable no-restricted-imports */
import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { AppDispatch, RootState } from "./store"
import { useCallback } from "react"
import {
  clearFilters,
  updateFilters,
  type DateRange,
  type FilterRange,
} from "../features/filters/filterSlice"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export interface FilterOptions {
  priceRange?: FilterRange
  sqftRange?: FilterRange
  bedroomCategory?: string
  dateRange?: DateRange
  selectedPoints?: string[]
}

export const useCrossFiltering = (chartId: string) => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)
  const isSourceChart = filters.sourceChart === chartId

  const updateChartFilters = useCallback(
    (options: FilterOptions) => {
      dispatch(
        updateFilters({
          ...options,
          sourceChart: chartId,
        })
      )
    },
    [dispatch, chartId]
  )

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  return {
    filters,
    isSourceChart,
    updateChartFilters,
    clearAllFilters,
    isFiltering: filters.isFiltering,
  }
}

// Hook for charts to determine if they should apply filters
export const useFilteredData = <T>(
  chartId: string,
  data: T[] | null,
  filterFn: (item: T, filters: RootState["filters"]) => boolean
) => {
  const { filters, isSourceChart } = useCrossFiltering(chartId)

  if (!data || !filters.isFiltering || isSourceChart) {
    return data
  }

  return data.filter((item) => filterFn(item, filters))
}
