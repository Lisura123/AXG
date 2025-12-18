<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('first_name')
                    ->required(),
                TextInput::make('last_name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->default(null),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('password')
                    ->password()
                    ->required(),
                Select::make('role')
                    ->options(['user' => 'User', 'admin' => 'Admin', 'moderator' => 'Moderator'])
                    ->default('user')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                Toggle::make('is_email_verified')
                    ->required(),
                DateTimePicker::make('last_login'),
                TextInput::make('login_attempts')
                    ->required()
                    ->numeric()
                    ->default(0),
                DateTimePicker::make('lock_until'),
                DateTimePicker::make('password_reset_expires'),
                DateTimePicker::make('email_verification_expires'),
            ]);
    }
}
