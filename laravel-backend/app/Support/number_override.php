<?php

if (!function_exists('app') || !function_exists('class_alias')) {
    return;
}

// Create a proxy class for Number that doesn't require intl
if (!class_exists('App\Support\NumberWithoutIntl')) {
    class NumberProxy
    {
        public static function format($number, $precision = 0, $maxPrecision = null, $locale = null)
        {
            if (is_null($number)) {
                return '';
            }
            
            $number = (float) $number;
            
            if ($maxPrecision !== null && $precision !== $maxPrecision) {
                // Format with max precision then trim zeros
                $formatted = number_format($number, $maxPrecision, '.', ',');
                $formatted = rtrim($formatted, '0');
                $formatted = rtrim($formatted, '.');
                return $formatted;
            }
            
            return number_format($number, $precision, '.', ',');
        }
        
        public static function __callStatic($method, $args)
        {
            // For other methods, try to call the original if available
            if (method_exists(\Illuminate\Support\Number::class, $method)) {
                try {
                    return forward_static_call_array([\Illuminate\Support\Number::class, $method], $args);
                } catch (\Exception $e) {
                    // If it fails (likely due to intl), return a safe default
                    return '';
                }
            }
            return '';
        }
    }
    
    // Override the Number facade
    if (class_exists(\Illuminate\Support\Facades\Facade::class)) {
        class_alias(NumberProxy::class, 'Illuminate\Support\Number');
    }
}
