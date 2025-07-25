import fs from 'fs';
import output_json from './output_json';
import { VersionPair } from '../types/VersionPair';

//クライアントのバージョンペアを分類する
//data:

export function classify_types(data: VersionPair[],outputDir:string): void {
    data = [...data].sort((a, b) => b.count - a.count);
    //分類
    data.filter((item) => item.type === 'update');
    fs.writeFileSync(output_json.getUniqueOutputPath(outputDir, '','update') ,JSON.stringify(data.filter((item) => item.type === 'update'), null, 2));
    data.filter((item) => item.type === 'downgrade');
    fs.writeFileSync(output_json.getUniqueOutputPath(outputDir, '','downgrade'), JSON.stringify(data.filter((item) => item.type === 'downgrade'), null, 2));
    data.filter((item) => item.type === 'same');
    fs.writeFileSync(output_json.getUniqueOutputPath(outputDir, '','same'), JSON.stringify(data.filter((item) => item.type === 'same'), null, 2));
}
