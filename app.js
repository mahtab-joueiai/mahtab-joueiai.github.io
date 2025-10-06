// Configuration
const ACTIVITIES = ['کار', 'دانش', 'ورزش', 'آهنگ', 'فرهنگ', 'دوستان', 'هنر', 'بوستان'];
const TIME_SLOTS = [...Array(17).keys()].map(h => `${String(h + 7).padStart(2, '0')}:00`)
    .concat([...Array(3).keys()].map(h => `${String(h).padStart(2, '0')}:00`));

const SPORTS_CATEGORIES = {
    'کمان': '🏹',
    'دوچرخه': '🚴‍♀️',
    'سنگ نوردی': '🧗‍♀️',
    'دو': '🏃‍♀️',
    'شنا': '🏊‍♀️',
    'یوگا': '🧘‍♀️',
    'کوهنوردی': '🥾',
    'دیگر': '⚡'
};

const MUSIC_CATEGORIES = {'چنگ': '🎵', 'تار': '🎼', 'پیانو': '🎹', 'آواز': '👼', 'دیگر': '🎤'};
const SOCIAL_CATEGORIES = {'فرزند': '👶', 'یار': '🙋‍♂️', 'دوست': '👤'};
const ART_CATEGORIES = {'گبه': '🌃', 'بافتنی': '⛄', 'دوختنی': '🌠', 'تور': '🧜‍♀️', 'کشیدنی و نوشتنی': '🎨', 'دیگر':'🧞‍♀️'};
const CULTURE_CATEGORIES = {'خواندن': '📖', 'زبان': '🙊', 'یادگیری': '📔'};

// Storage functions
function loadData() {
    const data = localStorage.getItem('activity_log');
    return data ? JSON.parse(data) : {};
}

function saveData(data) {
    localStorage.setItem('activity_log', JSON.stringify(data));
}

function loadPlanning() {
    const data = localStorage.getItem('planning_data');
    return data ? JSON.parse(data) : {};
}

function savePlanningData(data) {
    localStorage.setItem('planning_data', JSON.stringify(data));
}

// Timer functionality
let timerInterval;
let seconds = 0;

function updateTimerDisplay() {
    let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    document.getElementById("timer").textContent = hrs + ":" + mins + ":" + secs;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    seconds = 0;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = null;
}

