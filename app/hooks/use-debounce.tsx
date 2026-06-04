import React from 'react';

export function useDebounce<T>(callback: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState(callback);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(callback)
        }, delay);

        return () => {
            clearTimeout(handler)
        }
    }, [callback, delay]);

    return debouncedValue;
}
