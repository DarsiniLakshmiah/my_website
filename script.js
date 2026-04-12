/* ============================================
   DARSINI LAKSHMIAH — PORTFOLIO SCRIPT
   ============================================ */

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
    toggleBackToTop();
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
allNavLinks.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    allNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

/* ===== TYPING ANIMATION ===== */
const titles = ['Data Scientist', 'ML Engineer', 'AI Developer', 'Data Analyst', 'LLM Builder'];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
    const current = titles[titleIndex];
    if (isDeleting) {
        typingEl.textContent = current.slice(0, charIndex--);
        if (charIndex < 0) { isDeleting = false; titleIndex = (titleIndex + 1) % titles.length; setTimeout(type, 500); return; }
        setTimeout(type, 60);
    } else {
        typingEl.textContent = current.slice(0, charIndex++);
        if (charIndex > current.length) { isDeleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 100);
    }
}
type();

/* ===== INTERSECTION OBSERVER — SCROLL ANIMATIONS ===== */
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

// Generic fade-in observer
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); } });
}, observerOpts);

document.querySelectorAll(
    '.project-card, .skill-category-card, .timeline-item, .viz-card, .cert-card'
).forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    fadeObserver.observe(el);
});

// Skill bar animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
            skillObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category-card').forEach(el => skillObserver.observe(el));

/* ===== CLICKABLE PROJECT CARDS ===== */
document.querySelectorAll('.project-card-inner').forEach(card => {
    const link = card.querySelector('.project-ext-links a');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
        if (e.target.closest('a')) return; // let actual link clicks pass through
        window.open(link.href, '_blank');
    });
});

/* ===== PROJECT FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach((card, i) => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('hidden', !show);
            if (show) {
                card.style.transitionDelay = `${(i % 6) * 0.06}s`;
                // Re-trigger visibility
                setTimeout(() => card.classList.add('visible'), 10);
            }
        });
    });
});

/* ===== BACK TO TOP ===== */
const backToTopBtn = document.getElementById('backToTop');
function toggleBackToTop() { backToTopBtn.classList.toggle('visible', window.scrollY > 500); }
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* ============================================
   CHATBOT — DARSI AI
   ============================================ */
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotOpenIcon = document.getElementById('chatbotOpenIcon');
const chatbotCloseIcon = document.getElementById('chatbotCloseIcon');
const quickReplies = document.getElementById('quickReplies');

let chatOpen = false;
let hasGreeted = false;

// Toggle chatbot
function toggleChat() {
    chatOpen = !chatOpen;
    chatbotWindow.classList.toggle('open', chatOpen);
    chatbotOpenIcon.style.display = chatOpen ? 'none' : '';
    chatbotCloseIcon.style.display = chatOpen ? '' : 'none';
    if (chatOpen && !hasGreeted) {
        hasGreeted = true;
        setTimeout(() => addBotMessage(getResponse('greeting')), 300);
    }
    if (chatOpen) chatbotInput.focus();
}

chatbotToggle.addEventListener('click', toggleChat);
chatbotClose.addEventListener('click', toggleChat);

// Quick replies
document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
        const msg = btn.dataset.msg;
        sendMessage(msg);
        quickReplies.style.display = 'none';
    });
});

// Send message
function sendMessage(text) {
    const msg = (text || chatbotInput.value).trim();
    if (!msg) return;
    addUserMessage(msg);
    chatbotInput.value = '';
    showTyping();
    const delay = 600 + Math.random() * 600;
    setTimeout(() => { removeTyping(); addBotMessage(getResponse(msg)); }, delay);
}

chatbotSend.addEventListener('click', () => sendMessage());
chatbotInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.textContent = text;
    chatbotMessages.appendChild(div);
    scrollToBottom();
}

function addBotMessage(html) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = html;
    chatbotMessages.appendChild(div);
    scrollToBottom();
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typingIndicator';
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatbotMessages.appendChild(div);
    scrollToBottom();
}

