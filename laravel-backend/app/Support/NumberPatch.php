<?php

namespace Illuminate\Support;

use Closure;
use NumberFormatter;
use RuntimeException;

// This patches the Number class to work without intl extension
if (!class_exists('Illuminate\Support\Number', false)) {
    class Number
    {
        public static function format(float|int|null $number, ?int $precision = 0, ?int $maxPrecision = null, ?string $locale = null): string|false
        {
            if (is_null($number)) {
                return '';
            }

            $precision = $precision ?? 0;
            $number = (float) $number;

            if ($maxPrecision !== null && $precision !== $maxPrecision) {
                $formatted = number_format($number, $maxPrecision, '.', ',');
                $formatted = rtrim($formatted, '0');
                $formatted = rtrim($formatted, '.');
                return $formatted;
            }

            return number_format($number, $precision, '.', ',');
        }

        public static function __callStatic($method, $args)
        {
            throw new RuntimeException("Method [{$method}] not implemented in Number patch.");
        }
    }
}