// Tab switching
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    if (tabId === 'summary') {
        updateSummary();
    } else if (tabId === 'planning') {
        renderPlanningForm();
    } else if (tabId === 'activities') {
        renderActivitiesTable();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('selected_date').value = today;

    // Populate mood dropdown
    const moodSelect = document.getElementById('mood');
    for (let i = 1; i <= 10; i++) {
        const emoji = i <= 3 ? '😢' : i <= 6 ? '😐' : i <= 8 ? '😊' : '😄';
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} ${emoji}`;
        moodSelect.appendChild(option);
    }

    loadDayData();
    renderActivitiesTable();
});

// Load day data into form
function loadDayData() {
    const date = document.getElementById('selected_date').value;
    const data = loadData();
    const dayData = data[date] || {};
    const metadata = dayData._metadata || {};

    // Load metrics
    document.getElementById('mood').value = metadata.mood || '';
    document.getElementById('calories').value = metadata.calories || '';
    document.getElementById('water').value = metadata.water || '';
    document.getElementById('sleep').value = metadata.sleep || '';
    document.getElementById('alcohol').value = metadata.alcohol || '';
    document.getElementById('weight').value = metadata.weight || '';
    document.getElementById('steps').value = metadata.steps || '';

    // Load namaz
    document.getElementById('هاون').checked = metadata['هاون گاه'] || false;
    document.getElementById('رپیتون').checked = metadata['رپیتون گاه'] || false;
    document.getElementById('ازیرن').checked = metadata['ازیرن گاه'] || false;
    document.getElementById('ایوه_سریترم').checked = metadata['ایوه سریترم'] || false;
    document.getElementById('اوشیهن').checked = metadata['اوشیهن گاه'] || false;

    renderActivitiesTable();
}

// Save metrics
function saveMetrics() {
    const date = document.getElementById('selected_date').value;
    const data = loadData();

    if (!data[date]) data[date] = {};
    if (!data[date]._metadata) data[date]._metadata = {};

    // Save metrics
    const mood = document.getElementById('mood').value;
    const calories = document.getElementById('calories').value;
    const water = document.getElementById('water').value;
    const sleep = document.getElementById('sleep').value;
    const alcohol = document.getElementById('alcohol').value;
    const weight = document.getElementById('weight').value;
    const steps = document.getElementById('steps').value;

    if (mood) data[date]._metadata.mood = parseInt(mood);
    if (calories) data[date]._metadata.calories = parseFloat(calories);
    if (water) data[date]._metadata.water = parseFloat(water);
    if (sleep) data[date]._metadata.sleep = parseFloat(sleep);
    if (alcohol) data[date]._metadata.alcohol = parseFloat(alcohol);
    if (weight) data[date]._metadata.weight = parseFloat(weight);
    if (steps) data[date]._metadata.steps = parseInt(steps);

    // Save namaz
    data[date]._metadata['هاون گاه'] = document.getElementById('هاون').checked;
    data[date]._metadata['رپیتون گاه'] = document.getElementById('رپیتون').checked;
    data[date]._metadata['ازیرن گاه'] = document.getElementById('ازیرن').checked;
    data[date]._metadata['ایوه سریترم'] = document.getElementById('ایوه_سریترم').checked;
    data[date]._metadata['اوشیهن گاه'] = document.getElementById('اوشیهن').checked;

    saveData(data);
    alert('اندوخته شد! ✅');
}

// Render activities table
function renderActivitiesTable() {
    const date = document.getElementById('selected_date').value;
    document.getElementById('activities-date').textContent = date;

    const data = loadData();
    const dayData = data[date] || {};

    let html = '<table class="activity-table" style="direction: ltr;"><thead><tr><th>زمان</th>';

    ACTIVITIES.forEach(activity => {
        const cellClass = ['ورزش', 'آهنگ', 'هنر', 'فرهنگ', 'دوستان'].includes(activity) ? 'class="sports-cell"' : '';
        html += `<th ${cellClass}>${activity}</th>`;
    });

    html += '</tr></thead><tbody>';

    TIME_SLOTS.forEach(hour => {
        html += `<tr><td class="hour-cell">${hour}</td>`;
        const hourData = dayData[hour] || {};

        ACTIVITIES.forEach(activity => {
            const cellClass = ['ورزش', 'آهنگ', 'هنر', 'فرهنگ', 'دوستان'].includes(activity) ? 'class="sports-cell"' : '';
            html += `<td ${cellClass}>`;

            const value = hourData[activity] || '';
            html += `<input type="number" class="activity-input" data-hour="${hour}" data-activity="${activity}"
                     value="${value}" step="0.25" min="0" max="1" placeholder="0">`;

            // Add dropdowns for categorized activities
            if (activity === 'ورزش') {
                html += '<br><select class="sports-dropdown" data-hour="' + hour + '" data-type="sport_type">';
                html += '<option value="">کدام</option>';
                Object.entries(SPORTS_CATEGORIES).forEach(([key, icon]) => {
                    const selected = hourData.sport_type === key ? 'selected' : '';
                    html += `<option value="${key}" ${selected}>${icon} ${key}</option>`;
                });
                html += '</select>';
            } else if (activity === 'آهنگ') {
                html += '<br><select class="sports-dropdown" data-hour="' + hour + '" data-type="music_type">';
                html += '<option value="">کدام</option>';
                Object.entries(MUSIC_CATEGORIES).forEach(([key, icon]) => {
                    const selected = hourData.music_type === key ? 'selected' : '';
                    html += `<option value="${key}" ${selected}>${icon} ${key}</option>`;
                });
                html += '</select>';
            } else if (activity === 'هنر') {
                html += '<br><select class="sports-dropdown" data-hour="' + hour + '" data-type="art_type">';
                html += '<option value="">کدام</option>';
                Object.entries(ART_CATEGORIES).forEach(([key, icon]) => {
                    const selected = hourData.art_type === key ? 'selected' : '';
                    html += `<option value="${key}" ${selected}>${icon} ${key}</option>`;
                });
                html += '</select>';
            } else if (activity === 'فرهنگ') {
                html += '<br><select class="sports-dropdown" data-hour="' + hour + '" data-type="culture_type">';
                html += '<option value="">کدام</option>';
                Object.entries(CULTURE_CATEGORIES).forEach(([key, icon]) => {
                    const selected = hourData.culture_type === key ? 'selected' : '';
                    html += `<option value="${key}" ${selected}>${icon} ${key}</option>`;
                });
                html += '</select>';
            } else if (activity === 'دوستان') {
                html += '<br><select class="sports-dropdown" data-hour="' + hour + '" data-type="social_type">';
                html += '<option value="">کدام</option>';
                Object.entries(SOCIAL_CATEGORIES).forEach(([key, icon]) => {
                    const selected = hourData.social_type === key ? 'selected' : '';
                    html += `<option value="${key}" ${selected}>${icon} ${key}</option>`;
                });
                html += '</select>';
            }

            html += '</td>';
        });

        html += '</tr>';
    });

    html += '</tbody></table>';
    document.getElementById('activities-table').innerHTML = html;
}

// Save activities
function saveActivities() {
    const date = document.getElementById('selected_date').value;
    const data = loadData();

    if (!data[date]) data[date] = {};

    // Get all activity inputs
    document.querySelectorAll('.activity-input').forEach(input => {
        const hour = input.dataset.hour;
        const activity = input.dataset.activity;
        const value = parseFloat(input.value) || 0;

        if (!data[date][hour]) data[date][hour] = {};
        data[date][hour][activity] = value;
    });

    // Get all type dropdowns
    document.querySelectorAll('.sports-dropdown').forEach(select => {
        const hour = select.dataset.hour;
        const type = select.dataset.type;
        const value = select.value;

        if (!data[date][hour]) data[date][hour] = {};
        if (value) data[date][hour][type] = value;
    });

    saveData(data);
    alert('اندوخته شد! ✅');
}

// Calculate daily totals
function calculateDailyTotals(dayData) {
    const totals = {};
    ACTIVITIES.forEach(act => totals[act] = 0);

    Object.keys(dayData).forEach(hour => {
        if (hour === '_metadata') return;
        const hourData = dayData[hour];
        ACTIVITIES.forEach(activity => {
            totals[activity] += parseFloat(hourData[activity] || 0);
        });
    });

    return totals;
}

// Calculate category breakdown
function calculateCategoryBreakdown(dayData, activity, typeKey) {
    const breakdown = {};

    Object.keys(dayData).forEach(hour => {
        if (hour === '_metadata') return;
        const hourData = dayData[hour];

        if (hourData[activity] && hourData[typeKey]) {
            const hours = parseFloat(hourData[activity] || 0);
            const category = hourData[typeKey];

            if (category && hours > 0) {
                breakdown[category] = (breakdown[category] || 0) + hours;
            }
        }
    });

    return breakdown;
}

// Get activity status
function getActivityStatus(actual, goalFrequency, goalHours) {
    if (!goalFrequency || !goalHours) return 'neutral';

    let target = 0;
    if (goalFrequency === 'daily') target = parseFloat(goalHours);
    else if (goalFrequency === 'weekly') target = parseFloat(goalHours) / 7;
    else if (goalFrequency === 'monthly') target = parseFloat(goalHours) / 30;

    if (target === 0) return 'neutral';
    if (actual >= target * 0.9) return 'excellent';
    if (actual >= target * 0.7) return 'good';
    if (actual >= target * 0.5) return 'warning';
    return 'poor';
}

// Get metric status
function getMetricStatus(actual, minVal, maxVal) {
    if (!minVal && !maxVal) return 'neutral';

    const actualNum = parseFloat(actual);
    const minNum = minVal ? parseFloat(minVal) : null;
    const maxNum = maxVal ? parseFloat(maxVal) : null;

    if (minNum !== null && maxNum !== null) {
        if (actualNum >= minNum && actualNum <= maxNum) return 'excellent';
        if (actualNum >= minNum * 0.9 && actualNum <= maxNum * 1.1) return 'good';
        if (actualNum >= minNum * 0.8 || actualNum <= maxNum * 1.2) return 'warning';
        return 'poor';
    } else if (minNum !== null) {
        if (actualNum >= minNum) return 'excellent';
        if (actualNum >= minNum * 0.9) return 'good';
        if (actualNum >= minNum * 0.8) return 'warning';
        return 'poor';
    } else if (maxNum !== null) {
        if (actualNum <= maxNum) return 'excellent';
        if (actualNum <= maxNum * 1.1) return 'good';
        if (actualNum <= maxNum * 1.2) return 'warning';
        return 'poor';
    }

    return 'neutral';
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        'excellent': 'کرفه',
        'good': 'خوب',
        'warning': 'هشدار',
        'poor': 'کم'
    };
    return labels[status] || '-';
}

// Update summary
function updateSummary() {
    const date = document.getElementById('selected_date').value;
    document.getElementById('summary-date').textContent = date;

    const data = loadData();
    const dayData = data[date] || {};
    const metadata = dayData._metadata || {};
    const planning = loadPlanning();

    const totals = calculateDailyTotals(dayData);
    const sportsBreakdown = calculateCategoryBreakdown(dayData, 'ورزش', 'sport_type');
    const musicBreakdown = calculateCategoryBreakdown(dayData, 'آهنگ', 'music_type');
    const artBreakdown = calculateCategoryBreakdown(dayData, 'هنر', 'art_type');
    const socialBreakdown = calculateCategoryBreakdown(dayData, 'دوستان', 'social_type');
    const cultureBreakdown = calculateCategoryBreakdown(dayData, 'فرهنگ', 'culture_type');

    let html = '';

    // Activity summaries
    ACTIVITIES.forEach(activity => {
        const total = totals[activity];
        if (total > 0) {
            const goalFreq = planning[activity + '_frequency'] || '';
            const goalHrs = planning[activity + '_hours'] || '';
            const status = getActivityStatus(total, goalFreq, goalHrs);

            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>${activity}:</strong> ${total.toFixed(2)} hours `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;

            if (goalFreq && goalHrs) {
                let target = 0;
                if (goalFreq === 'daily') target = parseFloat(goalHrs);
                else if (goalFreq === 'weekly') target = parseFloat(goalHrs) / 7;
                else if (goalFreq === 'monthly') target = parseFloat(goalHrs) / 30;

                html += `<div class="goal-info">نشانه: ${target.toFixed(2)} سات در روز (${goalHrs} سات ${goalFreq})</div>`;
            }

            // Show breakdowns
            if (activity === 'ورزش' && Object.keys(sportsBreakdown).length > 0) {
                html += '<div class="breakdown-summary">';
                Object.entries(sportsBreakdown).forEach(([type, hrs]) => {
                    if (hrs > 0) html += `<span class="breakdown-item">${SPORTS_CATEGORIES[type] || '⚡'} ${type}: ${hrs.toFixed(2)}h</span>`;
                });
                html += '</div>';
            } else if (activity === 'آهنگ' && Object.keys(musicBreakdown).length > 0) {
                html += '<div class="breakdown-summary">';
                Object.entries(musicBreakdown).forEach(([type, hrs]) => {
                    if (hrs > 0) html += `<span class="breakdown-item">${MUSIC_CATEGORIES[type] || '🎵'} ${type}: ${hrs.toFixed(2)}h</span>`;
                });
                html += '</div>';
            } else if (activity === 'هنر' && Object.keys(artBreakdown).length > 0) {
                html += '<div class="breakdown-summary">';
                Object.entries(artBreakdown).forEach(([type, hrs]) => {
                    if (hrs > 0) html += `<span class="breakdown-item">${ART_CATEGORIES[type] || '🎨'} ${type}: ${hrs.toFixed(2)}h</span>`;
                });
                html += '</div>';
            } else if (activity === 'دوستان' && Object.keys(socialBreakdown).length > 0) {
                html += '<div class="breakdown-summary">';
                Object.entries(socialBreakdown).forEach(([type, hrs]) => {
                    if (hrs > 0) html += `<span class="breakdown-item">${SOCIAL_CATEGORIES[type] || '👥'} ${type}: ${hrs.toFixed(2)}h</span>`;
                });
                html += '</div>';
            } else if (activity === 'فرهنگ' && Object.keys(cultureBreakdown).length > 0) {
                html += '<div class="breakdown-summary">';
                Object.entries(cultureBreakdown).forEach(([type, hrs]) => {
                    if (hrs > 0) html += `<span class="breakdown-item">${CULTURE_CATEGORIES[type] || '📖'} ${type}: ${hrs.toFixed(2)}h</span>`;
                });
                html += '</div>';
            }

            html += '</div>';
        }
    });

    // Total hours
    const totalHours = Object.values(totals).reduce((a, b) => a + b, 0);
    html += `<div class="summary-item total-hours"><strong>Total Logged:</strong> ${totalHours.toFixed(2)} hours</div>`;

    // Metrics
    if (Object.keys(metadata).length > 0) {
        html += '<div class="metrics-section"><strong>Daily Metrics:</strong>';

        if (metadata.mood) {
            const status = getMetricStatus(metadata.mood, planning.mood_min, planning.mood_max);
            const emoji = metadata.mood <= 3 ? '😢' : metadata.mood <= 6 ? '😐' : metadata.mood <= 8 ? '😊' : '😄';
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>کام:</strong> ${metadata.mood}/10 ${emoji} `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.mood_min || planning.mood_max) {
                html += `<div class="goal-info">نشانه: ${planning.mood_min || ''} ${planning.mood_min && planning.mood_max ? '-' : ''} ${planning.mood_max || ''}</div>`;
            }
            html += '</div>';
        }

        if (metadata.calories) {
            const status = getMetricStatus(metadata.calories, planning.calories_min, planning.calories_max);
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>خوراک:</strong> ${metadata.calories} 🥪 `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.calories_min || planning.calories_max) {
                html += `<div class="goal-info">نشانه: ${planning.calories_min || ''} ${planning.calories_min && planning.calories_max ? '-' : ''} ${planning.calories_max || ''}</div>`;
            }
            html += '</div>';
        }

        if (metadata.water) {
            const status = getMetricStatus(metadata.water, planning.water_min, planning.water_max);
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>آب:</strong> ${metadata.water} 💧 `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.water_min || planning.water_max) {
                html += `<div class="goal-info">نشانه: ${planning.water_min || ''} ${planning.water_min && planning.water_max ? '-' : ''} ${planning.water_max || ''}</div>`;
            }
            html += '</div>';
        }

        if (metadata.sleep) {
            const status = getMetricStatus(metadata.sleep, planning.sleep_min, planning.sleep_max);
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>خواب:</strong> ${metadata.sleep} 🌛 `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.sleep_min || planning.sleep_max) {
                html += `<div class="goal-info">نشانه: ${planning.sleep_min || ''} ${planning.sleep_min && planning.sleep_max ? '-' : ''} ${planning.sleep_max || ''}</div>`;
            }
            html += '</div>';
        }

        if (metadata.alcohol) {
            const status = getMetricStatus(metadata.alcohol, planning.alcohol_min, planning.alcohol_max);
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>می:</strong> ${metadata.alcohol} 🍺 `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.alcohol_min || planning.alcohol_max) {
                html += `<div class="goal-info">نشانه: ${planning.alcohol_min || ''} ${planning.alcohol_min && planning.alcohol_max ? '-' : ''} ${planning.alcohol_max || ''}</div>`;
            }
            html += '</div>';
        }

        if (metadata.weight) {
            const status = getMetricStatus(metadata.weight, planning.weight_min, planning.weight_max);
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>سنگینی:</strong> ${metadata.weight} ⚖️ `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.weight_min || planning.weight_max) {
                html += `<div class="goal-info">نشانه: ${planning.weight_min || ''} ${planning.weight_min && planning.weight_max ? '-' : ''} ${planning.weight_max || ''}</div>`;
            }
            html += '</div>';
        }

        if (metadata.steps) {
            const status = getMetricStatus(metadata.steps, planning.steps_min, planning.steps_max);
            html += `<div class="summary-item summary-item-${status}">`;
            html += `<strong>گام:</strong> ${metadata.steps} 🚶 `;
            html += `<span class="status-badge status-${status}">${getStatusLabel(status)}</span>`;
            if (planning.steps_min || planning.steps_max) {
                html += `<div class="goal-info">نشانه: ${planning.steps_min || ''} ${planning.steps_min && planning.steps_max ? '-' : ''} ${planning.steps_max || ''}</div>`;
            }
            html += '</div>';
        }

        html += '</div>';
    }

    // Namaz section
    const namazPrayers = ['هاون گاه', 'رپیتون گاه', 'ازیرن گاه', 'ایوه سریترم', 'اوشیهن گاه'];
    const completedPrayers = namazPrayers.filter(p => metadata[p]);
    const prayerCount = completedPrayers.length;

    if (prayerCount > 0 || planning.namaz_min || planning.namaz_max) {
        let namazStatus = 'neutral';
        const namazMin = parseInt(planning.namaz_min) || 0;
        const namazMax = parseInt(planning.namaz_max) || 0;

        if (namazMin > 0 || namazMax > 0) {
            if (namazMin > 0 && namazMax > 0) {
                if (prayerCount >= namazMin && prayerCount <= namazMax) namazStatus = 'excellent';
                else if (prayerCount >= namazMin * 0.8) namazStatus = 'good';
                else if (prayerCount >= namazMin * 0.6) namazStatus = 'warning';
                else namazStatus = 'poor';
            } else if (namazMin > 0) {
                if (prayerCount >= namazMin) namazStatus = 'excellent';
                else if (prayerCount >= namazMin * 0.8) namazStatus = 'good';
                else namazStatus = 'warning';
            }
        }

        html += '<div class="metrics-section"><strong>نماژ:</strong>';
        html += `<div class="summary-item summary-item-${namazStatus}">`;
        html += `<strong>شمار:</strong> ${prayerCount} از 5 `;
        html += `<span class="status-badge status-${namazStatus}">${getStatusLabel(namazStatus)}</span>`;
        if (namazMin > 0 || namazMax > 0) {
            html += `<div class="goal-info">نشانه: ${namazMin || ''} ${namazMin && namazMax ? '-' : ''} ${namazMax || ''} نماز در روز</div>`;
        }
        if (prayerCount > 0) {
            html += '<div style="margin-top: 8px;">';
            completedPrayers.forEach(p => {
                html += `<span class="prayer-completed">✅ ${p}</span> `;
            });
            html += '</div>';
        }
        html += '</div></div>';
    }

    document.getElementById('summary-content').innerHTML = html || '<div class="summary-item"><em>No activities logged for this date.</em></div>';
}

