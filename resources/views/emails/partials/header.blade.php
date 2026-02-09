<tr>
    <td class="email-header">
        <!-- Logo avec URL absolue pour compatibilité email -->
        <img
            src="{{ config('app.url') }}/web-app-manifest-192x192.png"
            alt="{{ config('app.name') }}"
            class="email-logo"
            style="display: block; margin: 0 auto; max-width: 150px; height: auto;"
        />
        @if(isset($headerTitle))
            <h1 class="email-title">{{ $headerTitle }}</h1>
        @else
            <h1 class="email-title" style="margin-top: 15px;">{{ config('app.name') }}</h1>
        @endif
    </td>
</tr>

