<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;
use RuntimeException;

class MakeDddCommand extends Command
{
    protected $signature = 'make:ddd
        {name : Entity name, for example Product}
        {--module= : Bounded context name; defaults to <Entity>Management}
        {--force : Overwrite existing generated files}';

    protected $description = 'Generate a DDD-oriented CRUD skeleton';

    public function handle(Filesystem $files): int
    {
        $entity = Str::studly((string) $this->argument('name'));

        if (! preg_match('/^[A-Z][A-Za-z0-9]*$/', $entity)) {
            $this->components->error('The entity name must contain only letters and numbers.');

            return self::FAILURE;
        }

        $moduleOption = $this->option('module');
        $module = Str::studly(is_string($moduleOption) && $moduleOption !== ''
            ? $moduleOption
            : $entity.'Management');

        $plural = Str::plural($entity);
        $page = Str::plural(Str::kebab($entity));
        $variable = Str::camel($entity);
        $variables = Str::plural($variable);

        $replacements = [
            '{{ entity }}' => $entity,
            '{{ module }}' => $module,
            '{{ plural }}' => $plural,
            '{{ page }}' => $page,
            '{{ variable }}' => $variable,
            '{{ variables }}' => $variables,
        ];

        $targets = [
            'model.stub' => app_path("Domain/{$module}/Models/{$entity}.php"),
            'repository.stub' => app_path("Domain/{$module}/Contracts/{$entity}Repository.php"),
            'service.stub' => app_path("Application/{$module}/{$entity}Service.php"),
            'eloquent-repository.stub' => app_path("Infrastructure/Persistence/{$module}/Eloquent{$entity}Repository.php"),
            'controller.stub' => app_path("Presentation/Http/Controllers/{$entity}Controller.php"),
            'store-request.stub' => app_path("Presentation/Http/Requests/{$plural}/Store{$entity}Request.php"),
            'update-request.stub' => app_path("Presentation/Http/Requests/{$plural}/Update{$entity}Request.php"),
            'resource.stub' => app_path("Presentation/Http/Resources/{$plural}/{$entity}Resource.php"),
            'collection.stub' => app_path("Presentation/Http/Resources/{$plural}/{$entity}Collection.php"),
            'provider.stub' => app_path("Providers/{$entity}ServiceProvider.php"),
        ];

        $existing = collect($targets)->filter(fn (string $path) => $files->exists($path));

        if ($existing->isNotEmpty() && ! $this->option('force')) {
            $this->components->error('Some target files already exist:');
            $existing->each(fn (string $path) => $this->line('  '.$this->relativePath($path)));
            $this->components->info('Use --force if you intentionally want to overwrite them.');

            return self::FAILURE;
        }

        foreach ($targets as $stub => $target) {
            $stubPath = base_path('stubs/ddd/'.$stub);

            if (! $files->exists($stubPath)) {
                throw new RuntimeException("DDD stub not found: {$stubPath}");
            }

            $files->ensureDirectoryExists(dirname($target));
            $files->put($target, str_replace(
                array_keys($replacements),
                array_values($replacements),
                $files->get($stubPath)
            ));

            $this->components->task('Created '.$this->relativePath($target));
        }

        $this->registerProvider($files, "App\\Providers\\{$entity}ServiceProvider::class");

        $this->newLine();
        $this->components->info('DDD skeleton generated successfully.');
        $this->line("Next: add routes and Inertia pages for /{$page}.");

        return self::SUCCESS;
    }

    private function registerProvider(Filesystem $files, string $provider): void
    {
        $providersPath = base_path('bootstrap/providers.php');
        $contents = $files->get($providersPath);

        if (str_contains($contents, $provider)) {
            return;
        }

        $updated = preg_replace('/\n\];\s*$/', "\n    {$provider},\n];\n", $contents, 1, $count);

        if ($updated === null || $count !== 1) {
            throw new RuntimeException('Unable to register the generated service provider.');
        }

        $files->put($providersPath, $updated);
        $this->components->task('Registered '.$provider);
    }

    private function relativePath(string $path): string
    {
        return Str::after($path, base_path().DIRECTORY_SEPARATOR);
    }
}
