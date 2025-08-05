<?php

namespace Application\Config;

class Defaults
{
    private static ?string $company = null;
    private static ?string $locationId = null;

    public static function set(?string $company, ?string $locationId): void
    {
        self::$company = $company;
        self::$locationId = $locationId;
    }

    public static function company(): ?string
    {
        return self::$company;
    }

    public static function locationId(): ?string
    {
        return self::$locationId;
    }
}
