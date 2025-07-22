import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import output_json from "../analyze_version/utils/output_json";
import { GitHubRepoItem } from './types/GitHubRepoItem';
import { searchRepositories } from './module/searchRepositories';
import { fetchDependencies } from './module/fetchDependencies';

dotenv.config();
const GITHUB_TOKEN:string | undefined = process.env.GITHUB_TOKEN;

// 実行例
(async () => {
    const libraryToSearch = 'next';  //対象ライブラリ名
    const numberOfRepos = 5;  //収集するクライアント数

    let client_list:string[] = [];
    console.log(`'${libraryToSearch}'を含むリポジトリを${numberOfRepos}件検索中...`);
    const repos:GitHubRepoItem[] = await searchRepositories(libraryToSearch, numberOfRepos,GITHUB_TOKEN);
    console.log(repos.length);

    if (repos.length > 0) {
        console.log(`\n'${libraryToSearch}'を含むリポジトリ (${repos.length}件):`);
        for (const [index, repoItem] of repos.entries()) {
            console.log(`  リポジトリ名: ${repoItem.repository.full_name}`);
            // console.log(`  URL: ${repoItem.repository.html_url}`);
            // console.log(`  package.json Path: ${repoItem.path}`);

            // 依存関係をpackage.jsonから取得できない可能性のあるものを除外
            const [owner, repo] = repoItem.repository.full_name.split('/');
            // console.log(`  オーナー: ${owner}, リポジトリ: ${repo}, パス: ${repoItem.path}`);
            const deps = await fetchDependencies(owner, repo, repoItem.path,GITHUB_TOKEN);
            if( deps.dependencies || deps.devDependencies) {
                client_list.push(repoItem.repository.full_name);
                //依存関係の内容を見たい場合は，以下のコメントアウトを外してください
                // repoItem.dependencies = deps.dependencies;
                // repoItem.devDependencies = deps.devDependencies;
            }
        }
        console.log(client_list);
    } else {
        console.log(`'${libraryToSearch}'を含むリポジトリは見つかりませんでした。`);
    }
    if(client_list.length > 0){
        // 出力先のパスを取得
        const now = new Date();
        const date = output_json.formatDateTime(now);
        let outputDir:string = '';
        outputDir = path.resolve(process.cwd(), '../../dataset/' + date + '/' + libraryToSearch);
        output_json.createOutputDirectory(outputDir);

        let outputPath = 'file1';
        outputPath = output_json.getUniqueOutputPath(outputDir, 'client_list', client_list.length.toString());
        // JSONデータをファイルに書き込む
        console.log('outputPath：',outputPath);
        //fs.writeFileSync(outputPath, JSON.stringify(client_list, null, 2));
    }
})();