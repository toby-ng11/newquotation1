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

    public static function isValidData(array|null $data): bool
    {
        return (new NotEmpty())->isValid($data);
    }

    public static function isValidPattern(string|null $pattern): bool
    {
        return (new NotEmpty())->isValid($pattern);
    }
}
