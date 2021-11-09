export interface Image {
    id: String,
    url: String
    name: String
}

export interface ImagesState {
    isLoading: Boolean,
    images: Image[],
    total_pages: Number,
    current_page: string,
    search: Boolean,
    search_query: {
        image_name: string
    }
}