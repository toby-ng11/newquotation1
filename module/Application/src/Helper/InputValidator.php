<?php

namespace Application\Helper;

use Laminas\Validator\NotEmpty;
use Laminas\Validator\Digits;
use Laminas\Validator\NumberComparison;

class InputValidator
{
    public static function isValidId(int|null $id): bool
    {
        $digitsValidator = new Digits();
        $minValidator    = new NumberComparison([
            'min' => 0,
            'inclusiveMin' => false,
        ]);

        return $digitsValidator->isValid($id) && $minValidator->isValid($id);
    }

    public static function isValidData(mixed $data): bool
    {
        return (new NotEmpty())->isValid($data);
    }

    public static function isValidPattern(mixed $pattern): bool
    {
        return (new NotEmpty())->isValid($pattern);
    }
}
