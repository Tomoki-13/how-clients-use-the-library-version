import axios from 'axios';
import { GitHubRepoItem } from '../types/GitHubRepoItem';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchRepositories(
    libraryName: string,
    limitNum: number = 10,
    GITHUB_TOKEN: string | undefined
): Promise<GitHubRepoItem[]> {
    const BASE_URL = 'https://api.github.com/search/code';
    if (!GITHUB_TOKEN) {
        console.error('Please set GitHub token');
        return [];
    }

    const query = `"${libraryName}" filename:package.json language:JSON size:>0`;

    try {
        const uniqueReposMap = new Map<string, GitHubRepoItem>();
        const perPage = 100; // GitHub APIの最大値
        const maxPages = Math.ceil(limitNum / perPage);

        for (let page = 1; page <= maxPages; page++) {
            const response = await axios.get(BASE_URL, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3.text-match+json',
                },
                params: {
                    q: query,
                    per_page: perPage,
                    page,
                    sort: 'indexed',
                    order: 'desc',
                },
            });

            const items: GitHubRepoItem[] = response.data.items;
            //重複を除いてリポジトリをマップに追加
            for (const item of items) {
                if (!uniqueReposMap.has(item.repository.full_name)) {
                    uniqueReposMap.set(item.repository.full_name, {
                        name: item.repository.name,
                        path: item.path,
                        repository: item.repository
                    });
                }
            }

            if (uniqueReposMap.size >= limitNum) {
                break;
            }

            await sleep(1000); // APIレートリミット対策
        }
        //結果からlimitNum分だけを取得
        return Array.from(uniqueReposMap.values()).slice(0, limitNum);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`GitHub APIエラー: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
        } else {
            console.error('予期せぬエラーが発生しました:', error);
        }
        return [];
    }
}