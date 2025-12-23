<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reset Your Password - AXG Photo</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            margin: 0;
            letter-spacing: 2px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #333333;
            margin: 0 0 20px 0;
        }
        .message {
            font-size: 16px;
            color: #555555;
            margin: 0 0 30px 0;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 18px 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
            min-width: 200px;
            min-height: 44px;
            line-height: 44px;
            padding: 0 50px;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        .expiration-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 30px 0;
            border-radius: 6px;
        }
        .expiration-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .timer-icon {
            font-size: 32px;
            flex-shrink: 0;
        }
        .expiration-text {
            font-size: 15px;
            color: #856404;
            margin: 0;
            font-weight: 500;
        }
        .security-box {
            background-color: #d1ecf1;
            border-left: 4px solid #17a2b8;
            padding: 20px;
            margin: 30px 0;
            border-radius: 6px;
        }
        .security-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .shield-icon {
            font-size: 32px;
            flex-shrink: 0;
        }
        .security-text {
            font-size: 15px;
            color: #0c5460;
            margin: 0;
            line-height: 1.5;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #dddddd, transparent);
            margin: 40px 0;
        }
        .fallback-section {
            margin: 30px 0;
        }
        .fallback-label {
            font-size: 14px;
            color: #666666;
            margin: 0 0 10px 0;
            font-weight: 500;
        }
        .link-box {
            background-color: #f8f9fa;
            border: 2px dashed #cccccc;
            padding: 15px;
            border-radius: 6px;
            word-break: break-all;
            font-size: 13px;
            color: #495057;
            font-family: 'Courier New', monospace;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer-text {
            font-size: 14px;
            color: #6c757d;
            margin: 5px 0;
        }
        .brand-name {
            color: #667eea;
            font-weight: 600;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 30px 20px;
            }
            .reset-button {
                width: 100%;
                box-sizing: border-box;
            }
            .expiration-content,
            .security-content {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
            <h1 class="logo">AXG PHOTO</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <!-- Personalized Greeting -->
            <h2 class="greeting">Hello {{ $userName }}! 👋</h2>

            <!-- Main Message -->
            <p class="message">
                We received a request to reset the password for your AXG Photo account. Click the button below to create a new password.
            </p>

            <!-- Reset Password Button -->
            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">Reset My Password</a>
            </div>

            <!-- Expiration Notice -->
            <div class="expiration-box">
                <div class="expiration-content">
                    <div class="timer-icon">⏰</div>
                    <p class="expiration-text">
                        <strong>Important:</strong> This password reset link will expire in <strong>60 minutes</strong> for your security. Please complete the reset process soon.
                    </p>
                </div>
            </div>

            <!-- Security Message -->
            <div class="security-box">
                <div class="security-content">
                    <div class="shield-icon">🛡️</div>
                    <p class="security-text">
                        <strong>Didn't request this?</strong> Your account is safe. If you didn't ask to reset your password, you can safely ignore this email. No changes will be made to your account.
                    </p>
                </div>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Fallback Link Section -->
            <div class="fallback-section">
                <p class="fallback-label">Button not working? Copy this link:</p>
                <div class="link-box">{{ $resetUrl }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                <strong class="brand-name">AXG Photo</strong>
            </p>
            <p class="footer-text">
                Your trusted partner for premium photography equipment
            </p>
            <p class="footer-text" style="margin-top: 20px; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>
