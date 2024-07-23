import { Octokit } from "@octokit/rest";
import { setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";

(async () => {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const { data: comments } = await octokit.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number
    });

    const slackMessage = comments.find(comment => comment.body.includes(context.payload.pull_request.html_url));
    
    if (slackMessage) {
      setOutput('result', slackMessage.id);
    } else {
      setOutput('result', '');
    }
  } catch (error) {
    setFailed(context.repo.repo);
  }
})();
