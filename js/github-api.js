// GitHub API Configuration
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_REPO = 'garkilic/Personal-Site-Revamped';

let currentIssueIndex = 0;
let prototypeIssues = [];

async function fetchGitHubIssues() {
    try {
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
        issue.labels.some(label => 
            label.name === 'prototype' || 
            label.name === 'prototype2' ||
            label.name.startsWith('prototype')
        )
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Sort by creation date, oldest first
}

function getMonthLabel(issue) {
    const monthLabel = issue.labels.find(label => label.name.startsWith('month-'));
    return monthLabel ? monthLabel.name.replace('month-', 'Month ') : 'Month 1';
}

function updatePrototypeUI(issue) {
    const prototypeTitle = document.getElementById('prototypeTitle');
    const prototypeMonth = document.getElementById('prototypeMonth');
    const prototypeStatus = document.getElementById('prototypeStatus');
    const prototypeContent = document.getElementById('prototypeContent');
    const navigationLinks = document.getElementById('navigationLinks');
    const issueToggles = document.getElementById('issueToggles');
    
    // Add fade-in animation class
    prototypeTitle.classList.add('fade-in');
    prototypeMonth.classList.add('fade-in');
    prototypeStatus.classList.add('fade-in');
    prototypeContent.classList.add('fade-in');
    
    // Update content
    prototypeTitle.textContent = issue.title;
    prototypeMonth.textContent = getMonthLabel(issue);
    prototypeStatus.textContent = `Status: ${issue.state}`;
    prototypeContent.innerHTML = marked.parse(issue.body);

    // Update issue toggles
    if (issueToggles) {
        issueToggles.innerHTML = '';
        prototypeIssues.forEach((prototypeIssue, index) => {
            const toggleLink = document.createElement('a');
            toggleLink.href = '#';
            toggleLink.innerHTML = `Prototype <span class="prototype-number">${index + 1}</span>`;
            toggleLink.className = `issue-toggle ${index === currentIssueIndex ? 'active' : ''}`;
            toggleLink.onclick = (e) => {
                e.preventDefault();
                currentIssueIndex = index;
                updatePrototypeUI(prototypeIssue);
            };
            issueToggles.appendChild(toggleLink);
        });
    }

    // Update navigation links
    if (navigationLinks) {
        navigationLinks.innerHTML = '';
        
        // Previous link (older issue)
        if (currentIssueIndex > 0) {
            const prevLink = document.createElement('a');
            prevLink.href = '#';
            prevLink.textContent = '← Previous Issue';
            prevLink.onclick = (e) => {
                e.preventDefault();
                currentIssueIndex--;
                updatePrototypeUI(prototypeIssues[currentIssueIndex]);
            };
            navigationLinks.appendChild(prevLink);
        }

        // Next link (newer issue)
        if (currentIssueIndex < prototypeIssues.length - 1) {
            const nextLink = document.createElement('a');
            nextLink.href = '#';
            nextLink.textContent = 'Next Issue →';
            nextLink.onclick = (e) => {
                e.preventDefault();
                currentIssueIndex++;
                updatePrototypeUI(prototypeIssues[currentIssueIndex]);
            };
            navigationLinks.appendChild(nextLink);
        }
    }
}

function showDefaultContent() {
    const prototypeContent = document.getElementById('prototypeContent');
    prototypeContent.classList.add('fade-in');
    
    prototypeContent.innerHTML = `
        <div class="default-content fade-in">
            <h2>About Product Prototype Lab</h2>
            <p>Welcome to my Product Prototype Lab, where I build and explore experimental product prototypes. Each prototype explores different aspects of product development and emerging technologies.</p>
            
            <h2>Current Progress</h2>
            <p>Prototype content will be updated here as each project progresses. Content includes:</p>
            <ul>
                <li>Project overview and concept</li>
                <li>Technical implementation details</li>
                <li>Development progress updates</li>
                <li>Challenges and solutions</li>
                <li>Results and key learnings</li>
            </ul>
        </div>
    `;
}

function showError(error) {
    const prototypeContent = document.getElementById('prototypeContent');
    prototypeContent.classList.add('fade-in');
    
    prototypeContent.innerHTML = `
        <div class="error-content fade-in">
            <p>Error loading prototype content. Please try again later.</p>
            <p class="error-details">${error.message}</p>
            <p>Please check the browser console for more details.</p>
        </div>
    `;
}

async function loadPrototype() {
    try {
        const issues = await fetchGitHubIssues();
        console.log('All issues:', issues);
        prototypeIssues = filterPrototypeIssues(issues);
        console.log('Filtered prototype issues:', prototypeIssues);
        
        if (prototypeIssues.length > 0) {
            currentIssueIndex = 0; // Start with the most recent issue
            updatePrototypeUI(prototypeIssues[currentIssueIndex]);
        } else {
            showDefaultContent();
        }
    } catch (error) {
        showError(error);
    }
}

// Function to get the most recent issue URL
async function getMostRecentIssueUrl() {
    try {
        const issues = await fetchGitHubIssues();
        const prototypeIssues = filterPrototypeIssues(issues);
        
        if (prototypeIssues.length > 0) {
            return `Pages/projects.html#issue-${prototypeIssues[0].number}`;
        }
        return 'Pages/projects.html';
    } catch (error) {
        console.error('Error getting most recent issue URL:', error);
        return 'Pages/projects.html';
    }
} 