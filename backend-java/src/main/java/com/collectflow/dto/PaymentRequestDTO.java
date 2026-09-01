package com.collectflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private String invoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private String currency;
    private String customerEmail;
    private String customerName;
    private String description;
}
