<?php

namespace App\Infrastructure\AdministrativeDivision;

use App\Application\AdministrativeDivision\Contracts\AdministrativeDivisionSource;
use App\Domain\AdministrativeDivision\Data\AdministrativeDivisionSnapshot;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use UnexpectedValueException;

class ProvinceOpenApiClient implements AdministrativeDivisionSource
{
    public function fetch(): AdministrativeDivisionSnapshot
    {
        $provinces = $this->get('p/');

        if (! array_is_list($provinces)) {
            throw new UnexpectedValueException('Province Open API returned an invalid province list.');
        }

        $normalizedProvinces = [];
        $normalizedWards = [];

        foreach ($provinces as $province) {
            $normalizedProvince = $this->normalizeProvince($province);
            $normalizedProvinces[] = $normalizedProvince;

            $details = $this->get("p/{$normalizedProvince['code']}", ['depth' => 2]);

            foreach ($details['wards'] ?? [] as $ward) {
                $normalizedWards[] = $this->normalizeWard(
                    $ward,
                    $normalizedProvince['code'],
                );
            }
        }

        return new AdministrativeDivisionSnapshot(
            $normalizedProvinces,
            $normalizedWards,
        );
    }

    /** @return array<mixed> */
    private function get(string $path, array $query = []): array
    {
        $response = $this->request()->get($path, $query)->throw();
        $data = $response->json();

        if (! is_array($data)) {
            throw new UnexpectedValueException('Province Open API returned invalid JSON.');
        }

        return $data;
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl(config('services.province_open_api.base_url'))
            ->acceptJson()
            ->connectTimeout(config('services.province_open_api.connect_timeout'))
            ->timeout(config('services.province_open_api.timeout'))
            ->retry(2, 250);
    }

    /** @param array<mixed> $province
     * @return array{code: string, name: string, slug: string, type: string, meta: array<string, mixed>}
     */
    private function normalizeProvince(array $province): array
    {
        $name = $this->requiredString($province, 'name');
        $codename = $this->requiredString($province, 'codename');
        $divisionType = $this->requiredString($province, 'division_type');

        return [
            'code' => $this->requiredCode($province),
            'name' => $name,
            'slug' => str($codename)->replace('_', '-')->toString(),
            'type' => $divisionType === 'thành phố trung ương'
                ? 'municipality'
                : 'province',
            'meta' => [
                'codename' => $codename,
                'division_type' => $divisionType,
                'phone_code' => $province['phone_code'] ?? null,
            ],
        ];
    }

    /** @param array<mixed> $ward
     * @return array{province_code: string, code: string, name: string, slug: string, type: string, meta: array<string, mixed>}
     */
    private function normalizeWard(array $ward, string $provinceCode): array
    {
        $codename = $this->requiredString($ward, 'codename');
        $divisionType = $this->requiredString($ward, 'division_type');

        return [
            'province_code' => $provinceCode,
            'code' => $this->requiredCode($ward),
            'name' => $this->requiredString($ward, 'name'),
            'slug' => str($codename)->replace('_', '-')->toString(),
            'type' => match ($divisionType) {
                'phường' => 'ward',
                'xã' => 'commune',
                'đặc khu' => 'special_zone',
                default => throw new UnexpectedValueException(
                    "Unsupported ward division type: {$divisionType}",
                ),
            },
            'meta' => [
                'codename' => $codename,
                'division_type' => $divisionType,
            ],
        ];
    }

    /** @param array<mixed> $division */
    private function requiredCode(array $division): string
    {
        $code = $division['code'] ?? null;

        if (! is_int($code) && ! is_string($code)) {
            throw new UnexpectedValueException('Administrative division is missing its code.');
        }

        return (string) $code;
    }

    /** @param array<mixed> $division */
    private function requiredString(array $division, string $key): string
    {
        $value = $division[$key] ?? null;

        if (! is_string($value) || $value === '') {
            throw new UnexpectedValueException(
                "Administrative division is missing {$key}.",
            );
        }

        return $value;
    }
}
