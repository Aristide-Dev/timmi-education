@extends('emails.layout')

@php
    $headerTitle = 'Bienvenue sur ' . config('app.name') . ' !';
@endphp

@section('content')
    <h1>Bonjour {{ $firstName ?? \Illuminate\Support\Str::before($user->name ?? '', ' ') ?: $user->name ?? '' }} !</h1>

    <p>Nous sommes ravis de vous accueillir sur <strong>{{ config('app.name') }}</strong>, la plateforme dédiée à l'éducation et à la mise en relation entre professeurs et élèves.</p>

    <p>Avec {{ config('app.name') }}, vous pouvez :</p>
    <ul style="color: #6b7280; line-height: 1.8;">
        <li>Accéder à votre tableau de bord et gérer votre profil</li>
        <li>Consulter vos cours, plannings et disponibilités (pour les professeurs)</li>
        <li>Suivre vos demandes de cours et vos échanges avec les enseignants (pour les élèves)</li>
        <li>Gérer les demandes et les professeurs depuis l’administration (pour les admins)</li>
    </ul>

    @if(!empty($passwordResetUrl))
    <p>Pour accéder à votre espace, vous devez d'abord <strong>définir votre mot de passe</strong> en cliquant sur le bouton ci-dessous.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ $passwordResetUrl }}" class="email-button">Définir mon mot de passe</a>
    </div>
    <p style="margin-top: 0;">Ce lien expire dans <strong>60 minutes</strong>. Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #0046B5; background-color: #f8f9fa; padding: 10px; border-radius: 10px; font-size: 14px;">{{ $passwordResetUrl }}</p>
    <hr class="email-divider" />
    @else
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ config('app.url') }}/dashboard" class="email-button">Accéder à mon tableau de bord</a>
    </div>
    @endif

    <div class="email-alert email-alert-info">
        <p style="margin: 0;"><strong>Astuce :</strong> Complétez votre profil et, si vous êtes professeur, renseignez vos disponibilités pour être visible par les élèves.</p>
    </div>

    <hr class="email-divider" />

    <p>Si vous avez des questions, n'hésitez pas à nous contacter. Notre équipe est là pour vous aider.</p>
@endsection

