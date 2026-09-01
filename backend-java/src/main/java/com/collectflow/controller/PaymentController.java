package com.collectflow.controller;

import com.collectflow.dto.PaymentRequestDTO;
import com.collectflow.dto.PaymentResponseDTO;
import com.collectflow.service.StripePaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final StripePaymentService stripePaymentService;

    /**
     * POST /api/v1/payments/create-checkout-session
     * Generates a 1-click Stripe Checkout URL for unpaid or overdue invoices.
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody PaymentRequestDTO request) {
        try {
            if (request.getAmount() == null || request.getInvoiceId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required invoiceId or amount"));
            }

            PaymentResponseDTO response = stripePaymentService.createCheckoutSession(request);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            log.error("Stripe API error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage(), "code", e.getCode()));
        } catch (Exception e) {
            log.error("Internal payment error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to initiate payment gateway session"));
        }
    }

    /**
     * POST /api/v1/payments/webhook
     * Cryptographically verified webhook endpoint for Stripe asynchronous events.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
        @RequestBody String payload,
        @RequestHeader(value = "Stripe-Signature", required = false) String signatureHeader
    ) {
        if (signatureHeader == null || signatureHeader.isEmpty()) {
            log.warn("Missing Stripe-Signature header in webhook request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing signature");
        }

        try {
            Event event = stripePaymentService.verifyAndConstructWebhookEvent(payload, signatureHeader);
            stripePaymentService.processWebhookEvent(event);
            return ResponseEntity.ok("Webhook received and processed");
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe webhook signature! Potential tampering detected: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            log.error("Webhook processing error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing failed");
        }
    }
}