function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/* ===== CHATBOT KNOWLEDGE BASE ===== */
function getResponse(input) {
    const q = input.toLowerCase();

    // Greeting
    if (/^(hi|hello|hey|sup|howdy|yo|greetings)/i.test(q) || q === 'greeting') {
        return `👋 Hi there! I'm <strong>Darsh AI</strong>, Darsini's portfolio assistant.<br><br>
        I can help you learn about her <strong>projects</strong>, <strong>skills</strong>, <strong>experience</strong>, or how to <strong>contact her</strong>.<br>
        What would you like to know?`;
    }

    // About
    if (/about|who is|who are|introduce|background|journey|tell me/i.test(q)) {
        return `<strong>Darsini Lakshmiah</strong> is a Data Scientist & ML Engineer pursuing her <strong>M.S. in Data Science at George Washington University</strong> (graduating May 2026).<br><br>
        Her interest in data started with a Mathematics background, giving her a strong foundation in analytical thinking. She has since worked with real-world data at:<br>
        🟠 <strong>Amazon</strong> — BI Engineer Intern<br>
        🟣 <strong>AARP Services</strong> — Data Scientist Intern<br>
        🏦 <strong>NatWest Group</strong> — Senior Data Analyst<br><br>
        She specializes in:<br>
        🧠 Machine Learning & NLP<br>
        🤖 AI Agents & LLM-powered apps<br>
        📊 Data Visualization (Tableau, Power BI)<br>
        ☁️ Cloud (AWS, Databricks, Azure)<br><br>
        She's actively seeking Data Scientist roles to grow and contribute to innovative teams!`;
    }

    // All projects
    if (/all project|list project|what project|portfolio|built|made|created/i.test(q) && !/specific|interview|holiday|dock|sentiment|instacart|asthma|banking|abalone|stock|turbine|churn|breast|cancer|wildfire|terrorism/i.test(q)) {
        return `Here are Darsini's <strong>12 projects</strong> across 5 categories:<br><br>
        🤖 <strong>AI & LLM:</strong><br>
        &nbsp;&nbsp;• Interview Evaluation System<br>
        &nbsp;&nbsp;• Holiday Management Agent<br>
        &nbsp;&nbsp;• DOCKWISE-AI<br><br>
        💬 <strong>NLP:</strong><br>
        &nbsp;&nbsp;• SM Sentiment Analysis<br>
        &nbsp;&nbsp;• Banking IT ChatBot<br><br>
        🧠 <strong>Machine Learning:</strong><br>
        &nbsp;&nbsp;• Asthma Prediction, Bank Churn, Breast Cancer<br>
        &nbsp;&nbsp;• Turbine Power Curve, Abalone Age (R)<br><br>
        📈 <strong>Time Series:</strong> Stock Forecasting<br>
        📦 <strong>Data Analysis:</strong> Instacart Analysis<br><br>
        Use the filter buttons on the page to explore by category!`;
    }

    // Interview Evaluation System
    if (/interview/i.test(q)) {
        return `🎤 <strong>Interview Evaluation System</strong><br><br>
        An AI-powered interview coaching platform that:<br>
        • Simulates company-specific interviews<br>
        • Analyzes body language via webcam in real-time<br>
        • Provides performance feedback using <strong>GPT-4o</strong><br>
        • Built with <strong>Microsoft AutoGen</strong> multi-agent framework & FastAPI<br><br>
        <a href="https://github.com/DarsiniLakshmiah/Interview-evaluation-system" target="_blank">🔗 View on GitHub</a>`;
    }

    // Holiday Management Agent
    if (/holiday|travel|itinerar/i.test(q)) {
        return `✈️ <strong>Holiday Management Agent</strong><br><br>
        An autonomous multi-agent system that:<br>
        • Transforms casual travel descriptions into detailed itineraries<br>
        • Fact-checks addresses, hours, and pricing automatically<br>
        • Streams live updates using Server-Sent Events<br>
        • Built with <strong>AutoGen + GPT-4o + FastAPI</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Holiday-Management-Agent" target="_blank">🔗 View on GitHub</a>`;
    }

    // DOCKWISE-AI
    if (/dock|maritime|port|ship/i.test(q)) {
        return `🚢 <strong>DOCKWISE-AI</strong><br><br>
        A real-time maritime port intelligence dashboard that:<br>
        • Monitors US port congestion in real-time<br>
        • Predicts disruptions <strong>14–28 days ahead</strong><br>
        • Uses ARIMA, Prophet & XGBoost for forecasting<br>
        • Powered by <strong>LLaMA-3.3-70B via Groq API</strong><br>
        • React frontend + FastAPI backend<br><br>
        <a href="https://github.com/DarsiniLakshmiah/DOCKWISE-AI" target="_blank">🔗 View on GitHub</a>`;
    }

    // Sentiment Analysis
    if (/sentiment|social media|nlp group/i.test(q)) {
        return `💬 <strong>SM Sentiment Analysis</strong> (Group Project)<br><br>
        • Analyzes social media sentiment using NLP<br>
        • Understands public opinion trends<br>
        • Includes data collection, model training, and visual reporting<br>
        • Built with <strong>Python, Transformers, Pandas</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/SM-SENTIMENT-ANALYSIS-GROUP-PROJECT" target="_blank">🔗 View on GitHub</a>`;
    }

    // Instacart
    if (/instacart|grocery/i.test(q)) {
        return `🛒 <strong>Instacart Analysis</strong><br><br>
        Comprehensive EDA of grocery delivery data to uncover:<br>
        • Customer purchasing patterns<br>
        • Reorder tendencies and product affinities<br>
        • Peak ordering times and behavior trends<br>
        • Built with <strong>Python, Pandas, Matplotlib, Seaborn</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Instacart-Analysis" target="_blank">🔗 View on GitHub</a>`;
    }

    // Asthma
    if (/asthma|lung|respirat/i.test(q)) {
        return `🫁 <strong>Asthma Prediction ML</strong><br><br>
        • Benchmarks multiple ML models for asthma risk prediction<br>
        • Enables early disease detection from patient data<br>
        • Supports proactive healthcare intervention<br>
        • Built with <strong>Python, Scikit-learn, XGBoost, Pandas</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/AsthmaPrediction_MLModelsls" target="_blank">🔗 View on GitHub</a>`;
    }

    // Banking Chatbot
    if (/banking|bank.*chat|chatbot.*bank/i.test(q)) {
        return `🏦 <strong>Banking IT ChatBot</strong><br><br>
        An AWS-powered chatbot for IT banking support that:<br>
        • Trained on BANKING77 dataset (77 intents)<br>
        • Fully serverless architecture<br>
        • Uses <strong>AWS Lex, Lambda, DynamoDB, API Gateway, S3</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/BankingIT_ChatBot" target="_blank">🔗 View on GitHub</a>`;
    }

    // Abalone
    if (/abalone/i.test(q)) {
        return `🐚 <strong>Abalone Age Prediction (R)</strong><br><br>
        • Predicts abalone age from physical measurements<br>
        • Compares multiple regression techniques<br>
        • Rich visualizations with ggplot2<br>
        • Built with <strong>R, caret, ggplot2, dplyr</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Abalone_Age_Prediction_using_R" target="_blank">🔗 View on GitHub</a>`;
    }

    // Stock TimeSeries
    if (/stock|time.?series|forecast|arima/i.test(q)) {
        return `📈 <strong>Stock TimeSeries Analysis & Forecasting</strong><br><br>
        • Analyzes and forecasts Kotak Mahindra Bank stock prices<br>
        • Uses ARIMA/ARIMAX with engineered features<br>
        • Feature engineering: lagged values, rolling averages<br>
        • Built with <strong>Python, pmdarima, Pandas, NumPy</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Stock_TimeSeries_Analysis_Forecasting" target="_blank">🔗 View on GitHub</a>`;
    }

    // Turbine
    if (/turbine|wind|energy|power curve/i.test(q)) {
        return `💨 <strong>Turbine Power Curve Estimation</strong><br><br>
        • Estimates wind turbine power curves from meteorological data<br>
        • Applies regression and ML models<br>
        • Optimizes energy production predictions<br>
        • Built with <strong>Python, Scikit-learn, NumPy, Matplotlib</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Turbine_Power_Curve_Estimation" target="_blank">🔗 View on GitHub</a>`;
    }

    // Churn
    if (/churn|customer.*retain|attrition/i.test(q)) {
        return `🔄 <strong>Bank Customer Churn Prediction</strong><br><br>
        • Identifies at-risk bank customers from 10,000 records<br>
        • Uses 14 demographic and financial features<br>
        • Models: Logistic Regression, Decision Trees, Random Forest<br>
        • Built with <strong>Python, Scikit-learn, Pandas</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Bank-Customer-Churn-Prediction" target="_blank">🔗 View on GitHub</a>`;
    }

    // Breast Cancer
    if (/breast|cancer|medical|diagnos/i.test(q)) {
        return `🎗️ <strong>Breast Cancer Prediction</strong><br><br>
        • ML classification model for cancer detection<br>
        • Uses diagnostic measurements as features<br>
        • Benchmarks SVM, Logistic Regression, and more<br>
        • Built to assist medical diagnosis with high accuracy<br>
        • Tech: <strong>Python, Scikit-learn, SVM</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/Breast-Cancer-Prediction" target="_blank">🔗 View on GitHub</a>`;
    }

    // Wildfire
    if (/wildfire|california|fire/i.test(q)) {
        return `🔥 <strong>California Wildfire Analysis</strong><br><br>
        • Interactive Tableau dashboard on wildfire patterns<br>
        • Analyzes causes, geographic spread, and historical trends<br>
        • Geospatial visualization of fire incidents<br>
        • Built with <strong>Tableau</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/California_Wildfire_Analysis_Tableau" target="_blank">🔗 View on GitHub</a>`;
    }

    // Terrorism EDA
    if (/terrorism|terror|global/i.test(q)) {
        return `🌍 <strong>Global Terrorism EDA (R)</strong><br><br>
        • Exploratory data analysis of global terrorism patterns<br>
        • Rich statistical visualizations and trend analysis<br>
        • Built with <strong>R, ggplot2</strong><br><br>
        <a href="https://github.com/DarsiniLakshmiah/EDA_Global_Terrorism_in_R" target="_blank">🔗 View on GitHub</a>`;
    }

    // Skills
    if (/skill|tech|stack|tool|language|program|python|sql|pyspark|sas|tableau|power bi|aws|docker|pandas|numpy|scikit|ml|machine learn|langgraph|langchain|crewai|autogen|databricks|snowflake|airflow|dbt|mongodb/i.test(q)) {
        return `💻 <strong>Darsini's Tech Stack:</strong><br><br>
        <strong>Programming:</strong> Python · SQL · PySpark · R · SAS<br>
        <strong>ML & LLM:</strong> Scikit-learn · XGBoost · TensorFlow · PyTorch · AutoGen · LangGraph · LangChain · CrewAI<br>
        <strong>Data & Viz:</strong> Pandas · NumPy · Seaborn · Tableau · Power BI · QuickSight · Excel · A/B Testing<br>
        <strong>Cloud:</strong> AWS (Glue, Redshift, S3, Athena, Lambda, Bedrock) · GCP (BigQuery) · Databricks<br>
        <strong>Databases:</strong> Redshift · MySQL · MongoDB · Snowflake<br>
        <strong>DevOps & Tools:</strong> Git · Docker · Flask · Airflow · dbt · Jira · Confluence`;
    }

    // Experience
    if (/experience|work|job|company|career|profession|intern|employ|aarp|amazon|natwest|gwu|george washington/i.test(q)) {
        return `💼 <strong>Work Experience</strong><br><br>
        🟣 <strong>AARP Services Inc.</strong> — Data Scientist Intern (Sep 2025–Present)<br>
        &nbsp;&nbsp;Automated 30+ campaigns, built LightGBM recommender (+10% engagement), LLaMA analytics assistant (-50% turnaround)<br><br>
        🟠 <strong>Amazon</strong> — BI Engineer Intern (May–Aug 2025)<br>
        &nbsp;&nbsp;$200M grocery analytics platform, SageMaker propensity model, ETL pipelines reducing latency by ~20%<br><br>
        🔵 <strong>George Washington University</strong> — Graduate Assistant (Oct 2024–May 2025)<br>
        &nbsp;&nbsp;Taught NLP, built ArcGIS dashboards for NGOs<br><br>
        🏦 <strong>NatWest Group</strong> — Senior Data Analyst (Aug 2021–Jun 2024)<br>
        &nbsp;&nbsp;1.5M+ daily transactions, AML/fraud detection, A/B testing (+9% engagement)<br><br>
        🌱 <strong>Hamari Pahchan NGO</strong> — R&D Intern (Jun–Sep 2020)<br>
        &nbsp;&nbsp;Power BI dashboards, expanded outreach by 30%<br><br>
        <a href="DARSINI LAKSHMIA1.pdf" download>📄 Download full resume</a>`;
    }

    // Contact
    if (/contact|reach|email|connect|talk|hire|recruit/i.test(q)) {
        return `📬 <strong>How to Contact Darsini:</strong><br><br>
        📧 <strong>Email:</strong> <a href="mailto:darsinilakshmiah@gmail.com">darsinilakshmiah@gmail.com</a><br>
        🐙 <strong>GitHub:</strong> <a href="https://github.com/DarsiniLakshmiah" target="_blank">DarsiniLakshmiah</a><br>
        💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/darsini-lakshmiah/" target="_blank">darsini-lakshmiah</a><br>
        📊 <strong>Tableau:</strong> <a href="https://public.tableau.com/app/profile/darsini.lakshmiah/vizzes" target="_blank">Public Profile</a><br><br>
        She's open to data science roles, ML engineering positions, and research collaborations!`;
    }

    // GitHub
    if (/github|repo|repository|code|source/i.test(q)) {
        return `🐙 <strong>GitHub:</strong> <a href="https://github.com/DarsiniLakshmiah" target="_blank">github.com/DarsiniLakshmiah</a><br><br>
        All 12 projects are open-source and available there. Each project card on this page also links directly to its repo!`;
    }

    // LinkedIn
    if (/linkedin/i.test(q)) {
        return `💼 You can find Darsini's LinkedIn profile in the <strong>Contact section</strong> of this page.<br><br>
        She's actively looking for data science and ML engineering opportunities — feel free to connect!`;
    }

    // Tableau
    if (/tableau|dashboard|visualization|viz/i.test(q)) {
        return `📊 <strong>Tableau Public Profile:</strong><br>
        <a href="https://public.tableau.com/app/profile/darsini.lakshmiah/vizzes" target="_blank">View all her dashboards here</a><br><br>
        Featured viz projects:<br>
        🔥 California Wildfire Analysis (Tableau)<br>
        🌍 Global Terrorism EDA (R / ggplot2)<br><br>
        She also works with Power BI and Plotly for interactive data storytelling.`;
    }

    // Resume
    if (/resume|cv|curriculum|download/i.test(q)) {
        return `📄 You can download Darsini's resume directly from this portfolio!<br><br>
        Click the <strong>"Download Resume"</strong> button in the About section or Contact section.<br>
        Or use the <strong>"Resume"</strong> button in the navigation bar. 📥`;
    }

    // Certifications
    if (/certif|credential|course|certification|aws|azure|redhat|hackerrank|ibm|datacamp|sql cert/i.test(q)) {
        return `🏆 <strong>Certifications</strong><br><br>
        🔴 Red Hat System Administration I — <em>Red Hat, Oct 2025</em><br>
        ☁️ AWS Academy Cloud Foundations — <em>AWS, Sep 2025</em><br>
        🛢️ Advanced SQL Skill Badge — <em>HackerRank, Dec 2024</em><br>
        🔬 Data Science Professional Certificate — <em>IBM, Jun 2024</em><br>
        🧠 Supervised Learning with Scikit-learn — <em>DataCamp, May 2024</em><br>
        💠 Microsoft Azure Fundamentals — <em>DataCamp, Jun 2024</em><br>
        📊 Data Analytics 1: Foundation — <em>NASBA, May 2024</em><br>
        🔄 Agile Methodology — <em>NatWest Group, Jul 2023</em>`;
    }

    // Hire / job
    if (/hire|job|opportunity|role|position|open to work|available|looking for/i.test(q)) {
        return `✅ <strong>Yes, Darsini is open to opportunities!</strong><br><br>
        She's interested in roles such as:<br>
        • Data Scientist<br>
        • ML Engineer<br>
        • AI/LLM Developer<br>
        • Data Analyst<br><br>
        Reach out via the <strong>Contact section</strong> or connect on LinkedIn. She'd love to chat!`;
    }

    // Fun / Easter egg
    if (/fun fact|interesting|random|surprise/i.test(q)) {
        const facts = [
            `🎲 Fun fact: Darsini built a system that predicts US port congestion 28 days in advance using AI — that's pretty impressive for something that affects global shipping!`,
            `🤓 Fun fact: She's worked on projects spanning healthcare (cancer prediction), finance (stock forecasting), energy (wind turbines), and maritime intelligence. Talk about diverse!`,
            `💡 Fun fact: Her AI interview evaluator uses real-time facial analysis via webcam — it's like having an AI coach watching your body language during mock interviews!`
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }

    // Thank you
    if (/thank|thanks|cheers|appreciate|great|helpful/i.test(q)) {
        return `😊 You're welcome! Feel free to ask me anything else about Darsini's work.<br><br>
        Is there a specific <strong>project</strong>, <strong>skill</strong>, or <strong>way to contact her</strong> you'd like to know more about?`;
    }

    // Bye
    if (/bye|goodbye|see you|later|ciao/i.test(q)) {
        return `👋 Goodbye! Don't hesitate to come back if you have more questions.<br>
        Feel free to <strong>download Darsini's resume</strong> or <strong>reach out to her</strong> — she'd love to connect!`;
    }

    // Fallback
    return `🤔 I'm not sure about that, but I can tell you about Darsini's:<br><br>
    • <strong>Projects</strong> (try: "Tell me about DOCKWISE-AI")<br>
    • <strong>Skills</strong> (try: "What tech does she use?")<br>
    • <strong>Experience</strong> (try: "What's her work history?")<br>
    • <strong>Contact info</strong> (try: "How can I reach her?")<br>
    • <strong>Resume</strong> (try: "Where can I download her resume?")<br><br>
    What would you like to know?`;
}
