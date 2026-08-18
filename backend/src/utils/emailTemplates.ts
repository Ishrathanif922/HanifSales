export const orderConfirmationEmail = (orderNumber: string, items: { name: string; quantity: number; price: number }[], total: number, shippingAddress: { fullName: string; address: string; city: string }) => ({
  subject: `Order Confirmed - ${orderNumber}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#dc2626;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:24px;">Order Confirmed!</h1>
        <p style="margin:5px 0 0;opacity:0.9;">Thank you for your order</p>
      </div>
      <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 15px;font-size:18px;">Order #${orderNumber}</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #e5e7eb;">
            <th style="text-align:left;padding:8px 0;color:#6b7280;font-size:12px;">ITEM</th>
            <th style="text-align:center;padding:8px 0;color:#6b7280;font-size:12px;">QTY</th>
            <th style="text-align:right;padding:8px 0;color:#6b7280;font-size:12px;">PRICE</th>
          </tr>
          ${items.map(item => `
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:8px 0;font-size:14px;">${item.name}</td>
              <td style="padding:8px 0;text-align:center;font-size:14px;">${item.quantity}</td>
              <td style="padding:8px 0;text-align:right;font-size:14px;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join("")}
        </table>
        <div style="text-align:right;padding:15px 0;font-size:18px;font-weight:bold;">
          Total: Rs. ${total.toLocaleString()}
        </div>
        <div style="background:white;padding:15px;border-radius:8px;margin-top:10px;">
          <p style="margin:0;color:#6b7280;font-size:12px;">SHIPPING TO</p>
          <p style="margin:5px 0;font-size:14px;">${shippingAddress.fullName}</p>
          <p style="margin:0;font-size:13px;color:#4b5563;">${shippingAddress.address}, ${shippingAddress.city}</p>
        </div>
      </div>
      <div style="text-align:center;padding:15px;color:#9ca3af;font-size:12px;">
        <p>Hanif Sales - Everything You Need, One Trusted Store</p>
      </div>
    </div>
  `,
});

export const orderShippedEmail = (orderNumber: string, trackingNumber: string) => ({
  subject: `Order Shipped - ${orderNumber}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#16a34a;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:24px;">Order Shipped!</h1>
        <p style="margin:5px 0 0;opacity:0.9;">Your order is on its way</p>
      </div>
      <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;text-align:center;">
        <h2 style="margin:0 0 10px;">Order #${orderNumber}</h2>
        ${trackingNumber ? `<p style="margin:0;color:#4b5563;">Tracking Number: <strong>${trackingNumber}</strong></p>` : ""}
        <p style="margin:15px 0 0;color:#6b7280;">You will receive your order within 3-5 business days.</p>
      </div>
      <div style="text-align:center;padding:15px;color:#9ca3af;font-size:12px;">
        <p>Hanif Sales - Everything You Need, One Trusted Store</p>
      </div>
    </div>
  `,
});

export const orderCancelledEmail = (orderNumber: string, reason?: string) => ({
  subject: `Order Cancelled - ${orderNumber}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#6b7280;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:24px;">Order Cancelled</h1>
      </div>
      <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;text-align:center;">
        <h2 style="margin:0 0 10px;">Order #${orderNumber}</h2>
        ${reason ? `<p style="margin:0;color:#4b5563;">Reason: ${reason}</p>` : ""}
        <p style="margin:15px 0 0;color:#6b7280;">If you have any questions, please contact our support.</p>
      </div>
      <div style="text-align:center;padding:15px;color:#9ca3af;font-size:12px;">
        <p>Hanif Sales - Everything You Need, One Trusted Store</p>
      </div>
    </div>
  `,
});

export const refundApprovedEmail = (orderNumber: string, amount: number) => ({
  subject: `Refund Processed - ${orderNumber}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#2563eb;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:24px;">Refund Processed</h1>
      </div>
      <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;text-align:center;">
        <h2 style="margin:0 0 10px;">Order #${orderNumber}</h2>
        <p style="margin:0;font-size:18px;color:#16a34a;font-weight:bold;">Rs. ${amount.toLocaleString()} refunded</p>
        <p style="margin:15px 0 0;color:#6b7280;">Refund will be credited within 5-10 business days.</p>
      </div>
      <div style="text-align:center;padding:15px;color:#9ca3af;font-size:12px;">
        <p>Hanif Sales - Everything You Need, One Trusted Store</p>
      </div>
    </div>
  `,
});
