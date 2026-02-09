<?php

use Carbon\CarbonInterface;

return [
    'calendar' => [
        'week_start' => CarbonInterface::MONDAY,
    ],

    'default_rules' => [
        'no_overlap' => [
            'enabled' => true,
            'applies_to' => [
                \Zap\Enums\ScheduleTypes::APPOINTMENT,
                \Zap\Enums\ScheduleTypes::BLOCKED,
            ],
        ],
        'working_hours' => [
            'enabled' => false,
            'start' => '09:00',
            'end' => '17:00',
        ],
        'max_duration' => [
            'enabled' => false,
            'minutes' => 480,
        ],
        'no_weekends' => [
            'enabled' => false,
            'saturday' => true,
            'sunday' => true,
        ],
    ],

    'conflict_detection' => [
        'enabled' => true,
        'buffer_minutes' => 0,
    ],

    'time_slots' => [
        'buffer_minutes' => 0,
    ],

    'validation' => [
        'require_future_dates' => false,
        'max_date_range' => 365,
        'min_period_duration' => 15,
        'max_periods_per_schedule' => 50,
        'allow_overlapping_periods' => false,
    ],

    'models' => [
        'schedule' => \Zap\Models\Schedule::class,
        'schedule_period' => \Zap\Models\SchedulePeriod::class,
    ],
];
