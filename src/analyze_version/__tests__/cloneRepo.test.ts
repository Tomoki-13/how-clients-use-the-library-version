import { cloneRepo } from '../gitOperation/cloneRepo';
import fs from 'fs';
import path from 'path';

const CLONE_DIR = path.resolve(__dirname, './test-clones')

afterAll(() => {//テスト用のリポジトリの削除
    if (fs.existsSync(CLONE_DIR)) {
        fs.rmSync(CLONE_DIR, { recursive: true, force: true });
    }
});

test('should clone repository', async () => {
    const repo = 'Tomoki-13/how-clients-use-the-library-version';

    const result = await cloneRepo(repo, CLONE_DIR);
    expect(result).toBeTruthy(); // null や undefined、空文字、false などでない
    expect(fs.existsSync(result!)).toBe(true); 
    
    if (result && fs.existsSync(result)) {
        fs.rmSync(CLONE_DIR, { recursive: true, force: true });
    }
});

test('should return null when cloning a non-existent repository', async () => {
    const repo = 'Tomoki-13/how';
    const result = await cloneRepo(repo, CLONE_DIR);
    expect(result).toBeNull(); //nullを期待

    if (result && fs.existsSync(result)) {
        fs.rmSync(CLONE_DIR, { recursive: true, force: true });
    }
});
