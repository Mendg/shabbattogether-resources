/**
 * ShabbaTTogether Inclusion Resources
 * Main Application JavaScript
 */

(function() {
    'use strict';

    // DOM Elements
    var grid = document.getElementById('resource-grid');
    var emptyState = document.getElementById('empty-state');
    var resultCount = document.getElementById('result-count');
    var header = document.getElementById('site-header');
    var filterBar = document.getElementById('filter-bar');
    var searchInput = document.getElementById('search-input');
    var searchClear = document.getElementById('search-clear');

    // State
    var currentFilter = 'all';
    var searchQuery = '';
    var resources = [];

    /**
     * Scroll to a resource card if URL has a hash
     */
    function scrollToHash() {
        var hash = window.location.hash.replace('#', '');
        if (!hash) return;
        var el = document.getElementById(hash);
        if (el && el.classList.contains('resource-card')) {
            setTimeout(function() {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('highlighted');
                setTimeout(function() { el.classList.remove('highlighted'); }, 3000);
            }, 300);
        }
    }

    /**
     * Initialize the application
     */
    function init() {
        loadResources();
        setupEventListeners();
        setupScrollObservers();
    }

    /**
     * Load resources from JSON data
     */
    function loadResources() {
        fetch('data/resources.json')
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to load resources');
                return response.json();
            })
            .then(function(data) {
                resources = data;
                updateCounts();
                renderCards('all');
                scrollToHash();
            })
            .catch(function(error) {
                console.error('Error loading resources:', error);
                grid.innerHTML = '<p style="text-align:center;color:var(--text-soft)">Failed to load resources. Please refresh the page.</p>';
            });
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Filter clicks
        var filters = document.getElementById('filters');
        if (filters) {
            filters.addEventListener('click', function(e) {
                var btn = e.target.closest('.filter-btn');
                if (!btn) return;
                document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderCards(currentFilter);
            });
        }

        // Hero category chips
        document.querySelectorAll('.hero-cat[data-cat]').forEach(function(chip) {
            chip.addEventListener('click', function() {
                var cat = this.getAttribute('data-cat');
                currentFilter = cat;
                document.querySelectorAll('.filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                    if (b.getAttribute('data-filter') === cat) b.classList.add('active');
                });
                renderCards(cat);
                document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Smooth scroll for CTA + who cards
        document.querySelectorAll('a[href="#resources"]').forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
            });
        });

        var whoLink = document.querySelector('a[href="#who"]');
        if (whoLink) {
            whoLink.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('who').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                searchQuery = this.value.trim().toLowerCase();
                searchClear.classList.toggle('visible', this.value.length > 0);
                renderCards(currentFilter);
            });
        }
        if (searchClear) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                searchQuery = '';
                searchClear.classList.remove('visible');
                renderCards(currentFilter);
                searchInput.focus();
            });
        }

        // Who cards -> filter and scroll
        document.querySelectorAll('.who-card[data-category]').forEach(function(card) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                var cat = this.getAttribute('data-category');
                currentFilter = cat;
                document.querySelectorAll('.filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                    if (b.getAttribute('data-filter') === cat) b.classList.add('active');
                });
                renderCards(cat);
                document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /**
     * Setup scroll observers for animations
     */
    function setupScrollObservers() {
        // Sticky header
        window.addEventListener('scroll', function() {
            if (header) {
                header.classList.toggle('scrolled', window.scrollY > 60);
            }
        }, { passive: true });

        // Scroll-triggered reveals
        var revealObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(function(el) {
            revealObs.observe(el);
        });

        // Sticky filter bar shadow
        if (filterBar) {
            var stickyObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    filterBar.classList.toggle('scrolled', !entry.isIntersecting);
                });
            }, { threshold: 0 });
            stickyObs.observe(document.getElementById('resources'));
        }
    }

    /**
     * Create a tag element
     */
    function createTag(label, cls) {
        var span = document.createElement('span');
        span.className = 'card-tag ' + cls;
        span.textContent = label;
        return span;
    }

    /**
     * Create a resource card element
     */
    function slugify(file) {
        return file.replace('resources/', '').replace('.pdf', '');
    }

    function createCard(r, index) {
        var card = document.createElement('div');
        var slug = slugify(r.file);
        card.id = slug;
        card.className = 'resource-card' + (r.featured ? ' featured' : '');
        card.style.animationDelay = (index * 0.04) + 's';

        if (r.featured) {
            var badge = document.createElement('div');
            badge.className = 'featured-badge';
            badge.textContent = 'Complete Guide';
            card.appendChild(badge);
        }

        var tagsDiv = document.createElement('div');
        tagsDiv.className = 'card-tags';
        r.tags.forEach(function(t) {
            tagsDiv.appendChild(createTag(t.label, t.cls));
        });
        card.appendChild(tagsDiv);

        var title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = r.title;
        card.appendChild(title);

        var desc = document.createElement('div');
        desc.className = 'card-description';
        desc.textContent = r.description;
        card.appendChild(desc);

        var meta = document.createElement('div');
        meta.className = 'card-meta';

        var price = document.createElement('span');
        price.className = 'price-tag';
        price.textContent = 'Free';
        meta.appendChild(price);

        var btn = document.createElement('a');
        btn.href = r.file;
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.className = 'download-btn';

        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('d', 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3');
        svg.appendChild(path);
        btn.appendChild(svg);
        btn.appendChild(document.createTextNode(' Download'));
        meta.appendChild(btn);

        var shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.title = 'Copy link';
        shareBtn.setAttribute('data-slug', slug);
        var shareSvg = document.createElementNS(svgNS, 'svg');
        shareSvg.setAttribute('width', '14');
        shareSvg.setAttribute('height', '14');
        shareSvg.setAttribute('viewBox', '0 0 24 24');
        shareSvg.setAttribute('fill', 'none');
        shareSvg.setAttribute('stroke', 'currentColor');
        shareSvg.setAttribute('stroke-width', '2');
        var sharePath = document.createElementNS(svgNS, 'path');
        sharePath.setAttribute('stroke-linecap', 'round');
        sharePath.setAttribute('stroke-linejoin', 'round');
        sharePath.setAttribute('d', 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.78 8.591');
        shareSvg.appendChild(sharePath);
        shareBtn.appendChild(shareSvg);
        shareBtn.addEventListener('click', function() {
            var url = window.location.origin + window.location.pathname + '#' + slug;
            navigator.clipboard.writeText(url).then(function() {
                shareBtn.classList.add('copied');
                shareBtn.title = 'Copied!';
                setTimeout(function() {
                    shareBtn.classList.remove('copied');
                    shareBtn.title = 'Copy link';
                }, 2000);
            });
        });
        meta.appendChild(shareBtn);

        card.appendChild(meta);
        return card;
    }

    /**
     * Render resource cards based on filter
     */
    function renderCards(filter) {
        var filtered = filter === 'all'
            ? resources
            : resources.filter(function(r) { return r.categories.indexOf(filter) !== -1; });

        if (searchQuery) {
            filtered = filtered.filter(function(r) {
                var haystack = (r.title + ' ' + r.description).toLowerCase();
                var words = searchQuery.split(/\s+/);
                return words.every(function(w) { return haystack.indexOf(w) !== -1; });
            });
        }

        while (grid.firstChild) { grid.removeChild(grid.firstChild); }

        if (filtered.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }

        resultCount.textContent = 'Showing ' + filtered.length + ' resource' + (filtered.length !== 1 ? 's' : '');
        filtered.forEach(function(r, i) { grid.appendChild(createCard(r, i)); });
    }

    /**
     * Update filter button counts
     */
    function updateCounts() {
        var countAll = document.getElementById('count-all');
        if (countAll) countAll.textContent = resources.length;
        
        ['shluchim','athome','teens','campus','children','women','adults'].forEach(function(c) {
            var el = document.getElementById('count-' + c);
            if (el) {
                el.textContent = resources.filter(function(r) { 
                    return r.categories.indexOf(c) !== -1; 
                }).length;
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
