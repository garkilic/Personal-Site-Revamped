// GitHub API Configuration
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_REPO = 'garkilic/Personal-Site-Revamped';

let currentIssueIndex = 0;
let prototypeIssues = [];
let currentBlogIndex = 0;
let blogIssues = [];



async function fetchGitHubIssues() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/issues?state=all&sort=created&direction=desc&per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 403) {
            console.warn('GitHub API rate limit exceeded. Please wait an hour and try again.');
            return [];
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching GitHub issues:', error);
        return [];
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

function filterBlogIssues(issues) {
    return issues.filter(issue => 
        issue.labels.some(label => 
            label.name === 'blog'
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
    // Use Solution Threads URL for newest prototype, GitHub repos for deprecated ones, GitHub URL for others
    let prototypeLink;
    if (issue.number === prototypeIssues[0].number) {
        prototypeLink = 'https://www.solutionthreads.com';
    } else if (issue.number === prototypeIssues[1].number) {
        prototypeLink = 'https://github.com/garkilic/super-tech-scout';
    } else if (issue.number === prototypeIssues[2].number) {
        prototypeLink = 'https://github.com/garkilic/kookcast';
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

function updateBlogUI(issue) {
    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    
    // Check if elements exist before proceeding
    if (!blogTitle || !blogContent) {
        console.error('Required blog elements not found');
        return;
    }
    
    // Add fade-in animation class
    blogTitle.classList.add('fade-in');
    blogContent.classList.add('fade-in');
    
    // Update content
    blogTitle.textContent = issue.title;
    blogContent.innerHTML = marked.parse(issue.body);
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

function showBlogDefaultContent() {
    const blogContent = document.getElementById('blogContent');
    
    // Check if element exists before proceeding
    if (!blogContent) {
        console.error('Blog content element not found');
        return;
    }
    
    blogContent.classList.add('fade-in');
    
    blogContent.innerHTML = `
        <div class="default-content fade-in">
            <h2>About Random Writing</h2>
            <p>Welcome to my random writing section, where I share thoughts, insights, and experiences about AI, development, and technology. Each post explores different aspects of the tech world and my journey as a developer.</p>
            
            <h2>What to Expect</h2>
            <p>Content will be updated here as I write new posts. Topics include:</p>
            <ul>
                <li>AI insights and observations</li>
                <li>Development tips and tricks</li>
                <li>Technology trends and analysis</li>
                <li>Personal experiences and learnings</li>
                <li>Thoughts on emerging technologies</li>
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

function showBlogError(error) {
    const blogContent = document.getElementById('blogContent');
    
    // Check if element exists before proceeding
    if (!blogContent) {
        console.error('Blog content element not found for error display');
        return;
    }
    
    blogContent.classList.add('fade-in');
    
    blogContent.innerHTML = `
        <div class="error-content fade-in">
            <p>Error loading blog content. Please try again later.</p>
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

async function loadBlog() {
    try {
        const issues = await fetchGitHubIssues();
        console.log('All issues:', issues);
        blogIssues = filterBlogIssues(issues);
        console.log('Filtered blog issues:', blogIssues);
        
        if (blogIssues.length > 0) {
            // Check for post hash in URL
            const hash = window.location.hash;
            const postNumber = hash ? parseInt(hash.replace('#post-', '')) : null;
            
            if (postNumber) {
                // Find the specific blog post
                const blogPost = blogIssues.find(issue => issue.number === postNumber);
                if (blogPost) {
                    updateBlogUI(blogPost);
                } else {
                    // If specific post not found, show the most recent
                    updateBlogUI(blogIssues[0]);
                }
            } else {
                // Default to the most recent blog post
                updateBlogUI(blogIssues[0]);
            }
        } else {
            showBlogDefaultContent();
        }
    } catch (error) {
        showBlogError(error);
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

// Function to get the most recent blog post URL
async function getMostRecentBlogUrl() {
    try {
        const issues = await fetchGitHubIssues();
        const blogIssues = filterBlogIssues(issues);
        
        if (blogIssues.length > 0) {
            return `Pages/blog.html#post-${blogIssues[0].number}`;
        }
        return 'Pages/blog.html';
    } catch (error) {
        console.error('Error getting most recent blog URL:', error);
        return 'Pages/blog.html';
    }
}

// Function to get the last posted date
async function getLastPostedDate() {
    try {
        const issues = await fetchGitHubIssues();
        
        if (!issues) {
            return 'Recently'; // Rate limited or error
        }
        
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

// Function to get the last blog post date
async function getLastBlogDate() {
    try {
        const issues = await fetchGitHubIssues();
        
        if (!issues) {
            return 'Recently'; // Rate limited or error
        }
        
        if (issues.length > 0) {
            // Just use the most recent issue date for now, same as getLastPostedDate
            const mostRecentIssue = issues[0];
            const date = new Date(mostRecentIssue.created_at);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        }
        
        return 'Recently';
    } catch (error) {
        console.error('Error getting last blog date:', error);
        return 'Recently';
    }
} 