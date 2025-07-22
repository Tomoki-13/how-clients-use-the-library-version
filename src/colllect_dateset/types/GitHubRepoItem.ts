export interface GitHubRepoItem {
    name: string;
    path: string;
    repository: {
        name: string;
        full_name: string;
        html_url: string;
    };
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}
