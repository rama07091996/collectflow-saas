package com.collectflow.service;

import com.collectflow.dto.PaymentRequestDTO;
import com.collectflow.dto.PaymentResponseDTO;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class StripePaymentServiceTest {

    @InjectMocks
    private StripePaymentService stripePaymentService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(stripePaymentService, "webhookSecret", "whsec_test_secret_12345");
        ReflectionTestUtils.setField(stripePaymentService, "successUrl", "http://localhost:3000/invoices?success=true");
        ReflectionTestUtils.setField(stripePaymentService, "cancelUrl", "http://localhost:3000/invoices?cancelled=true");
    }

    @Test
    @DisplayName("Test Stripe Webhook Event Processing for checkout.session.completed")
    void testProcessWebhookEvent_CheckoutSessionCompleted() {
        Event mockEvent = new Event();
        mockEvent.setType("checkout.session.completed");
        mockEvent.setId("evt_test_123");

        boolean result = stripePaymentService.processWebhookEvent(mockEvent);
        assertTrue(result, "Should process checkout.session.completed event successfully");
    }

    @Test
    @DisplayName("Test Stripe Webhook Signature Verification Rejection on Tampered Signature")
    void testVerifyAndConstructWebhookEvent_TamperedSignature() {
        String rawPayload = "{\"id\":\"evt_123\",\"type\":\"payment_intent.succeeded\"}";
        String invalidSignature = "t=1614552000,v1=invalid_tampered_signature_hash";

        assertThrows(SignatureVerificationException.class, () -> {
            stripePaymentService.verifyAndConstructWebhookEvent(rawPayload, invalidSignature);
        }, "Should throw SignatureVerificationException when signature does not match payload");
    }

    @Test
    @DisplayName("Test PaymentRequestDTO Builder and Validation")
    void testPaymentRequestDTO_Fields() {
        PaymentRequestDTO request = PaymentRequestDTO.builder()
            .invoiceId("inv_01")
            .invoiceNumber("INV-2024-001")
            .amount(BigDecimal.valueOf(4500.00))
            .currency("USD")
            .customerEmail("billing@novalabs.bio")
            .customerName("Nova Labs BioTech")
            .description("AR Invoice Settlement")
            .build();

        assertEquals("inv_01", request.getInvoiceId());
        assertEquals("INV-2024-001", request.getInvoiceNumber());
        assertEquals(BigDecimal.valueOf(4500.00), request.getAmount());
        assertEquals("billing@novalabs.bio", request.getCustomerEmail());
    }
}
