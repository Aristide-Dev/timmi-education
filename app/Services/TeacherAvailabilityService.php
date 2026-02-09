<?php

namespace App\Services;

use App\Models\User;
use Zap\Facades\Zap;
use Zap\Models\Schedule;

class TeacherAvailabilityService
{
    private const DAYS_EN = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    /**
     * Get availability for a teacher as array keyed by day (en), each value is list of { start, end }.
     *
     * @return array<string, list<array{start: string, end: string}>>
     */
    public function getAvailability(User $teacher): array
    {
        $result = array_fill_keys(self::DAYS_EN, []);

        $schedules = $teacher->availabilitySchedules()
            ->with('periods')
            ->get();

        foreach ($schedules as $schedule) {
            if (! $schedule->is_recurring || ! $schedule->frequency_config) {
                continue;
            }

            $config = $schedule->frequency_config;
            $days = is_array($config) ? ($config['days'] ?? []) : ($config->days ?? []);
            if (empty($days)) {
                continue;
            }

            $periods = $schedule->periods->map(fn ($p) => [
                'start' => substr($p->start_time, 0, 5),
                'end' => substr($p->end_time, 0, 5),
            ])->toArray();

            foreach ($days as $day) {
                $day = strtolower($day);
                if (! isset($result[$day])) {
                    continue;
                }
                foreach ($periods as $period) {
                    $result[$day][] = $period;
                }
            }
        }

        foreach ($result as $day => $periods) {
            $result[$day] = $this->mergeAndSortPeriods($periods);
        }

        return $result;
    }

    /**
     * Save availability for a teacher. Replaces all existing availability schedules.
     *
     * @param  array<string, list<array{start: string, end: string}>>  $availability
     */
    public function saveAvailability(User $teacher, array $availability): void
    {
        $teacher->availabilitySchedules()->each(function (Schedule $schedule) {
            $schedule->delete();
        });

        $year = (int) now()->format('Y');
        $dayNamesFr = [
            'monday' => 'Lundi',
            'tuesday' => 'Mardi',
            'wednesday' => 'Mercredi',
            'thursday' => 'Jeudi',
            'friday' => 'Vendredi',
            'saturday' => 'Samedi',
            'sunday' => 'Dimanche',
        ];

        foreach (self::DAYS_EN as $day) {
            $periods = $availability[$day] ?? [];
            if (empty($periods)) {
                continue;
            }

            $builder = Zap::for($teacher)
                ->named('Disponibilité - '.($dayNamesFr[$day] ?? $day))
                ->availability()
                ->forYear($year)
                ->weekly([$day]);

            foreach ($periods as $slot) {
                $start = $this->normalizeTime($slot['start'] ?? null);
                $end = $this->normalizeTime($slot['end'] ?? null);
                if ($start && $end) {
                    $builder->addPeriod($start, $end);
                }
            }

            $builder->save();
        }
    }

    /**
     * @param  list<array{start: string, end: string}>  $periods
     * @return list<array{start: string, end: string}>
     */
    private function mergeAndSortPeriods(array $periods): array
    {
        if (empty($periods)) {
            return [];
        }

        usort($periods, fn ($a, $b) => strcmp($a['start'], $b['start']));

        return array_values($periods);
    }

    private function normalizeTime(?string $time): ?string
    {
        if (! $time) {
            return null;
        }
        $parts = explode(':', $time);
        if (count($parts) !== 2) {
            return null;
        }
        $h = (int) $parts[0];
        $m = (int) $parts[1];

        return sprintf('%02d:%02d', $h, $m);
    }
}
