import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import {isValidEmail} from "@/utils/validators";

type EmailProvider = 'sendgrid' | 'ethereal';

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

interface EmailResult {
    success: boolean;
    provider: EmailProvider;
    previewUrl?: string | false;
    messageId?: string;
}

class EmailService {
    private provider: EmailProvider;
    private defaultFrom: string;
    private etherealTransporter: nodemailer.Transporter | null = null;

    constructor() {
        this.provider = this.getEmailProvider();
        this.defaultFrom = process.env.EMAIL_FROM || 'noreply@mensajes-autodestructivos.com';

        if (this.provider === 'sendgrid') {
            this.initializeSendGrid();
        }
    }

    private getEmailProvider(): EmailProvider {
        const provider = process.env.EMAIL_PROVIDER as EmailProvider;

        if (provider === 'sendgrid' && !process.env.SENDGRID_API_KEY) {
            console.warn('SENDGRID_API_KEY no configurada. Usando Ethereal para pruebas.');
            return 'ethereal';
        }

        return provider || 'ethereal';
    }

    private initializeSendGrid(): void {
        const apiKey = process.env.SENDGRID_API_KEY;
        if (!apiKey) {
            throw new Error('SENDGRID_API_KEY no está configurada');
        }
        sgMail.setApiKey(apiKey);
    }

    async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
        const {to, subject, html, from = this.defaultFrom} = options;

        if (!to || !isValidEmail(to)) {
            throw new Error('Email de destinatario inválido');
        }

        if (!subject || subject.trim().length === 0) {
            throw new Error('El asunto del email es requerido');
        }

        if (!html || html.trim().length === 0) {
            throw new Error('El contenido del email es requerido');
        }

        try {
            if (this.provider === 'sendgrid') {
                return await this.sendWithSendGrid({to, from, subject, html});
            } else {
                return await this.sendWithEthereal({to, from, subject, html});
            }
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    }

    private async sendWithSendGrid(options: Required<SendEmailOptions>): Promise<EmailResult> {
        const {to, from, subject, html} = options;

        try {
            const [response] = await sgMail.send({
                to,
                from,
                subject,
                html,
            });

            console.log('Email enviado via SendGrid:', response.statusCode);

            return {
                success: true,
                provider: 'sendgrid',
                messageId: response.headers['x-message-id'] as string,
            };
        } catch (error: any) {
            console.error('Error en SendGrid:', error.response?.body || error);
            throw new Error(`Error al enviar email via SendGrid: ${error.message}`);
        }
    }

    private async sendWithEthereal(options: Required<SendEmailOptions>): Promise<EmailResult> {
        const {to, from, subject, html} = options;

        try {
            if (!this.etherealTransporter) {
                const testAccount = await nodemailer.createTestAccount();

                this.etherealTransporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });

                console.log('Cuenta de prueba Ethereal creada:', testAccount.user);
            }

            const info = await this.etherealTransporter.sendMail({
                from,
                to,
                subject,
                html,
            });

            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('Email de prueba enviado via Ethereal');
            console.log('Vista previa:', previewUrl);

            return {
                success: true,
                provider: 'ethereal',
                previewUrl,
                messageId: info.messageId,
            };
        } catch (error: any) {
            console.error('Error en Ethereal:', error);
            throw new Error(`Error al enviar email via Ethereal: ${error.message}`);
        }
    }

}

export const emailService = new EmailService();