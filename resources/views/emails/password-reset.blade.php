@extends('emails.layout')

@php
    $headerTitle = 'Réinitialisation de mot de passe';
@endphp

@section('content')
    <h1>Bonjour !</h1>

    <p>Vous avez demandé à réinitialiser votre mot de passe sur <strong>{{ config('app.name') }}</strong>. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.</p>

    <div style="text-align: center;">
        <a href="{{ $url }}" class="email-button">Réinitialiser mon mot de passe</a>
    </div>

    <p style="margin-top: 25px;">Ce lien expire dans <strong>60 minutes</strong>.</p>

    <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
    <p style="word-break: break-all; color: #0046B5; background-color: #f8f9fa; padding: 10px; border-radius: 10px; font-size: 14px;">
        {{ $url }}
    </p>

    <hr class="email-divider" />

    <div class="email-alert email-alert-warning">
        <p style="margin: 0;"><strong>Important :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.</p>
    </div>
@endsection

