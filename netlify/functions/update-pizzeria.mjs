const fetch = require("node-fetch");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "niprobin"; // Replace with your GitHub username
const REPO_NAME = "pizzalyon"; // Replace with your repository name
const FILE_PATH = "pizzeria.json"; // Path to your JSON file in the repo
const BRANCH = "main"; // Replace with your default branch

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const data = JSON.parse(event.body);

  try {
    // Fetch the current JSON file from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const file = await response.json();
    const content = Buffer.from(file.content, "base64").toString("utf-8");
    const json = JSON.parse(content);

    // Append new data
    json.push(data);

    // Update the file on GitHub
    const updatedContent = Buffer.from(JSON.stringify(json, null, 2)).toString(
      "base64"
    );

    await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: "Update pizzerias.json",
          content: updatedContent,
          sha: file.sha,
          branch: BRANCH,
        }),
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data saved successfully!" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update data." }),
    };
  }
};