// Render planning form
function renderPlanningForm() {
    const planning = loadPlanning();

    let html = '<div class="form-section"><h3>پیمانه</h3>';

    // Mood
    html += '<div style="display: grid; grid-template-columns: 200px 150px 150px 100px; gap: 10px; align-items: center; margin: 10px 0;">';
    html += '<label><strong>کام 👧:</strong></label>';
    html += '<select id="plan_mood_min" style="width: 100%;"><option value="">از</option>';
    for (let i = 1; i <= 10; i++) {
        const emoji = i <= 3 ? '😢' : i <= 6 ? '😐' : i <= 8 ? '😊' : '😄';
        const selected = planning.mood_min == i ? 'selected' : '';
        html += `<option value="${i}" ${selected}>${i} ${emoji}</option>`;
    }
    html += '</select>';
    html += '<select id="plan_mood_max" style="width: 100%;"><option value="">تا</option>';
    for (let i = 1; i <= 10; i++) {
        const emoji = i <= 3 ? '😢' : i <= 6 ? '😐' : i <= 8 ? '😊' : '😄';
        const selected = planning.mood_max == i ? 'selected' : '';
        html += `<option value="${i}" ${selected}>${i} ${emoji}</option>`;
    }
    html += '</select><div></div></div>';

    // Other metrics
    const metrics = [
        {key: 'calories', label: 'خوراک 🥪'},
        {key: 'water', label: 'آب 💧'},
        {key: 'sleep', label: 'خواب 🌛'},
        {key: 'alcohol', label: 'می 🍺'},
        {key: 'weight', label: 'سنگینی ⚖️'},
        {key: 'steps', label: 'گام 🚶'},
        {key: 'namaz', label: 'نماژ 🙏'}
    ];

    metrics.forEach(metric => {
        html += '<div style="display: grid; grid-template-columns: 200px 150px 150px 100px; gap: 10px; align-items: center; margin: 10px 0;">';
        html += `<label><strong>${metric.label}:</strong></label>`;
        html += `<input type="number" id="plan_${metric.key}_min" placeholder="از" value="${planning[metric.key + '_min'] || ''}" style="width: 100%;">`;
        html += `<input type="number" id="plan_${metric.key}_max" placeholder="تا" value="${planning[metric.key + '_max'] || ''}" style="width: 100%;">`;
        html += '<div></div></div>';
    });

    html += '</div>';

    // Activities
    html += '<div class="form-section"><h3>اندازه‌</h3>';

    ACTIVITIES.forEach(activity => {
        html += '<div style="display: grid; grid-template-columns: 200px 150px 150px 100px; gap: 10px; align-items: center; margin: 10px 0;">';
        html += `<label><strong>${activity}:</strong></label>`;

        html += `<select id="plan_${activity}_frequency" onchange="updatePlanningPercentages()" style="width: 100%;">`;
        const freqs = ['daily', 'weekly', 'monthly'];
        const labels = ['روزانه', 'هفتگی', 'ماهانه'];
        freqs.forEach((freq, idx) => {
            const selected = planning[activity + '_frequency'] === freq ? 'selected' : '';
            html += `<option value="${freq}" ${selected}>${labels[idx]}</option>`;
        });
        html += '</select>';

        html += `<input type="number" id="plan_${activity}_hours" placeholder="سات" step="0.25" min="0" value="${planning[activity + '_hours'] || ''}" oninput="updatePlanningPercentages()" style="width: 100%;">`;
        html += `<span class="percentage-display" id="pct_${activity}" style="font-weight: bold; color: #dc2626;"></span>`;
        html += '</div>';
    });

    html += '</div>';

    // Summary section
    html += '<div class="form-section" style="background: linear-gradient(145deg, #fef2f2, #fcd0d0); border: 3px solid #dc2626;">';
    html += '<h3>در سد ها</h3>';
    html += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">';

    html += '<div><h4 style="margin: 5px 0; color: #0e7490;">روزانه</h4>';
    html += '<p style="font-size: 1.5em; font-weight: bold; color: #dc2626; margin: 5px 0;"><span id="daily-total">0.00</span>%</p>';
    html += '<p style="font-size: 0.9em; color: #666; margin: 5px 0;"><span id="daily-hours">0</span> سات از 24</p></div>';

    html += '<div><h4 style="margin: 5px 0; color: #0e7490;">هفتگی</h4>';
    html += '<p style="font-size: 1.5em; font-weight: bold; color: #dc2626; margin: 5px 0;"><span id="weekly-total">0.00</span>%</p>';
    html += '<p style="font-size: 0.9em; color: #666; margin: 5px 0;"><span id="weekly-hours">0</span> سات از 168</p></div>';

    html += '<div><h4 style="margin: 5px 0; color: #0e7490;">ماهانه</h4>';
    html += '<p style="font-size: 1.5em; font-weight: bold; color: #dc2626; margin: 5px 0;"><span id="monthly-total">0.00</span>%</p>';
    html += '<p style="font-size: 0.9em; color: #666; margin: 5px 0;"><span id="monthly-hours">0</span> سات از 720</p></div>';

    html += '</div></div>';

    document.getElementById('planning-form').innerHTML = html;

    // Initialize percentages
    setTimeout(updatePlanningPercentages, 100);
}

