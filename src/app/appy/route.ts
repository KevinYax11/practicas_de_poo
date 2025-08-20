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

export async function GET() {
    try {
        const postRepository = new PostRepositoryPostgres();
        const posts = await postRepository.findAll();

        return NextResponse.json({
            success: true,
            data: posts.map(post => ({
                id: post.getId(),
                title: post.getTitle(),
                description: post.getDescription(),
                author: post.getAuthor()
            }))
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error fetching posts' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const data = await request.json();

    if (!data || !data.id || !data.title || !data.description || !data.author) {
        return NextResponse.json({
            message: 'Missing required fields: id, title, description, author'
        }, { status: 400 });
    }

    const postValidator = new PostValidator();
    const validation = postValidator.validate(data.title, data.description, data.author);

    if (!validation.isValid) {
        return NextResponse.json({
            message: 'Validation failed',
            errors: validation.errors
        }, { status: 400 });
    }

    try {
        const postRepository = new PostRepositoryPostgres();
        const post = await postRepository.findById(data.id);

        if (!post) {
            return NextResponse.json({
                message: 'Post not found'
            }, { status: 404 });
        }

        const { Post } = await import('./utils/post');
        const newPost = Post.create(
            data.title,
            data.description,
            data.author
        );

        await postRepository.update(data.id, newPost);

        return NextResponse.json({
            message: 'Post updated successfully',
            data: {
                id: data.id,
                title: data.title,
                description: data.description,
                author: data.author
            }
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error updating post' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({
            message: 'Missing required field: id'
        }, { status: 400 });
    }

    try {
        const postRepository = new PostRepositoryPostgres();
        const post = await postRepository.findById(id);

        if (!post) {
            return NextResponse.json({
                message: 'Post not found'
            }, { status: 404 });
        }

        await postRepository.delete(id);

        return NextResponse.json({
            message: 'Post deleted successfully',
            id
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Error deleting post' },
            { status: 500 }
        );
    }
}
