<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $title ?? config('app.name') }}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
    <style>
        /* Timmi Education – aligné sur resources/css/app.css (primary #0046B5, secondary #5DADE2) */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa; /* --muted */
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        .email-wrapper {
            width: 100%;
            background-color: #f8f9fa; /* --muted */
            padding: 20px 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff; /* --background */
            border-radius: 10px; /* --radius */
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 70, 181, 0.08), 0 1px 2px rgba(0, 70, 181, 0.04);
        }

        /* Header – primary Timmi (#0046B5) */
        .email-header {
            background: linear-gradient(135deg, #0046B5 0%, #1a5fc7 100%);
            padding: 30px 20px;
            text-align: center;
        }
        .email-logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
        .email-title {
            color: #ffffff; /* --primary-foreground */
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }

        .email-content {
            padding: 40px 30px;
            color: #1a1a1a; /* --foreground */
            line-height: 1.6;
            font-size: 16px;
        }
        .email-content h1 {
            color: #0046B5; /* --primary */
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 20px 0;
            line-height: 1.3;
        }
        .email-content h2 {
            color: #0046B5;
            font-size: 22px;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .email-content p {
            margin: 0 0 15px 0;
            color: #6b7280; /* --muted-foreground */
        }
        .email-content a {
            color: #0046B5;
            text-decoration: underline;
        }

        /* Bouton CTA – primary */
        .email-button {
            display: inline-block;
            padding: 14px 32px;
            margin: 25px 0;
            background: linear-gradient(135deg, #0046B5, #1a5fc7);
            color: #ffffff !important;
            text-decoration: none !important;
            font-weight: 600;
            font-size: 16px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 70, 181, 0.2), 0 1px 2px rgba(0, 70, 181, 0.1);
            transition: all 0.25s ease;
        }
        .email-button:hover {
            background: linear-gradient(135deg, #003894, #0046B5);
            box-shadow: 0 4px 6px -1px rgba(0, 70, 181, 0.2), 0 2px 4px -1px rgba(0, 70, 181, 0.1);
            transform: translateY(-2px);
        }
        .email-button-secondary {
            background: #5DADE2; /* --secondary */
            color: #ffffff !important;
            box-shadow: 0 1px 3px rgba(93, 173, 226, 0.2), 0 1px 2px rgba(93, 173, 226, 0.1);
        }
        .email-button-secondary:hover {
            background: #4a8bc4; /* --secondary-dark */
            box-shadow: 0 4px 6px -1px rgba(93, 173, 226, 0.2), 0 2px 4px -1px rgba(93, 173, 226, 0.1);
        }

        .email-divider {
            height: 1px;
            background-color: #e5e7eb; /* --border */
            margin: 30px 0;
            border: none;
        }

        .email-alert {
            padding: 15px 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid;
        }
        .email-alert-info {
            background-color: #eef4fc; /* primary tint */
            border-left-color: #0046B5;
            color: #003894;
        }
        .email-alert-warning {
            background-color: #fff8f0; /* destructive tint */
            border-left-color: #f59e0b; /* --warning */
            color: #b45309;
        }
        .email-alert-success {
            background-color: #ecfdf5; /* success tint */
            border-left-color: #10b981; /* --success */
            color: #047857;
        }

        .email-footer {
            background-color: #f8f9fa; /* --muted */
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb; /* --border */
        }
        .email-footer p {
            margin: 5px 0;
            color: #6b7280; /* --muted-foreground */
            font-size: 14px;
        }
        .email-footer a {
            color: #0046B5;
            text-decoration: none;
        }
        .email-footer-copyright {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                border-radius: 0 !important;
            }
            .email-content {
                padding: 30px 20px !important;
            }
            .email-header {
                padding: 25px 15px !important;
            }
            .email-content h1 {
                font-size: 24px !important;
            }
            .email-content h2 {
                font-size: 20px !important;
            }
            .email-button {
                width: 100% !important;
                padding: 12px 24px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600">
                        <!-- Header -->
                        @include('emails.partials.header')

                        <!-- Content -->
                        <tr>
                            <td class="email-content">
                                @yield('content')
                            </td>
                        </tr>

                        <!-- Footer -->
                        @include('emails.partials.footer')
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