// Update planning percentages
function updatePlanningPercentages() {
    let dailyHours = 0, weeklyHours = 0, monthlyHours = 0;

    ACTIVITIES.forEach(activity => {
        const freqSelect = document.getElementById(`plan_${activity}_frequency`);
        const hoursInput = document.getElementById(`plan_${activity}_hours`);
        const pctSpan = document.getElementById(`pct_${activity}`);

        if (!freqSelect || !hoursInput || !pctSpan) return;

        const frequency = freqSelect.value;
        const hours = parseFloat(hoursInput.value) || 0;

        if (!frequency || hours === 0) {
            pctSpan.textContent = '';
        } else {
            let totalHours = frequency === 'daily' ? 24 : frequency === 'weekly' ? 168 : 720;
            const percentage = ((hours / totalHours) * 100).toFixed(2);
            pctSpan.textContent = percentage + '%';
        }

        // Add to totals
        if (frequency === 'daily') dailyHours += hours;
        else if (frequency === 'weekly') weeklyHours += hours;
        else if (frequency === 'monthly') monthlyHours += hours;
    });

    // Update totals
    const dailyPct = ((dailyHours / 24) * 100).toFixed(2);
    const weeklyPct = ((weeklyHours / 168) * 100).toFixed(2);
    const monthlyPct = ((monthlyHours / 720) * 100).toFixed(2);

    const dailyTotalEl = document.getElementById('daily-total');
    const weeklyTotalEl = document.getElementById('weekly-total');
    const monthlyTotalEl = document.getElementById('monthly-total');

    if (dailyTotalEl) {
        dailyTotalEl.textContent = dailyPct;
        document.getElementById('daily-hours').textContent = dailyHours.toFixed(2);
    }
    if (weeklyTotalEl) {
        weeklyTotalEl.textContent = weeklyPct;
        document.getElementById('weekly-hours').textContent = weeklyHours.toFixed(2);
    }
    if (monthlyTotalEl) {
        monthlyTotalEl.textContent = monthlyPct;
        document.getElementById('monthly-hours').textContent = monthlyHours.toFixed(2);
    }
}

// Save planning
function savePlanning() {
    const planning = {};

    // Save mood
    const moodMin = document.getElementById('plan_mood_min').value;
    const moodMax = document.getElementById('plan_mood_max').value;
    if (moodMin) planning.mood_min = moodMin;
    if (moodMax) planning.mood_max = moodMax;

    // Save other metrics
    const metrics = ['calories', 'water', 'sleep', 'alcohol', 'weight', 'steps', 'namaz'];
    metrics.forEach(metric => {
        const minVal = document.getElementById(`plan_${metric}_min`).value;
        const maxVal = document.getElementById(`plan_${metric}_max`).value;
        if (minVal) planning[metric + '_min'] = minVal;
        if (maxVal) planning[metric + '_max'] = maxVal;
    });

    // Save activities
    ACTIVITIES.forEach(activity => {
        const freq = document.getElementById(`plan_${activity}_frequency`).value;
        const hours = document.getElementById(`plan_${activity}_hours`).value;
        if (freq) planning[activity + '_frequency'] = freq;
        if (hours) planning[activity + '_hours'] = hours;
    });

    savePlanningData(planning);
    alert('برنامه اندوخته شد! ✅');
}
