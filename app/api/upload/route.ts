import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const session = await auth();
    
    // Segurança: Apenas usuários logados podem fazer upload
    if (!session?.user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Aqui você pode validar extensões, tamanhos, etc.
        // Como o usuário já é autenticado, permitimos.
        return {
          allowedContentTypes: ['application/zip', 'application/x-zip-compressed'],
          tokenPayload: JSON.stringify({
            userId: session.user.id, // Metadados úteis
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Webhook disparado APÓS o upload finalizar (útil para logs)
        console.log('Blob uploaded:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}