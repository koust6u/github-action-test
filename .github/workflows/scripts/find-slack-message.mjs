const { Octokit } = require("@octokit/rest");
const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require('node-fetch');

// GitHub API에 연결할 때 node-fetch를 사용하도록 설정
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: { fetch }
});

(async () => {
  try {
    // 콘텍스트 출력
    console.log("Context Repo Owner:", github.context.repo.owner);
    console.log("Context Repo Name:", github.context.repo.repo);
    console.log("PR Number:", github.context.payload.pull_request?.number);

    // PR 번호가 없는 경우 오류 처리
    if (!github.context.payload.pull_request?.number) {
      throw new Error("Pull request number is missing from the context payload.");
    }

    // PR 정보 가져오기
    const { data: pullRequest } = await octokit.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number
    });

    // PR URL 반환
    console.log("Pull Request URL:", pullRequest.html_url);
    core.setOutput('pr_url', pullRequest.html_url);
  } catch (error) {
    console.error("Error fetching PR:", error);
    core.setFailed(error.message);
  }
})();
