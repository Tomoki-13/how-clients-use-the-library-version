

import axios from 'axios';
import { GitHubRepoItem } from '../types/GitHubRepoItem';
import { fetchDependencies } from './fetchDependencies';

/**
     * 指定されたライブラリを含む package.json を持つリポジトリを検索
     * @param libraryName 検索するライブラリ名
     * @param limitNum 取得する結果数
     * @param GITHUB_TOKEN GitHub APIの認証トークン
 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function searchRepositories(
    libraryName: string,
    limitNum: number = 10,
    GITHUB_TOKEN: string | undefined
): Promise<GitHubRepoItem[]> {
    const BASE_URL = 'https://api.github.com/search/code';
    if(!GITHUB_TOKEN) {
        console.error('Please set GitHub token');
        return [];
    }
    const query = `"${libraryName}" filename:package.json language:JSON size:>0`;

    try {
        const uniqueReposMap = new Map<string, GitHubRepoItem>();
        const perPage = 100; // GitHub APIの最大値
        const maxPages = Math.ceil(limitNum / perPage);

        for (let page = 1; page <= maxPages; page++) {
            //per_page：1回のリクエストで取得できるのは１ページかつ最大100件
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

            for (const item of items) {
                const repoKey = item.repository.full_name;

                if (!uniqueReposMap.has(repoKey)) {
                    // fetchDependenciesでpackage.jsonの依存関係を取得できるか確認
                    const [owner, repo] = item .repository.full_name.split('/');
                    const deps = await fetchDependencies(owner, repo, item .path,GITHUB_TOKEN);

                    if (
                        (deps.dependencies && Object.keys(deps.dependencies).length > 0) ||
                        (deps.devDependencies && Object.keys(deps.devDependencies).length > 0)
                    ) {
                        uniqueReposMap.set(repoKey, {
                            name: item.repository.name,
                            path: item.path,
                            repository: item.repository
                        });
                    }
                    await sleep(2000);
                }
                if (uniqueReposMap.size >= limitNum) {
                    break;
                }
            }
            if (uniqueReposMap.size >= limitNum) { //必要！
                break;
            }
            await sleep(1000);
        }
        //配列の最初からlimitNum件を切り出して返す
        return Array.from(uniqueReposMap.values()).slice(0, limitNum);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`GitHub APIエラー: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
        } else {
            console.error(`予期せぬエラーが発生しました:`, error);
        }
        return [];
    }
}
