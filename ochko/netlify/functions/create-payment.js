const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3/payments';

function isValidPayload(body) {
  return (
    typeof body.name === 'string' && body.name.trim() &&
    typeof body.phone === 'string' && body.phone.trim() &&
    typeof body.email === 'string' && body.email.trim() &&
    typeof body.address === 'string' && body.address.trim() &&
    typeof body.color === 'string' &&
    Number.isFinite(body.total) && body.total > 0
  );
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  const siteUrl = process.env.SITE_URL || 'https://example.com';

  if (!shopId || !secretKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'payment_not_configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  if (!isValidPayload(body)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_payload' }) };
  }

  const idempotenceKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

  const description = `Meta Starfire Kylie Edition — цвет: ${body.color}`;

  const payload = {
    amount: {
      value: body.total.toFixed(2),
      currency: 'RUB',
    },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: `${siteUrl}/thank-you.html`,
    },
    description: description.slice(0, 128),
    metadata: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      comment: body.comment || '',
      color: body.color,
    },
    receipt: {
      customer: { email: body.email },
      items: [
        {
          description: description.slice(0, 128),
          quantity: '1.00',
          amount: { value: body.total.toFixed(2), currency: 'RUB' },
          vat_code: 1,
        },
      ],
    },
  };

  try {
    const response = await fetch(YOOKASSA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
        'Idempotence-Key': idempotenceKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'yookassa_error', details: data }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ confirmationUrl: data.confirmation.confirmation_url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'request_failed' }) };
  }
};
