<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} – @yield('title')</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @vite(['resources/css/app.css'])
    <style>
        /* Page d'erreur – thème Timmi Education (primary #0046B5, secondary #5DADE2) */
        .error-page {
            background: linear-gradient(135deg, #000e31 0%, #003894 50%, #001c52 100%);
            min-height: 100vh;
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
        }
        .error-code {
            background: linear-gradient(135deg, #0046B5, #5DADE2);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 700;
        }
        .error-link {
            background: linear-gradient(135deg, #0046B5, #1a5fc7);
            color: #ffffff;
            padding: 0.75rem 1.5rem;
            border-radius: 0.625rem;
            font-weight: 600;
            text-decoration: none;
            box-shadow: 0 1px 3px rgba(0, 70, 181, 0.3);
            transition: background 0.2s, box-shadow 0.2s;
        }
        .error-link:hover {
            background: linear-gradient(135deg, #003894, #0046B5);
            box-shadow: 0 4px 6px -1px rgba(0, 70, 181, 0.25);
        }
    </style>
</head>
<body class="error-page">
    <div class="flex flex-col items-center justify-center min-h-screen px-4">
        <div class="text-center space-y-4">
            <div class="text-8xl font-bold error-code">
                @yield('code')
            </div>
            <h1 class="text-4xl font-bold text-white">@yield('title')</h1>
            <p class="text-lg text-slate-300 max-w-md">@yield('message')</p>
            <a href="{{ url('/') }}" class="inline-block mt-6 error-link">
                Retour à l'accueil
            </a>
        </div>
    </div>
</body>
</html>
