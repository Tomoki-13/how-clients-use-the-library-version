import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { checkoutCommit } from '../gitOperation/checkoutCommit';

const TEST_REPO_URL = 'https://github.com/Tomoki-13/how-clients-use-the-library-version.git';
const TEST_COMMIT_HASH = 'f8a423ee5894ae8f3bc2fc826ec073a0e8785a2a';
const CLONE_DIR = path.resolve(__dirname, './tmp-checkoutCommit-test-repo');

beforeAll(() => {//テスト用のリポジトリの用意 CLONE_DIR直下に中身だけクローン
    if (fs.existsSync(CLONE_DIR)) {
        fs.rmSync(CLONE_DIR, { recursive: true, force: true });
    }
    execSync(`git clone ${TEST_REPO_URL} ${CLONE_DIR}`, { stdio: 'inherit' });
    execSync(`git checkout ${TEST_COMMIT_HASH}`, { cwd: CLONE_DIR });
});

afterAll(() => {//テスト用のリポジトリの削除
    if (fs.existsSync(CLONE_DIR)) {
        fs.rmSync(CLONE_DIR, { recursive: true, force: true });
    }
});

test('checkoutCommit should return entries with version and commit properties', async () => {
    const libName = 'uuid';
    const result = await checkoutCommit(CLONE_DIR, libName);

    expect(Array.isArray(result.verList)).toBe(true);
    expect(result.verList.length).toBeGreaterThan(0);

    for (const entry of result.verList) {
        expect(entry).toHaveProperty('version');
        expect(entry).toHaveProperty('commit');
    }
});

test('checkoutCommit should return correct version-commit pairs', async () => {
    const libName = 'uuid';
    const result = await checkoutCommit(CLONE_DIR, libName);

    const expectedVerList = [
        {
        version: "^3.4.0",
        commit: "e6f9135a3a87315fc9445ece1496dec9a868d01b"
        },
        {
        version: "^7.0.0",
        commit: "3c8dff889c190f7fd7435351faf72a680e470068"
        },
        {
        version: "^9.0.0",
        commit: "f8a423ee5894ae8f3bc2fc826ec073a0e8785a2a"
        }
    ];

    expect(result.verList).toEqual(expectedVerList);
});