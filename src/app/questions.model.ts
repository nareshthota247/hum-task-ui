export interface Question {
    id:       number;
    question: string;
    options:  Option[];
    answer ?: string;
}

export interface Option {
    description: string;
    option:      string;
}
