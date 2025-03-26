// GitHub API Configuration
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_REPO = 'garkilic/Personal-Site-Revamped';

async function fetchGitHubIssues() {
    try {
        console.log('Fetching issues from GitHub...');
        const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/issues`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response:', errorText);
            throw new Error(`GitHub API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub issues:', error);
        throw error;
    }
}

function filterPrototypeIssues(issues) {
    return issues.filter(issue => 
        issue.labels.some(label => label.name === 'prototype')
    );
}

function getMonthLabel(issue) {
    const monthLabel = issue.labels.find(label => label.name.startsWith('month-'));
    return monthLabel ? monthLabel.name.replace('month-', 'Month ') : 'Month 1';
}

function updatePrototypeUI(issue) {
    document.getElementById('prototypeTitle').textContent = issue.title;
    document.getElementById('prototypeMonth').textContent = getMonthLabel(issue);
    document.getElementById('prototypeStatus').textContent = `Status: ${issue.state}`;
    document.getElementById('prototypeContent').innerHTML = marked.parse(issue.body);
}

function showDefaultContent() {
    document.getElementById('prototypeContent').innerHTML = `
        <h2>About AI Prototype Lab</h2>
        <p>Welcome to my AI Prototype Lab, where I build and explore experimental AI projects. Each prototype explores different aspects of artificial intelligence and emerging technologies.</p>
        
        <h2>Current Progress</h2>
        <p>Prototype content will be updated here as each project progresses. Content includes:</p>
        <ul>
            <li>Project overview and concept</li>
            <li>Technical implementation details</li>
            <li>Development progress updates</li>
            <li>Challenges and solutions</li>
            <li>Results and key learnings</li>
        </ul>
    `;
}

function showError(error) {
    document.getElementById('prototypeContent').innerHTML = `
        <p>Error loading prototype content. Please try again later.</p>
        <p class="error-details">${error.message}</p>
        <p>Please check the browser console for more details.</p>
    `;
}

async function loadPrototype() {
    try {
        const issues = await fetchGitHubIssues();
        const prototypeIssues = filterPrototypeIssues(issues);
        
        if (prototypeIssues.length > 0) {
            updatePrototypeUI(prototypeIssues[0]);
        } else {
            showDefaultContent();
        }
    } catch (error) {
        showError(error);
    }
} 