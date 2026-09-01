package com.collectflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private boolean success;
    private String sessionId;
    private String checkoutUrl;
    private String clientSecret;
    private String message;
}
