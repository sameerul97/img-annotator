interface Image {
    id: number;
    name: String;
    url: string;
}

interface EditorStore {
    auth: {
        authData: null | string;
    };
    posts: {
        images: Image[];
        isLoading: string;
        total_pages: number;
        search: boolean;
        current_page: string;
        search_query: {
            image_name: string;
        };
    };
}

export type {
    Image, EditorStore
}