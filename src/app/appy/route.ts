import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data || data.title === undefined || data.description === undefined || data.author === undefined) {
        return NextResponse.json({
            message: 'Missing required fields: title, description, author'
        }, { status: 400 });
    }

    if (typeof data.title !== 'string' || typeof data.description !== 'string' || typeof data.author !== 'string') {
        return NextResponse.json({
            message: 'Invalid data types. Title, description and author must be strings.',
            receivedTypes: {
                title: typeof data.title,
                description: typeof data.description,
                author: typeof data.author
            }
        }, { status: 400 });
    }

    // --- Validación del título ---
    if (data.title.trim().length < 5 || data.title.trim().length > 100) {
        return NextResponse.json({
            message: 'Invalid Title. Must be between 5 and 100 characters.',
            title: data.title
        }, { status: 400 });
    }

    //  Validación de la descripción 
    if (data.description.trim().length < 10 || data.description.trim().length > 500) {
        return NextResponse.json({
            message: 'Invalid Description. Must be between 10 and 500 characters.',
            description: data.description
        }, { status: 400 });
    }

    // --- Validación del autor (sin regex) ---
    const authorTrimmed = data.author.trim();
    const authorWords = authorTrimmed.split(" ");

    let validAuthor = true;

    // El autor debe tener al menos un nombre y cada palabra debe empezar con mayúscula
    if (authorTrimmed.length === 0) {
        validAuthor = false;
    } else {
        for (const word of authorWords) {
            if (word.length === 0) {
                validAuthor = false;
                break;
            }
            const firstChar = word[0];
            if (firstChar !== firstChar.toUpperCase()) {
                validAuthor = false;
                break;
            }
        }
    }

    if (!validAuthor) {
        return NextResponse.json({
            message: 'Invalid Author. Each word must start with uppercase and contain valid characters.',
            author: data.author
        }, { status: 400 });
    }

    // --- Si todo es válido ---
    return NextResponse.json({
        message: 'Data is valid',
        data
    });
}
