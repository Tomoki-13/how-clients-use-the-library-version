import axios from "axios";
/**
 * リポジトリの package.json を取得し、dependencies を抽出
 * @param owner - リポジトリのオーナー名
 * @param repo - リポジトリ名
 * @param path - package.json のパス
 * @param GITHUB_TOKEN - GitHubのアクセストークン
 */

export async function fetchDependencies(owner: string, repo: string, path: string,GITHUB_TOKEN:string | undefined): Promise<{ dependencies?: Record<string, string>, devDependencies?: Record<string, string> }> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const pkg = JSON.parse(content);

        return {
            dependencies: pkg.dependencies || {},
            devDependencies: pkg.devDependencies || {}
        };
    } catch (error) {
        console.error(`依存関係の取得に失敗しました: ${owner}/${repo}/${path}`);
        return {};
    }
}