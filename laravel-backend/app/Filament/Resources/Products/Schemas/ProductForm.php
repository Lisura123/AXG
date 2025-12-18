<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('features')
                    ->default(null)
                    ->columnSpanFull(),
                FileUpload::make('image_url')
                    ->image(),
                TextInput::make('category')
                    ->required(),
                TextInput::make('subcategory')
                    ->default(null),
                TextInput::make('slug')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                Toggle::make('is_featured')
                    ->required(),
                TextInput::make('rating_average')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('rating_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('view_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                Textarea::make('specifications')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('related_products')
                    ->default(null)
                    ->columnSpanFull(),
                TextInput::make('meta_title')
                    ->default(null),
                Textarea::make('meta_description')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('meta_keywords')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
