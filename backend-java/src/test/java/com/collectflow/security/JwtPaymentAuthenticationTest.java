package com.collectflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JUnit 5 Payment JWT Token Authentication Tests")
class JwtPaymentAuthenticationTest {

    private static final String SECRET_STRING = "collectflow_enterprise_fintech_jwt_secret_key_32_bytes_min!";
    private SecretKey signingKey;

    @BeforeEach
    void setUp() {
        signingKey = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    @DisplayName("1. Successfully generates and verifies a valid Payment JWT Token")
    void testGenerateAndValidatePaymentToken() {
        String invoiceId = "inv_01";
        double amount = 4200.00;
        String customerId = "cust_01";
        String nonce = UUID.randomUUID().toString();

        // 1. Generate Token
        String token = Jwts.builder()
            .subject(invoiceId)
            .claim("amount", amount)
            .claim("customerId", customerId)
            .claim("nonce", nonce)
            .claim("authorizedRole", "CREDIT_CONTROLLER")
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 mins
            .signWith(signingKey)
            .compact();

        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3);

        // 2. Parse and verify token claims
        Claims claims = Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        assertEquals(invoiceId, claims.getSubject());
        assertEquals(amount, claims.get("amount", Double.class));
        assertEquals(customerId, claims.get("customerId", String.class));
        assertEquals("CREDIT_CONTROLLER", claims.get("authorizedRole", String.class));
    }

    @Test
    @DisplayName("2. Rejects expired Payment JWT Tokens")
    void testExpiredPaymentToken_ThrowsException() {
        // Generate Token with past expiration
        String expiredToken = Jwts.builder()
            .subject("inv_expired")
            .claim("amount", 1000.00)
            .issuedAt(new Date(System.currentTimeMillis() - 30 * 60 * 1000))
            .expiration(new Date(System.currentTimeMillis() - 10 * 60 * 1000)) // Expired 10m ago
            .signWith(signingKey)
            .compact();

        assertThrows(Exception.class, () -> {
            Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(expiredToken);
        });
    }

    @Test
    @DisplayName("3. Rejects tampered Payment JWT Token signatures")
    void testTamperedPaymentToken_ThrowsSignatureException() {
        String validToken = Jwts.builder()
            .subject("inv_02")
            .claim("amount", 500.00)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
            .signWith(signingKey)
            .compact();

        // Tamper with payload (swap last characters)
        String[] parts = validToken.split("\\.");
        String tamperedToken = parts[0] + "." + parts[1] + "tampered." + parts[2];

        assertThrows(Exception.class, () -> {
            Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(tamperedToken);
        });
    }
}
