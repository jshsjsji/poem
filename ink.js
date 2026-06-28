const CONFIG = {
    inkInterval: 1500,
    inkMinSize: 100,
    inkMaxSize: 40,
    clicksToReveal: 5,
    inkFallDuration: 8000,
};

const POEMS = [
    "落花人独立，微雨燕双飞",
    "明月松间照，清泉石上流",
    "采菊东篱下，悠然见南山",
    "行到水穷处，坐看云起时",
    "大江东去，浪淘尽，千古风流人物",
    "问君能有几多愁，恰似一江春水向东流",
    "此情可待成追忆，只是当时已惘然",
    "无边落木萧萧下，不尽长江滚滚来",
    "春风又绿江南岸，明月何时照我还",
    "会当凌绝顶，一览众山小",
    "衣带渐宽终不悔，为伊消得人憔悴",
    "人生若只如初见，何事秋风悲画扇",
];

let clickCount = 0;
let poemIndex = 0;
let inkTimer = null;
let isPageActive = true;

// ===== 页面可见性控制 =====
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面切出 → 暂停
        pauseInk();
    } else {
        // 页面切回 → 恢复
        resumeInk();
    }
});

function pauseInk() {
    isPageActive = false;
    if (inkTimer) {
        clearInterval(inkTimer);
        inkTimer = null;
    }
}

function resumeInk() {
    if (isPageActive) return;
    isPageActive = true;
    inkTimer = setInterval(createInk, CONFIG.inkInterval);
}

// ===== 创建墨水 =====
function createInk() {
    if (!isPageActive) return;

    const ink = document.createElement('div');
    ink.className = 'ink-drop';

    const size = CONFIG.inkMinSize + Math.random() * (CONFIG.inkMaxSize - CONFIG.inkMinSize);
    ink.style.width = size + 'px';
    ink.style.height = size + 'px';

    const side = Math.random() > 0.5 ? 'left' : 'right';
    if (side === 'left') {
        ink.style.left = Math.random() * 15 + 'vw';
    } else {
        ink.style.right = Math.random() * 15 + 'vw';
        ink.style.left = 'auto';
    }

    ink.style.top = '-' + (size + Math.random() * 100) + 'px';

    const duration = CONFIG.inkFallDuration + Math.random() * 3000;
    ink.style.animationDuration = duration + 'ms';

    ink.addEventListener('click', function(e) {
        e.stopPropagation();
        removeInk(ink, e.clientX, e.clientY);
    });

    document.body.appendChild(ink);

    ink.addEventListener('animationend', function() {
        if (!ink.classList.contains('removing')) {
            ink.remove();
        }
    });
}

// ===== 移除墨水 =====
function removeInk(ink, x, y) {
    ink.classList.add('removing');
    createRipple(x, y);
    setTimeout(() => ink.remove(), 600);
    clickCount++;
    updateCounter();
    if (clickCount >= CONFIG.clicksToReveal) {
        showPoem();
        clickCount = 0;
    }
}

// ===== 波纹 =====
function createRipple(x, y) {
    for (let i = 0; i < 3; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = (x - 20) + 'px';
        ripple.style.top = (y - 20) + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 2500);
    }
}

// ===== 更新计数器（大写汉语数字）=====
function updateCounter() {
    const counter = document.getElementById('clickCounter');
    const cn = toChineseNum(clickCount);
    const cnMax = toChineseNum(CONFIG.clicksToReveal);
    counter.textContent = cn + ' / ' + cnMax;
    counter.classList.add('show');
}

// ===== 显示诗句（完全随机）=====
function showPoem() {
    const overlay = document.getElementById('poemOverlay');
    // 从诗词库中随机选一句（不重复直到穷尽）
    const randomIndex = Math.floor(Math.random() * POEMS.length);
    overlay.textContent = POEMS[randomIndex];
    // 防止同一句连续出现
    if (randomIndex === poemIndex) {
        overlay.textContent = POEMS[(randomIndex + 1) % POEMS.length];
    }
    poemIndex = randomIndex;
    overlay.classList.add('show');
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 5000);
}

// ===== 启动 =====
inkTimer = setInterval(createInk, CONFIG.inkInterval);
for (let i = 0; i < 3; i++) {
    setTimeout(createInk, i * 500);
}