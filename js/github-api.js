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
    ).sort((a, b) => b.number - a.number); // Sort by issue number, newest first
}

function getMonthLabel(issue) {
    const monthLabel = issue.labels.find(label => label.name.startsWith('month-'));
    if (!monthLabel) return 'Month 1';
    
    const monthNumber = monthLabel.name.replace('month-', '');
    // Add "-" to Month 2 to indicate it's ongoing
    if (monthNumber === '2') {
        return 'Month 2 -';
    }
    return `Month ${monthNumber}`;
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
    
    // Create status with link if available
    const statusText = `Status: ${issue.state}`;
    // Use Solution Threads URL for newest prototype, Super Tech Scout for second newest, KookCast for third newest, GitHub URL for others
    let prototypeLink;
    if (issue.number === prototypeIssues[0].number) {
        prototypeLink = 'https://www.solutionthreads.com';
    } else if (issue.number === prototypeIssues[1].number) {
        prototypeLink = 'https://super-tech-scout.netlify.app';
    } else if (issue.number === prototypeIssues[2].number) {
        prototypeLink = 'https://kook-cast.com';
    } else {
        prototypeLink = issue.html_url;
    }
    prototypeStatus.innerHTML = `${statusText} <a href="${prototypeLink}" target="_blank" rel="noopener noreferrer" class="prototype-link">View Prototype</a>`;
    
    prototypeContent.innerHTML = marked.parse(issue.body);

    // Update issue toggles
    if (issueToggles) {
        issueToggles.innerHTML = '';
        // Create a reversed copy of the array for display
        const reversedIssues = [...prototypeIssues].reverse();
        reversedIssues.forEach((prototypeIssue, index) => {
            const toggleLink = document.createElement('a');
            toggleLink.href = `#issue-${prototypeIssue.number}`;
            toggleLink.innerHTML = `Prototype <span class="prototype-number">${index + 1}</span>`;
            // Calculate the correct index for the active state
            const originalIndex = prototypeIssues.length - 1 - index;
            toggleLink.className = `issue-toggle ${originalIndex === currentIssueIndex ? 'active' : ''}`;
            toggleLink.onclick = (e) => {
                e.preventDefault();
                currentIssueIndex = originalIndex;
                window.location.hash = `issue-${prototypeIssue.number}`;
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
            <h2>About Development Blog</h2>
            <p>Welcome to my Development Blog, where I build and explore experimental prototypes. Each prototype explores different aspects of development and emerging technologies.</p>
            
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
            // Check for issue hash in URL
            const hash = window.location.hash;
            const issueNumber = hash ? parseInt(hash.replace('#issue-', '')) : null;
            
            if (issueNumber) {
                // Find the index of the requested issue
                const issueIndex = prototypeIssues.findIndex(issue => issue.number === issueNumber);
                if (issueIndex !== -1) {
                    currentIssueIndex = issueIndex;
                }
            } else {
                // Default to the newest prototype (index 0 since toggles are newest to oldest)
                currentIssueIndex = 0;
            }
            
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

// Function to get the last posted date
async function getLastPostedDate() {
    try {
        const issues = await fetchGitHubIssues();
        const prototypeIssues = filterPrototypeIssues(issues);
        
        if (prototypeIssues.length > 0) {
            const lastIssue = prototypeIssues[0]; // Most recent issue
            const date = new Date(lastIssue.updated_at);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        }
        return 'Recently';
    } catch (error) {
        console.error('Error getting last posted date:', error);
        return 'Recently';
    }
} 