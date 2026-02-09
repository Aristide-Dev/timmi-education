@extends('emails.layout')

@php
    $headerTitle = 'Vérification de votre email';
@endphp

@section('content')
    <h1>Bonjour {{ $firstName ?? \Illuminate\Support\Str::before($user->name ?? '', ' ') ?: $user->name ?? '' }} !</h1>

    <p>Merci de vous être inscrit sur <strong>{{ config('app.name') }}</strong>. Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.</p>

    <div style="text-align: center;">
        <a href="{{ $verificationUrl }}" class="email-button">Vérifier mon email</a>
    </div>

    <p style="margin-top: 25px;">Ce lien de vérification expire dans <strong>60 minutes</strong>.</p>

    <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
    <p style="word-break: break-all; color: #0046B5; background-color: #f8f9fa; padding: 10px; border-radius: 10px; font-size: 14px;">
        {{ $verificationUrl }}
    </p>

    <hr class="email-divider" />

    <div class="email-alert email-alert-info">
        <p style="margin: 0;"><strong>Important :</strong> Si vous n'avez pas créé de compte sur {{ config('app.name') }}, vous pouvez ignorer cet email. Aucune action n'est requise de votre part.</p>
    </div>
@endsection

