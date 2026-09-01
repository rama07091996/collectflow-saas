package com.collectflow.service;

import com.collectflow.dto.PaymentRequestDTO;
import com.collectflow.dto.PaymentResponseDTO;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class StripePaymentService {

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    /**
     * Creates a PCI-DSS compliant, cryptographic Stripe Checkout session.
     * Raw card data NEVER touches our server.
     */
    public PaymentResponseDTO createCheckoutSession(PaymentRequestDTO request) throws StripeException {
        long amountInCents = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();
        String currency = request.getCurrency() != null ? request.getCurrency().toLowerCase() : "usd";

        Map<String, String> metadata = new HashMap<>();
        metadata.put("invoiceId", request.getInvoiceId());
        metadata.put("invoiceNumber", request.getInvoiceNumber());
        metadata.put("customerEmail", request.getCustomerEmail());

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setCustomerEmail(request.getCustomerEmail())
            .setSuccessUrl(successUrl + "&session_id={CHECKOUT_SESSION_ID}&invoice=" + request.getInvoiceNumber())
            .setCancelUrl(cancelUrl + "&invoice=" + request.getInvoiceNumber())
            .putAllMetadata(metadata)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(currency)
                            .setUnitAmount(amountInCents)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Invoice #" + request.getInvoiceNumber())
                                    .setDescription(request.getDescription() != null ? request.getDescription() : "Automated AR Settlement via CollectFlow")
                                    .build()
                            )
                            .build()
                    )
                    .build()
            )
            .build();

        Session session = Session.create(params);

        log.info("Created Stripe Checkout Session {} for Invoice {}", session.getId(), request.getInvoiceNumber());

        return PaymentResponseDTO.builder()
            .success(true)
            .sessionId(session.getId())
            .checkoutUrl(session.getUrl())
            .clientSecret(session.getClientSecret())
            .message("Secure payment session created successfully.")
            .build();
    }

    /**
     * Validates Stripe HMAC-SHA256 signature to prevent replay and forgery attacks.
     */
    public Event verifyAndConstructWebhookEvent(String payload, String signatureHeader) throws SignatureVerificationException {
        return Webhook.constructEvent(payload, signatureHeader, webhookSecret);
    }

    /**
     * Handles webhook business logic (e.g. checkout.session.completed, payment_intent.succeeded)
     */
    public boolean processWebhookEvent(Event event) {
        log.info("Processing Stripe Webhook Event: type={}, id={}", event.getType(), event.getId());

        switch (event.getType()) {
            case "checkout.session.completed":
                try {
                    EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
                    if (dataObjectDeserializer != null && dataObjectDeserializer.getObject().isPresent()) {
                        Session session = (Session) dataObjectDeserializer.getObject().get();
                        if (session.getMetadata() != null) {
                            String invoiceId = session.getMetadata().get("invoiceId");
                            String invoiceNumber = session.getMetadata().get("invoiceNumber");
                            log.info("Payment confirmed for Invoice {} ({})! Amount: ${}", invoiceNumber, invoiceId, session.getAmountTotal() != null ? session.getAmountTotal() / 100.0 : 0.0);
                        }
                    }
                } catch (Exception e) {
                    log.warn("Event deserializer fallback: {}", e.getMessage());
                }
                return true;

            case "payment_intent.payment_failed":
                log.warn("Payment failed for event {}", event.getId());
                return true;

            default:
                log.info("Unhandled Stripe event type: {}", event.getType());
                return true;
        }
    }
}
