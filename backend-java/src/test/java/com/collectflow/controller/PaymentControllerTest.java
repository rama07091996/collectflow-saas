package com.collectflow.controller;

import com.collectflow.dto.PaymentRequestDTO;
import com.collectflow.dto.PaymentResponseDTO;
import com.collectflow.service.StripePaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JUnit 5 Payment Endpoints & Security Test Suite")
class PaymentControllerTest {

    @Mock
    private StripePaymentService stripePaymentService;

    @InjectMocks
    private PaymentController paymentController;

    @Nested
    @DisplayName("POST /api/v1/payments/create-checkout-session")
    class CreateCheckoutSessionTests {

        @Test
        @DisplayName("1. Successfully creates Stripe Checkout Session for valid invoice")
        void testCreateCheckoutSession_Success() throws Exception {
            PaymentRequestDTO request = PaymentRequestDTO.builder()
                .invoiceId("inv_01")
                .invoiceNumber("INV-2024-001")
                .amount(BigDecimal.valueOf(4200.00))
                .currency("USD")
                .customerEmail("billing@novalabs.bio")
                .customerName("Nova Labs BioTech")
                .description("Q3 Enterprise Cloud Consulting Settlement")
                .build();

            PaymentResponseDTO mockResponse = PaymentResponseDTO.builder()
                .success(true)
                .sessionId("cs_test_a1b2c3d4e5")
                .checkoutUrl("https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5")
                .message("Secure Stripe checkout session initialized.")
                .build();

            when(stripePaymentService.createCheckoutSession(any(PaymentRequestDTO.class))).thenReturn(mockResponse);

            ResponseEntity<?> response = paymentController.createCheckoutSession(request);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody() instanceof PaymentResponseDTO);

            PaymentResponseDTO body = (PaymentResponseDTO) response.getBody();
            assertTrue(body.isSuccess());
            assertEquals("cs_test_a1b2c3d4e5", body.getSessionId());
            assertEquals("https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5", body.getCheckoutUrl());
            verify(stripePaymentService, times(1)).createCheckoutSession(any(PaymentRequestDTO.class));
        }

        @Test
        @DisplayName("2. Rejects request when invoice ID is null")
        void testCreateCheckoutSession_NullInvoiceId() {
            PaymentRequestDTO invalidRequest = PaymentRequestDTO.builder()
                .invoiceId(null)
                .amount(BigDecimal.valueOf(1500.00))
                .currency("USD")
                .build();

            ResponseEntity<?> response = paymentController.createCheckoutSession(invalidRequest);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertTrue(response.getBody() instanceof Map);
            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("Missing required invoiceId or amount", body.get("error"));
        }

        @Test
        @DisplayName("3. Rejects request when payment amount is null")
        void testCreateCheckoutSession_NullAmount() {
            PaymentRequestDTO invalidRequest = PaymentRequestDTO.builder()
                .invoiceId("inv_02")
                .amount(null)
                .currency("USD")
                .build();

            ResponseEntity<?> response = paymentController.createCheckoutSession(invalidRequest);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertTrue(response.getBody() instanceof Map);
            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("Missing required invoiceId or amount", body.get("error"));
        }

        @Test
        @DisplayName("4. Handles upstream Stripe service runtime exception gracefully")
        void testCreateCheckoutSession_UpstreamException() throws Exception {
            PaymentRequestDTO request = PaymentRequestDTO.builder()
                .invoiceId("inv_04")
                .amount(BigDecimal.valueOf(3200.00))
                .currency("USD")
                .build();

            when(stripePaymentService.createCheckoutSession(any(PaymentRequestDTO.class)))
                .thenThrow(new RuntimeException("Stripe API connection timeout"));

            ResponseEntity<?> response = paymentController.createCheckoutSession(request);

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertTrue(response.getBody() instanceof Map);
            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("Failed to initiate payment gateway session", body.get("error"));
        }
    }

    @Nested
    @DisplayName("POST /api/v1/payments/webhook")
    class WebhookTests {

        @Test
        @DisplayName("1. Successfully processes valid signed Stripe webhook event")
        void testHandleStripeWebhook_Success() throws Exception {
            String payload = "{\"id\":\"evt_test_01\",\"type\":\"checkout.session.completed\"}";
            String validSignature = "t=1614552000,v1=5257a869e7ecebeda32affa62cd493d8323600b7431e3e21937ecd8e62730033";
            Event mockEvent = mock(Event.class);

            when(stripePaymentService.verifyAndConstructWebhookEvent(payload, validSignature)).thenReturn(mockEvent);
            when(stripePaymentService.processWebhookEvent(mockEvent)).thenReturn(true);

            ResponseEntity<String> response = paymentController.handleStripeWebhook(payload, validSignature);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("Webhook received and processed", response.getBody());
            verify(stripePaymentService, times(1)).verifyAndConstructWebhookEvent(payload, validSignature);
            verify(stripePaymentService, times(1)).processWebhookEvent(mockEvent);
        }

        @Test
        @DisplayName("2. Rejects webhook when Stripe-Signature header is missing")
        void testHandleStripeWebhook_MissingSignature() {
            String payload = "{\"type\":\"checkout.session.completed\"}";

            ResponseEntity<String> response = paymentController.handleStripeWebhook(payload, null);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertEquals("Missing signature", response.getBody());
            verifyNoInteractions(stripePaymentService);
        }

        @Test
        @DisplayName("3. Rejects webhook with invalid HMAC signature with 400 Bad Request")
        void testHandleStripeWebhook_InvalidSignature() throws Exception {
            String payload = "{\"type\":\"checkout.session.completed\"}";
            String tamperedSignature = "t=1614552000,v1=tampered_signature_hash";

            when(stripePaymentService.verifyAndConstructWebhookEvent(payload, tamperedSignature))
                .thenThrow(new SignatureVerificationException("Invalid signature", "sig_header"));

            ResponseEntity<String> response = paymentController.handleStripeWebhook(payload, tamperedSignature);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertEquals("Invalid signature", response.getBody());
        }
    }
}
