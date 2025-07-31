import path from 'path';
import output_json from "../utils/output_json";
import { cloneRepo } from "../gitOperation/cloneRepo";
import { checkoutCommit } from "../gitOperation/checkoutCommit";
import { Client_Ver } from "../types/VersionCommits";

// リポジトリを順番にクローン
//libVersionはファイル名を変更するためだけに使用(client_listでフィルタリング済み)
export const extractVersion = async (client_list:string[],libName:string):Promise<Client_Ver[]> => {
    let std_Dir:string = path.resolve(process.cwd(), '../clientRepos/'); 
    output_json.createOutputDirectory(std_Dir);
    // ライブラリ名のディレクトリを作成
    let cloneDir = path.join(std_Dir, libName);
    output_json.createOutputDirectory(cloneDir);
    console.log(process.cwd());
    let verHistory:Client_Ver[] = [];


    //ぞれぞれにクローン，チェックアウト，バージョン確認を実行
    for(const client of client_list) {
        try{
            let repoPath = await cloneRepo(client,cloneDir);
            if (!repoPath) {
                console.warn(`clone failure: ${client}`);
                continue;
            }
            let c_data:Client_Ver = await checkoutCommit(repoPath, libName);
            //バージョン数が最低でも2以上のものを取得　変更しているものに限定
            if(c_data && c_data.verList.length > 1) {
                verHistory =  verHistory.concat(c_data);
            }
            process.chdir(std_Dir);
        } catch (error) {
            console.error(error);
        }
    }
    return verHistory;
};
