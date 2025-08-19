import postgres from 'postgres';
import { NextResponse, NextRequest } from 'next/server';


const sql = postgres('postgresql://postgres.oholxxvzhdkelmjcgxpq:cFZfgXDrI6tdwuIB@aws-1-us-east-2.pooler.supabase.com:6543/postgres');

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data || data.title === undefined || data.description === undefined || data.author === undefined) {
        return NextResponse.json({ message: 'Missing required fields: title, description, author' }, { status: 400 });
    }

    if (!isStringFields(data.title, data.description, data.author)) {
        return NextResponse.json({
            message: 'Invalid data types. Title, description and author must be strings.',
            receivedTypes: {
                title: typeof data.title,
                description: typeof data.description,
                author: typeof data.author
            }
        }, { status: 400 });
    }

    if (!isValidTitle(data.title)) {
        return NextResponse.json({ message: 'Invalid Title. Must be between 5 and 100 characters.', title: data.title }, { status: 400 });
    }

    if (!isValidDescription(data.description)) {
        return NextResponse.json({ message: 'Invalid Description. Must be between 10 and 500 characters.', description: data.description }, { status: 400 });
    }

    if (!isValidAuthor(data.author)) {
        return NextResponse.json({ message: 'Invalid Author. Each word must start with uppercase.', author: data.author }, { status: 400 });
    }

    try {
        await saveToDatabase(data.title, data.description, data.author);
        return NextResponse.json({ message: 'Data is valid and saved successfully', data }, { status: 201 });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ message: 'Error saving data to database', error: String(error) }, { status: 500 });
    }
}

function isStringFields(title: any, description: any, author: any): boolean {
    return typeof title === 'string' && typeof description === 'string' && typeof author === 'string';
}

function isValidTitle(title: string): boolean {
    const t = title.trim();
    return t.length >= 5 && t.length <= 100;
}

function isValidDescription(description: string): boolean {
    const d = description.trim();
    return d.length >= 10 && d.length <= 500;
}

function isValidAuthor(author: string): boolean {
    if (!author || author.trim().length === 0) return false;
    const words = author.trim().split(" ");
    return words.every(word => word[0] === word[0].toUpperCase());
}


async function saveToDatabase(title: string, description: string, author: string) {
    await sql`INSERT INTO post (title, description, author) 
    VALUES (${title}, ${description}, ${author})`;
    console.log('Data inserted successfully');
}
