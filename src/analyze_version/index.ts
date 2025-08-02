import path from "path";
import fs from "fs";
import { extractVersion } from "./coreModule/extractVersion";
import { VersionPair } from "./types/VersionPair";
import { create_version_pairs } from "./coreModule/create_version_pairs";
import output_json from "./utils/output_json";
import { extractVersionList } from "./utils/arrayOperation";
import { classify_types } from "./utils/classify_type";

(async () => {
    // 入力 
    const libName = 'libname';
    const absolute_path = path.resolve(__dirname, '../../dataset/next/client_list_5-5.json');//collect_datesetで収集したクライアントのリスト
    let client_list:string[] = JSON.parse(fs.readFileSync(absolute_path, 'utf-8'));
    client_list = [...new Set(client_list)]
    
    let verHistory= await extractVersion(client_list,libName);
    // 出力先のパスを取得
    const now = new Date();
    const date = output_json.formatDateTime(now);
    let outputDir:string = path.resolve(process.cwd(), '../output/versionData/' + date + '/' + libName);
    output_json.createOutputDirectory(outputDir);
    let outputPath = output_json.getUniqueOutputPath(outputDir, 'version_history',client_list.length.toString());
    // JSONデータをファイルに書き込む
    console.log('outputPath：',outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(verHistory, null, 2));

    //バージョンペアのカウント
    let verPairs:string[][] = extractVersionList(verHistory);
    let pairs:VersionPair[] = create_version_pairs(verPairs,1);
    let outputPath_pair = 'file1';
    outputPath = output_json.getUniqueOutputPath(outputDir, 'result_pairs','');
    
    // JSONデータをファイルに書き込む
    fs.writeFileSync(outputPath_pair, JSON.stringify(pairs, null, 2));
    console.log(pairs);

    //update, downgrade, sameの分類
    classify_types(pairs,outputDir);
})();