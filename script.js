document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const currentYearSpan = document.getElementById('currentYear');

    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            header.classList.add('py-2', 'shadow-xl');
            header.classList.remove('py-4');
        } else {
            header.classList.remove('py-2', 'shadow-xl');
            header.classList.add('py-4');
        }

        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            header.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    });

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute !== '#' && document.querySelector(hrefAttribute)) {
                e.preventDefault();
                document.querySelector(hrefAttribute).scrollIntoView({
                    behavior: 'smooth'
                });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    async function loadMarkdown(filePath, elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            return;
        }
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
            }
            const markdownText = await response.text();
            if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
                element.innerHTML = marked.parse(markdownText);
            } else {
                element.textContent = 'Error: Markdown parser (marked.js) not available.';
            }
        } catch (error) {
            element.textContent = 'Error: Could not load article content.';
        }
    }

    loadMarkdown('articles/breaking_news_amex_platinum.md', 'article-breaking-news');
    loadMarkdown('articles/analysis_may_2025_rewards.md', 'article-analysis-rewards');
    loadMarkdown('articles/guide_dining_rewards.md', 'article-guide-dining');

    const navLinksDesktop = document.querySelectorAll('#main-header nav a:not(.bg-accent-orange)');
    const navLinksMobile = document.querySelectorAll('#mobile-menu a:not(.bg-accent-orange)');
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    function styleNavLink(link, currentPathStr) {
        const linkPath = (link.getAttribute('href') || '').split('/').pop() || 'index.html';

        link.classList.remove('text-accent-orange', 'font-semibold');
        link.classList.remove('text-primary-blue'); 

        if (linkPath === 'index.html') {
            link.classList.add('text-primary-blue', 'font-semibold');
        } else {
            link.classList.remove('font-semibold'); 
        }
        
        if (linkPath === currentPathStr) {
            link.classList.remove('text-primary-blue'); 
            link.classList.add('text-accent-orange', 'font-semibold');
        }
    }

    navLinksDesktop.forEach(link => styleNavLink(link, currentPath));
    navLinksMobile.forEach(link => styleNavLink(link, currentPath));
});
