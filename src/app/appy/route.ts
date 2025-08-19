import postgres from 'postgres';
import { NextResponse, NextRequest } from 'next/server';

// Conexión a la base de datos
const sql = postgres('postgresql://postgres.oholxxvzhdkelmjcgxpq:cFZfgXDrI6tdwuIB@aws-1-us-east-2.pooler.supabase.com:6543/postgres');

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

    // --- Validación de la descripción ---
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
            message: 'Invalid Author. Each word must start with uppercase.',
            author: data.author
        }, { status: 400 });
    }

    try {
        // Guardar en la base de datos 
        await sql`
            INSERT INTO post (title, description, author)
            VALUES (${data.title}, ${data.description}, ${data.author})
        `;

        return NextResponse.json({
            message: 'Data is valid and saved successfully',
            data
        }, { status: 201 });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({
            message: 'Error saving data to database',
            error: String(error)
        }, { status: 500 });
    }
}
