import type { NextConfig } from "next";
import { execSync } from "child_process";

let gitBranch = 'unknown';
try {
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
} catch (e) {
  console.warn('Failed to fetch git branch:', e);
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_GIT_BRANCH: gitBranch,
  },
};

export default nextConfig;
