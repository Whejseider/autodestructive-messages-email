import {NextResponse} from 'next/server';
import {emailService} from '@/services/email.service';
import {messageRepository} from '@/repository/repository';
import {isValidEmail, isValidMessageId} from "@/utils/validators";
import {generateEmailHTML} from "@/lib/email-templates";

interface ShareRequest {
    messageId: string;
    email: string;
    title: string;
}

interface ShareResponse {
    success: boolean;
    provider?: string;
    previewUrl?: string | false;
}

interface ErrorResponse {
    error: string;
    details?: string;
}

export async function POST(request: Request): Promise<NextResponse<ShareResponse | ErrorResponse>> {
    try {

        let body: ShareRequest;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {error: 'Cuerpo de la petición inválido'},
                {status: 400}
            );
        }

        const {messageId, email, title} = body;

        if (!isValidMessageId(messageId)) {
            return NextResponse.json(
                {error: 'ID de mensaje inválido'},
                {status: 400}
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                {error: 'Email inválido'},
                {status: 400}
            );
        }

        if (!isValidEmail(title)) {
            return NextResponse.json(
                {error: 'Título del mensaje requerido'},
                {status: 400}
            );
        }

        const message = await messageRepository.getById(messageId);
        if (!message) {
            return NextResponse.json(
                {error: 'Mensaje no encontrado'},
                {status: 404}
            );
        }

        const origin = new URL(request.url).origin;
        const shareUrl = `${origin}/message/${messageId}`;

        const result = await emailService.sendEmail({
            to: email.trim(),
            subject: `Mensaje secreto: ${title}`,
            html: generateEmailHTML(title, shareUrl),
        });

        console.log('Mensaje compartido exitosamente:', {
            messageId,
            to: email,
            provider: result.provider,
        });

        return NextResponse.json({
            success: true,
            provider: result.provider,
            previewUrl: result.previewUrl,
        });

    } catch (error: any) {
        console.error('Error al compartir mensaje:', error);

        if (error.message?.includes('Email de destinatario inválido')) {
            return NextResponse.json(
                {error: 'Email de destinatario inválido'},
                {status: 400}
            );
        }

        return NextResponse.json(
            {
                error: 'Error al enviar el mensaje',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            {status: 500}
        );
    }
}



