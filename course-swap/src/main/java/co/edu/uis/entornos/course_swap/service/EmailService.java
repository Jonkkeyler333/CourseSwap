package co.edu.uis.entornos.course_swap.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_SEND_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient;
    private final TemplateEngine templateEngine;
    private final String brevoApiKey;
    private final String senderEmail;

    public EmailService(
            RestClient.Builder restClientBuilder,
            TemplateEngine templateEngine,
            org.springframework.core.env.Environment environment) {
        this.restClient = restClientBuilder.build();
        this.templateEngine = templateEngine;
        this.brevoApiKey = environment.getProperty("brevo.api-key", "");
        this.senderEmail = environment.getProperty("brevo.sender.email", "");
    }

    @Async("emailExecutor")
    public void sendEmail(String destinationEmail, String subject, String templateName, Context context) {
        if (brevoApiKey.isBlank() || senderEmail.isBlank()) {
            logger.error("No se puede enviar correo: faltan BREVO_API_KEY o BREVO_SENDER_EMAIL");
            return;
        }

        String htmlBody = templateEngine.process(templateName, context);
        Map<String, Object> request = Map.of(
                "sender", Map.of("email", senderEmail),
                "to", new Map[]{Map.of("email", destinationEmail)},
                "subject", subject,
                "htmlContent", htmlBody
        );

        try {
            restClient.post()
                    .uri(BREVO_SEND_EMAIL_URL)
                    .header("api-key", brevoApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            logger.info("Correo enviado a {}", destinationEmail);
        } catch (RestClientException e) {
            logger.error("Error al enviar correo a {} mediante la API de Brevo", destinationEmail, e);
        }
    }
}
