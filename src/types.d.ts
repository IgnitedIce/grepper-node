interface GrepperAnswer {
    id: number;
    content: string;
    author_name: string;
    author_profile_url: string;
    title: string;
    upvotes: number;
    object: string;
    downvotes: number;
}

interface GrepperSearchResponse {
    object: string;
    data: GrepperAnswer[];
}

interface GrepperUpdateResponse {
    id: number;
    success: `${boolean}`;
}