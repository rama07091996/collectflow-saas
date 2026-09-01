package com.collectflow.controller;

import com.collectflow.dto.PaymentRequestDTO;
import com.collectflow.dto.PaymentResponseDTO;
import com.collectflow.service.StripePaymentService;
import org.junit.jupiter.api.DisplayName;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private StripePaymentService stripePaymentService;

    @InjectMocks
    private PaymentController paymentController;

    @Test
    @DisplayName("Test Checkout Session Creation Returns 200 OK")
    void testCreateCheckoutSession_Success() throws Exception {
        PaymentRequestDTO request = PaymentRequestDTO.builder()
            .invoiceId("inv_01")
            .invoiceNumber("INV-2024-001")
            .amount(BigDecimal.valueOf(2500.00))
            .customerEmail("client@agency.com")
            .build();

        PaymentResponseDTO mockResponse = PaymentResponseDTO.builder()
            .success(true)
            .sessionId("cs_test_123")
            .checkoutUrl("https://checkout.stripe.com/pay/cs_test_123")
            .message("Secure payment session created successfully.")
            .build();

        when(stripePaymentService.createCheckoutSession(any(PaymentRequestDTO.class))).thenReturn(mockResponse);

        ResponseEntity<?> response = paymentController.createCheckoutSession(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof PaymentResponseDTO);
        PaymentResponseDTO body = (PaymentResponseDTO) response.getBody();
        assertEquals("cs_test_123", body.getSessionId());
        assertEquals("https://checkout.stripe.com/pay/cs_test_123", body.getCheckoutUrl());
    }

    @Test
    @DisplayName("Test Checkout Session Rejects Missing Invoice ID with 400 Bad Request")
    void testCreateCheckoutSession_MissingInvoiceId() {
        PaymentRequestDTO invalidRequest = PaymentRequestDTO.builder()
            .amount(BigDecimal.valueOf(100.00))
            .build();

        ResponseEntity<?> response = paymentController.createCheckoutSession(invalidRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    @DisplayName("Test Webhook Endpoint Rejects Requests Without Stripe-Signature Header")
    void testHandleStripeWebhook_MissingSignature() {
        String rawPayload = "{\"type\":\"checkout.session.completed\"}";

        ResponseEntity<String> response = paymentController.handleStripeWebhook(rawPayload, null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Missing signature", response.getBody());
    }
}
