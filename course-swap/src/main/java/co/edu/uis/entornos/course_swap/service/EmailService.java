package co.edu.uis.entornos.course_swap.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService (JavaMailSender mailSender, TemplateEngine templateEngine) {

        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async("emailExecutor")
    public void sendEmail(String destinationEmail, String subject, String templateName, Context context) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            String htmlBody = templateEngine.process(templateName, context);
            helper.setTo(destinationEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            helper.setFrom("keylersanchez00@gmail.com");
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error al enviar correo a " + destinationEmail + ": " + e.getMessage());
        }
    }
}
