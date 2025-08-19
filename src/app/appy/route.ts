import { NextResponse, NextRequest } from 'next/server';
import { PostRegistrer } from './utils/post-register';
import { PostValidator } from './utils/post-validator';
import { PostRepositoryPostgres } from './utils/post-repository-postgres';
// import { PostRepositoryInMemory } from './utils/post-repository-in-memory';

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data || data.title === undefined || data.description === undefined || data.author === undefined) {
        return NextResponse.json({
            message: 'Missing required fields: title, description, author'
        }, { status: 400 });
    }

    const postValidator = new PostValidator();
    const postRepository = new PostRepositoryPostgres();
    // const postRepository = new PostRepositoryInMemory();

    const postRegistrer = new PostRegistrer(postValidator, postRepository);

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
