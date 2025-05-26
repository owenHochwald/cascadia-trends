// matches backend filters
export type FilterState = {
    priceRange: [number, number];
    sqftRange: [number, number];
    bedrooms: number[];
    dateRange: [string, string];
}

export type FilterKeys = keyof FilterState;


// ===== COMPONENT PROP TYPES =====

// Chart component props
export type BaseChartProps = {
    title: string;
    height?: number;
    className?: string;
    showLegend?: boolean;
    showTooltip?: boolean;
}

// Filter component props
export interface RangeSliderProps {
    value: [number, number];
    onChange: (value: [number, number]) => void;
    min: number;
    max: number;
    step: number;
    formatLabel?: (value: number) => string;
    disabled?: boolean;
}

export interface BedroomSelectorProps {
    selected: number[];
    onChange: (selected: number[]) => void;
    options?: number[];
    disabled?: boolean;
}

export interface DateRangePickerProps {
    value: [string, string];
    onChange: (value: [string, string]) => void;
    minDate?: string;
    maxDate?: string;
    disabled?: boolean;
}

// Loading and error component props
export interface LoadingIndicatorProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    className?: string;
}

export interface ErrorDisplayProps {
    message: string;
    onRetry?: () => void;
    className?: string;
    showDetails?: boolean;
}

// ===== UTILITY TYPES =====

// For creating partial updates to state
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// For ensuring required fields in forms
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// For creating action payload types
export type FilterActionPayload<K extends FilterKeys> = {
    key: K;
    value: FilterState[K];
};

// For chart data transformation
export type ChartDataTransformer<TInput, TOutput> = (data: TInput) => TOutput;

// ===== CONSTANTS TYPES =====

// Theme and styling constants
export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
    };
    breakpoints: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
}

// Configuration constants
export interface AppConfig {
    apiBaseUrl: string;
    defaultFilters: FilterState;
    chartDefaults: {
        height: number;
        animationDuration: number;
        colors: string[];
    };
    dateFormat: string;
    numberFormat: Intl.NumberFormatOptions;
}

// ===== VALIDATION TYPES =====

// Form validation
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
}

export type Validator<T> = (value: T) => ValidationResult;

// Filter validation specific types
export interface FilterValidationRules {
    priceRange: {
        min: number;
        max: number;
    };
    sqftRange: {
        min: number;
        max: number;
    };
    bedrooms: {
        options: number[];
        minSelection: number;
    };
    dateRange: {
        minDate: string;
        maxDate: string;
    };
}

// ===== PERFORMANCE TYPES =====

// For memoization and optimization
export interface MemoizedSelector<TState, TResult> {
    (state: TState): TResult;
    recomputations: () => number;
    resetRecomputations: () => number;
}

// For debounced actions
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
}

// ===== TEST TYPES =====

// For testing utilities
export interface MockApiResponse<T> {
    data: T;
    status: number;
    delay?: number;
    shouldFail?: boolean;
}

export interface TestRenderOptions {
    initialState?: Partial<RootState>;
    preloadedState?: RootState;
    route?: string;
}
