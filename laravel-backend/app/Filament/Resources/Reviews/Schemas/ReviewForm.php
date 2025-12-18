<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('rating')
                    ->required()
                    ->numeric(),
                TextInput::make('title')
                    ->required(),
                Textarea::make('comment')
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('is_approved')
                    ->required(),
                TextInput::make('is_helpful')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_reported')
                    ->required(),
                Textarea::make('report_reason')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('admin_response')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('tags')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('images')
                    ->default(null)
                    ->columnSpanFull(),
                Toggle::make('verified_purchase')
                    ->required(),
            ]);
    }
}
