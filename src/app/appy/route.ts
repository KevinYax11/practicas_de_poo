import { NextResponse, NextRequest } from 'next/server';
import { PostRegistrer } from './utils/post-register';
import { PostValidator } from './utils/post-validator';

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data || data.title === undefined || data.description === undefined || data.author === undefined) {
        return NextResponse.json({
            message: 'Missing required fields: title, description, author'
        }, { status: 400 });
    }

    const postValidator = new PostValidator();
    const postRegistrer = new PostRegistrer(postValidator);
    
    const result = await postRegistrer.register(data.title, data.description, data.author);

    if (!result.success) {
        return NextResponse.json({
            message: result.message,
            errors: result.errors
        }, { status: 400 });
    }

    return NextResponse.json({
        message: result.message,
        data: {
            title: data.title,
            description: data.description,
            author: data.author
        }
    }, { status: 201 });
}
