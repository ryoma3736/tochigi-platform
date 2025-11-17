/**
 * Email Templates
 */

interface InquiryData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  companies: Array<{
    name: string;
    email: string;
  }>;
  selectedItems: string[];
}

interface SubscriptionData {
  companyName: string;
  planName: string;
  price: string;
  startDate: string;
  endDate: string;
}

/**
 * Base email template wrapper
 */
function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #3b82f6;
      margin: 0;
      font-size: 24px;
    }
    .content {
      margin-bottom: 30px;
    }
    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background-color: #f9fafb;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>栃木プラットフォーム</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>このメールは自動送信されています。</p>
      <p>&copy; 2025 栃木プラットフォーム All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Inquiry notification email to business
 */
export function inquiryBusinessNotification(data: InquiryData, companyName: string): {
  subject: string;
  html: string;
} {
  const content = `
    <h2>新しいお問い合わせが届きました</h2>
    <p>${companyName} 様、お客様から新しいお問い合わせが届きました。</p>

    <div class="info-box">
      <h3>お客様情報</h3>
      <p><strong>お名前:</strong> ${data.customerName}</p>
      <p><strong>メールアドレス:</strong> ${data.customerEmail}</p>
      <p><strong>電話番号:</strong> ${data.customerPhone}</p>
    </div>

    <div class="info-box">
      <h3>お問い合わせ内容</h3>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    </div>

    <p>お客様への返信は、上記のメールアドレスまたは電話番号までお願いいたします。</p>
    <p>できるだけ早めにご返信いただけますようお願いいたします。</p>
  `;

  return {
    subject: `【栃木プラットフォーム】新しいお問い合わせ - ${data.customerName}様より`,
    html: baseTemplate(content, '新しいお問い合わせ'),
  };
}

/**
 * Inquiry confirmation email to customer
 */
export function inquiryCustomerConfirmation(data: InquiryData): {
  subject: string;
  html: string;
} {
  const companiesHtml = data.companies.map((company) => `<li>${company.name}</li>`).join('');

  const content = `
    <h2>お問い合わせありがとうございます</h2>
    <p>${data.customerName} 様</p>
    <p>この度は栃木プラットフォームをご利用いただき、誠にありがとうございます。</p>
    <p>以下の内容でお問い合わせを受け付けました。</p>

    <div class="info-box">
      <h3>お問い合わせ先</h3>
      <ul>
        ${companiesHtml}
      </ul>
    </div>

    <div class="info-box">
      <h3>お問い合わせ内容</h3>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    </div>

    <p>各事業者より、${data.customerEmail} または ${data.customerPhone} 宛にご連絡させていただきます。</p>
    <p>今しばらくお待ちくださいませ。</p>
  `;

  return {
    subject: '【栃木プラットフォーム】お問い合わせを受け付けました',
    html: baseTemplate(content, 'お問い合わせ受付完了'),
  };
}

/**
 * Subscription welcome email
 */
export function subscriptionWelcome(data: SubscriptionData): {
  subject: string;
  html: string;
} {
  const content = `
    <h2>ご契約ありがとうございます</h2>
    <p>${data.companyName} 様</p>
    <p>栃木プラットフォームへのご登録、誠にありがとうございます。</p>

    <div class="info-box">
      <h3>ご契約内容</h3>
      <p><strong>プラン:</strong> ${data.planName}</p>
      <p><strong>月額料金:</strong> ${data.price}</p>
      <p><strong>開始日:</strong> ${data.startDate}</p>
      <p><strong>次回更新日:</strong> ${data.endDate}</p>
    </div>

    <p>これから栃木プラットフォームをご活用いただき、ビジネスの成長をサポートさせていただきます。</p>

    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">ダッシュボードへ</a>
    </p>

    <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
  `;

  return {
    subject: '【栃木プラットフォーム】ご契約ありがとうございます',
    html: baseTemplate(content, 'ご契約完了'),
  };
}

/**
 * Subscription cancellation email
 */
export function subscriptionCancellation(data: SubscriptionData): {
  subject: string;
  html: string;
} {
  const content = `
    <h2>サブスクリプションの解約について</h2>
    <p>${data.companyName} 様</p>
    <p>サブスクリプションの解約手続きを承りました。</p>

    <div class="info-box">
      <h3>解約内容</h3>
      <p><strong>プラン:</strong> ${data.planName}</p>
      <p><strong>サービス終了日:</strong> ${data.endDate}</p>
    </div>

    <p>${data.endDate}まで、引き続きサービスをご利用いただけます。</p>
    <p>これまでのご利用、誠にありがとうございました。</p>

    <p>またのご利用を心よりお待ちしております。</p>
  `;

  return {
    subject: '【栃木プラットフォーム】サブスクリプション解約のお知らせ',
    html: baseTemplate(content, 'サブスクリプション解約'),
  };
}

/**
 * Subscription payment failed email
 */
export function subscriptionPaymentFailed(data: SubscriptionData): {
  subject: string;
  html: string;
} {
  const content = `
    <h2>お支払いの処理に失敗しました</h2>
    <p>${data.companyName} 様</p>
    <p>サブスクリプションの定期支払い処理に失敗しました。</p>

    <div class="info-box">
      <h3>ご契約内容</h3>
      <p><strong>プラン:</strong> ${data.planName}</p>
      <p><strong>月額料金:</strong> ${data.price}</p>
    </div>

    <p style="color: #dc2626;">
      <strong>至急、お支払い方法の更新をお願いいたします。</strong>
    </p>

    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription" class="button">お支払い方法を更新</a>
    </p>

    <p>お支払い方法の更新が確認できない場合、サービスが停止される可能性がございます。</p>
    <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
  `;

  return {
    subject: '【重要】栃木プラットフォーム - お支払いの処理に失敗しました',
    html: baseTemplate(content, 'お支払い失敗'),
  };
}

/**
 * Instagram sync success notification
 */
export function instagramSyncSuccess(companyName: string, postCount: number): {
  subject: string;
  html: string;
} {
  const content = `
    <h2>Instagram投稿の同期が完了しました</h2>
    <p>${companyName} 様</p>
    <p>Instagramの投稿が正常に同期されました。</p>

    <div class="info-box">
      <p><strong>同期された投稿数:</strong> ${postCount}件</p>
    </div>

    <p>お客様向けのページで、Instagramの投稿が表示されています。</p>

    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">ダッシュボードで確認</a>
    </p>
  `;

  return {
    subject: '【栃木プラットフォーム】Instagram投稿の同期完了',
    html: baseTemplate(content, 'Instagram同期完了'),
  };
}

/**
 * Instagram sync error notification
 */
export function instagramSyncError(companyName: string, error: string): {
  subject: string;
  html: string;
} {
  const content = `
    <h2>Instagram投稿の同期に失敗しました</h2>
    <p>${companyName} 様</p>
    <p>Instagramの投稿同期中にエラーが発生しました。</p>

    <div class="info-box" style="border-left-color: #dc2626;">
      <p><strong>エラー内容:</strong></p>
      <p style="color: #dc2626;">${error}</p>
    </div>

    <p>Instagram連携を再度設定していただくか、サポートまでお問い合わせください。</p>

    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile" class="button">設定を確認</a>
    </p>
  `;

  return {
    subject: '【栃木プラットフォーム】Instagram同期エラーのお知らせ',
    html: baseTemplate(content, 'Instagram同期エラー'),
  };
}
