// SmartMicrogridAI - Interactive Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Mobile navigation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 14, 39, 0.98)';
            } else {
                navbar.style.background = 'rgba(10, 14, 39, 0.95)';
            }
        }
    });
    
    // Demo data for charts (illustrative/demo values only - not live from MATLAB)
    const timeHours = Array.from({length: 24}, (_, i) => i.toString());
    
    // Solar generation chart - demo profile
    const solarCtx = document.getElementById('solarChart');
    if (solarCtx) {
        new Chart(solarCtx, {
            type: 'line',
            data: {
                labels: timeHours,
                datasets: [{
                    label: 'Solar Power (kW) - Demo',
                    data: generateSolarProfile(),
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHitRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (hours)',
                            color: '#a0aec0'
                        },
                        grid: {
                            color: 'rgba(160, 174, 192, 0.1)'
                        },
                        ticks: {
                            color: '#a0aec0'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Power (kW)',
                            color: '#a0aec0'
                        },
                        grid: {
                            color: 'rgba(160, 174, 192, 0.1)'
                        },
                        ticks: {
                            color: '#a0aec0'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 14, 39, 0.9)',
                        titleColor: '#00d4ff',
                        bodyColor: '#ffffff'
                    }
                }
            }
        });
    }
    
    // Load demand chart
    const loadCtx = document.getElementById('loadChart');
    if (loadCtx) {
        new Chart(loadCtx, {
            type: 'line',
            data: {
                labels: timeHours,
                datasets: [{
                    label: 'Load Demand (kW) - Demo',
                    data: generateLoadProfile(),
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }, {
                    label: 'Load Served (kW) - Demo',
                    data: generateServedLoadProfile(),
                    borderColor: '#ff8c94',
                    backgroundColor: 'rgba(255, 140, 148, 0.1)',
                    tension: 0.4,
                    fill: false,
                    borderDash: [5, 5],
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Time (hours)', color: '#a0aec0' },
                        grid: { color: 'rgba(160, 174, 192, 0.1)' },
                        ticks: { color: '#a0aec0' }
                    },
                    y: {
                        title: { display: true, text: 'Power (kW)', color: '#a0aec0' },
                        grid: { color: 'rgba(160, 174, 192, 0.1)' },
                        ticks: { color: '#a0aec0' },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ffffff' } },
                    tooltip: { backgroundColor: 'rgba(10, 14, 39, 0.9)', titleColor: '#00d4ff', bodyColor: '#ffffff' }
                }
            }
        });
    }
    
    // Battery SOC chart
    const batteryCtx = document.getElementById('batteryChart');
    if (batteryCtx) {
        new Chart(batteryCtx, {
            type: 'line',
            data: {
                labels: timeHours,
                datasets: [{
                    label: 'Battery SOC (%) - Demo',
                    data: generateSOCProfile(),
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Time (hours)', color: '#a0aec0' },
                        grid: { color: 'rgba(160, 174, 192, 0.1)' },
                        ticks: { color: '#a0aec0' }
                    },
                    y: {
                        title: { display: true, text: 'SOC (%)', color: '#a0aec0' },
                        grid: { color: 'rgba(160, 174, 192, 0.1)' },
                        ticks: { color: '#a0aec0' },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ffffff' } },
                    tooltip: { backgroundColor: 'rgba(10, 14, 39, 0.9)', titleColor: '#00d4ff', bodyColor: '#ffffff' }
                }
            }
        });
    }
    
    // Grid power chart
    const gridCtx = document.getElementById('gridChart');
    if (gridCtx) {
        new Chart(gridCtx, {
            type: 'line',
            data: {
                labels: timeHours,
                datasets: [{
                    label: 'Grid Power (kW) - Demo (+import/-export)',
                    data: generateGridProfile(),
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }, {
                    label: 'Power Balance (kW) - Demo',
                    data: generateBalanceProfile(),
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.4,
                    fill: false,
                    borderDash: [3, 3],
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Time (hours)', color: '#a0aec0' },
                        grid: { color: 'rgba(160, 174, 192, 0.1)' },
                        ticks: { color: '#a0aec0' }
                    },
                    y: {
                        title: { display: true, text: 'Power (kW)', color: '#a0aec0' },
                        grid: { color: 'rgba(160, 174, 192, 0.1)' },
                        ticks: { color: '#a0aec0' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ffffff' } },
                    tooltip: { backgroundColor: 'rgba(10, 14, 39, 0.9)', titleColor: '#00d4ff', bodyColor: '#ffffff' }
                }
            }
        });
    }
    
    // Generate demo data functions (purely illustrative - not from actual MATLAB execution of this website)
    function generateSolarProfile() {
        return timeHours.map(h => {
            const hour = parseInt(h);
            if (hour < 6 || hour > 18) return 0;
            const val = 5000 * Math.max(0, Math.sin(Math.PI * (hour - 6) / 12)) / 1000;
            return Math.round(val * 10) / 10;
        });
    }
    
    function generateLoadProfile() {
        return timeHours.map(h => {
            const hour = parseInt(h);
            let base = 3000 + 900 * Math.sin(2 * Math.PI * (hour + 6) / 24);
            if (hour >= 12 && hour < 13) base += 2500;
            return Math.round(base / 100) / 10;
        });
    }
    
    function generateServedLoadProfile() {
        return timeHours.map(h => {
            const hour = parseInt(h);
            let base = 3000 + 900 * Math.sin(2 * Math.PI * (hour + 6) / 24);
            if (hour >= 12 && hour < 13) base += 2500;
            if (hour >= 10 && hour < 14) {
                const solar = generateSolarProfile()[h];
                const avail = solar * 1000 + 2500 * 0.6;
                if (avail < base) return Math.round(avail / 100) / 10;
            }
            return Math.round(base / 100) / 10;
        });
    }
    
    function generateSOCProfile() {
        return timeHours.map(h => {
            const hour = parseInt(h);
            let soc = 50 + 30 * Math.sin(2 * Math.PI * (hour - 6) / 24);
            if (soc > 90) soc = 90;
            if (soc < 20) soc = 20;
            return Math.round(soc);
        });
    }
    
    function generateGridProfile() {
        return timeHours.map(h => {
            const hour = parseInt(h);
            if (hour >= 10 && hour < 14) return -0.5;
            const pv = generateSolarProfile()[h] * 1000;
            const load = (3000 + 900 * Math.sin(2 * Math.PI * (hour + 6) / 24)) / 1000;
            let grid = load - (pv / 1000);
            if (grid > 0) return Math.round(grid * 10) / 10;
            return Math.round(grid * 10) / 10;
        });
    }
    
    function generateBalanceProfile() {
        return timeHours.map(h => 0);
    }
    
    // Animate dashboard values
    function animateValue(elementId, start, end, duration, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        const range = end - start;
        const startTime = Date.now();
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const value = start + range * easeOut;
            if (elementId === 'batteryValue') {
                element.textContent = Math.round(value) + suffix;
                const level = document.getElementById('batteryLevel');
                if (level) level.style.width = Math.round(value) + '%';
            } else if (elementId === 'solarValue' || elementId === 'loadValue') {
                element.textContent = value.toFixed(1) + suffix;
            } else {
                element.textContent = Math.round(value) + suffix;
            }
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        update();
    }
    
    // Trigger animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateValue('solarValue', 0, 4.2, 1500, ' kW');
                animateValue('loadValue', 0, 3.8, 1500, ' kW');
                animateValue('batteryValue', 0, 65, 1500, '%');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const dashboard = document.querySelector('.dashboard-section');
    if (dashboard) {
        observer.observe(dashboard);
    }
});
