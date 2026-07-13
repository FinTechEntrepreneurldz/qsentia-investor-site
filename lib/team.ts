export type TeamRole = "CEO" | "Quantitative Research" | "Software Development";

export type TeamMember = {
  slug: string;
  fullName: string;
  designation: string;
  role: TeamRole;
  initials: string;
  summary: string;
  biography: string[];
  qualifications?: string;
  focus?: string;
  emailAddress?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "lucas-zarzeczny",
    fullName: "Lucas Zarzeczny",
    designation: "CEO",
    role: "CEO",
    initials: "LZ",
    summary:
      "Lucas leads QSentia's company strategy across investor relations, product direction, AI research priorities, and institutional partnerships.",
    biography: [
      "Lucas Zarzeczny is the CEO of QSentia. He leads the company's strategy across investor relations, product direction, research prioritization, and institutional partnerships.",
      "Lucas is pursuing a Doctorate of Engineering in Machine Learning and Artificial Intelligence at The George Washington University. His academic foundation also includes a Master's in Applied Data Science from Syracuse University and dual Bachelor's degrees in Energy, Business, Finance, and Economics from Penn State.",
      "His professional background spans leadership and strategic AI and data science initiatives across financial services, cloud infrastructure, consumer technology, and telecommunications organizations.",
      "At QSentia, Lucas focuses on building an investment infrastructure company that can serve investor diligence workflows and platform customers who need reliable model access, operational controls, and API-ready research systems.",
    ],
    qualifications:
      "Doctorate of Engineering in Machine Learning and Artificial Intelligence, The George Washington University. M.S. Applied Data Science, Syracuse University. Dual Bachelor's degrees in Energy, Business, Finance, and Economics, Penn State.",
    focus:
      "Firm strategy, investor relations, AI and data science strategy, product direction, model commercialization, and operating governance.",
    imageSrc: "/team/lucas-zarzeczny-v2.png",
    imageAlt: "Lucas Zarzeczny",
    imagePosition: "center 20%",
  },
  {
    slug: "anikesh-bhuvaneshwaram",
    fullName: "Anikesh Bhuvaneshwaram",
    designation: "Quantitative Research",
    role: "Quantitative Research",
    initials: "AB",
    summary:
      "Anikesh focuses on quantitative modelling, backtesting, risk management, and time series analysis for systematic investment workflows.",
    biography: [
      "Anikesh Bhuvaneshwaram works in quantitative research at QSentia. He focuses on quantitative modelling, backtesting, risk management, and time series analysis for systematic investment workflows.",
      "Before joining QSentia's research work, Anikesh built a technical foundation across software engineering and quantitative methods, including prior software engineering experience at VISA.",
      "Anikesh holds a Bachelor's in Computer Science from NUS and is pursuing a Master's in Financial Engineering from UCLA.",
    ],
    qualifications:
      "Bachelor's in Computer Science, NUS. Master's in Financial Engineering, UCLA.",
    focus: "Quantitative research, software engineering, and AI/ML engineering.",
    emailAddress: "b.anikesh@gmail.com",
    imageSrc: "/team/anikesh-bhuvaneshwaram.png",
    imageAlt: "Anikesh Bhuvaneshwaram",
    imagePosition: "center 36%",
  },
  {
    slug: "spencer-ozgur",
    fullName: "Spencer Ozgur",
    designation: "Quantitative Research",
    role: "Quantitative Research",
    initials: "SO",
    summary:
      "Spencer works across quantitative research, systematic investing, machine learning, stochastic modeling, and time series analysis.",
    biography: [
      "Spencer Ozgur works in quantitative research at QSentia and is an M.S. Financial Engineering student at Columbia University with interests in quantitative research, systematic investing, and machine learning.",
      "Spencer has experience in stochastic modeling, time series analysis, filtering methods, and quantitative strategy development through research projects in options, market microstructure, and optimal execution.",
      "Spencer holds a B.S. in Computer Science from Arizona State University and is expected to complete his M.S. Financial Engineering at Columbia University in December 2026.",
    ],
    qualifications:
      "M.S. Financial Engineering, Columbia University (expected Dec. 2026). B.S. Computer Science, Arizona State University (2024).",
    focus:
      "Python, quantitative research, machine learning, time series analysis, stochastic processes, statistical modeling, options, systematic investing, financial engineering, and data science.",
    emailAddress: "so2770@columbia.edu",
    imageSrc: "/team/spencer-ozgur.png",
    imageAlt: "Spencer Ozgur",
    imagePosition: "center 42%",
  },
  {
    slug: "janet-chen",
    fullName: "Janet Chen",
    designation: "Quantitative Research",
    role: "Quantitative Research",
    initials: "JC",
    summary:
      "Janet focuses on systematic investing, factor research, machine learning, and data-driven quantitative research for financial markets.",
    biography: [
      "Janet Chen is a quantitative researcher with strong interests in systematic investing, factor research, and machine learning.",
      "She focuses on quantitative research for financial markets, developing predictive factors and systematic investment strategies through data-driven analysis. Her work covers the full quantitative research process, from data engineering and feature construction to model development, factor validation, and backtesting.",
      "Janet has a strong technical foundation in quantitative finance, statistics, and machine learning. She has worked on equity factor research, quantitative modeling, and financial data analysis, and enjoys applying statistical methods and machine learning techniques to better understand market behavior and support systematic investment research.",
    ],
    qualifications: "Columbia University.",
    focus:
      "Systematic investing, factor research, machine learning, quantitative modeling, feature construction, factor validation, and backtesting.",
    emailAddress: "zc2874@columbia.edu",
    imageSrc: "/team/janet-chen.png",
    imageAlt: "Janet Chen",
    imagePosition: "center 34%",
  },
  {
    slug: "ananth-seshadri",
    fullName: "Ananth Seshadri",
    designation: "Quantitative Research",
    role: "Quantitative Research",
    initials: "AS",
    summary:
      "Ananth focuses on quantitative finance, financial analytics, Python, statistics, and data-driven investment research.",
    biography: [
      "Ananth Seshadri is a Managerial Economics student at the University of California, Davis, with interests in quantitative finance and financial analytics.",
      "He enjoys applying Python, statistics, and data analysis to solve investment and business problems, with recent projects focused on quantitative trading and financial modeling.",
      "At QSentia, Ananth is excited to contribute to AI-powered investment intelligence while continuing to develop expertise at the intersection of finance, technology, and data science.",
    ],
    qualifications:
      "Managerial Economics, University of California, Davis.",
    focus:
      "Quantitative finance, financial analytics, Python, statistics, data analysis, quantitative trading, and financial modeling.",
    emailAddress: "seshadri.ananth@gmail.com",
    imageSrc: "/team/ananth-seshadri.png",
    imageAlt: "Ananth Seshadri",
    imagePosition: "center 24%",
  },
  {
    slug: "ravi-shankar-prasad",
    fullName: "Ravi Shankar Prasad",
    designation: "Quantitative Researcher",
    role: "Quantitative Research",
    initials: "RP",
    summary:
      "Ravi brings deep experience in speech AI, NLP, biomedical signal processing, LLM systems, RAG architectures, and production-grade MLOps.",
    biography: [
      "Ravi Shankar Prasad is a strategic AI product leader and researcher with extensive experience architecting and delivering high-impact solutions across speech, biomedical signal processing, and natural language processing domains.",
      "He has built enterprise-grade conversational AI systems for BFSI and e-commerce use cases, using modern ASR, TTS, LLM, RAG, agentic workflow, and prompt-engineering architectures to turn complex requirements into production-ready systems.",
      "Ravi's technical background spans Python, database systems, model development, fine-tuning, quantization, CI/CD, versioning, cloud deployment, and end-to-end MLOps across AWS, GCP, and RunPod.",
      "His research background includes postdoctoral work at Idiap Research Institute, a PhD from IIIT Hyderabad focused on speech signal processing, and published work across Interspeech, ICASSP, Speech Communication, and Computer Speech & Language.",
    ],
    qualifications:
      "PhD in Speech Signal Processing, International Institute of Information Technology Hyderabad. B.Tech (Hons.) in Electronics and Communication Engineering, Gurukula Kangri University.",
    focus:
      "Speech AI, biomedical signal processing, NLP, LLM systems, RAG pipelines, agentic frameworks, MLOps, ASR, TTS, model fine-tuning, quantization, and cloud deployment.",
    emailAddress: "exptoipiplusone@gmail.com",
    imageSrc: "/team/ravi-shankar-prasad.png",
    imageAlt: "Ravi Shankar Prasad",
    imagePosition: "center 28%",
  },
  {
    slug: "debasish-mishra",
    fullName: "Debasish Mishra",
    designation: "Software Development",
    role: "Software Development",
    initials: "DM",
    summary:
      "Debasish works across full-stack development, systems programming, and cybersecurity-oriented platform implementation.",
    biography: [
      "Debasish Mishra is a full-stack developer and cybersecurity enthusiast with a Mathematics background and ongoing study in Data Science and Applications at IIT Madras.",
      "His expertise spans full-stack web development, systems programming, and network security, with hands-on experience across offensive and defensive security tooling.",
      "At QSentia, Debasish contributes to software development work across application implementation, platform workflow support, and product delivery for internal and customer-facing surfaces.",
    ],
    qualifications:
      "Bachelor's in Mathematics (Hons), Utkal University. Bachelor's in Data Science and Applications, IIT Madras (qualifier phase).",
    focus:
      "Full-stack web development, systems programming, network security, cybersecurity tooling, and platform implementation.",
    emailAddress: "devmytho@gmail.com",
    imageSrc: "/team/debashish-mishra-v2.png",
    imageAlt: "Debasish Mishra",
    imagePosition: "center 24%",
  },
  {
    slug: "nidhish-gautam",
    fullName: "Nidhish Gautam",
    designation: "Software Development",
    role: "Software Development",
    initials: "NG",
    summary:
      "Nidhish supports product implementation, system interfaces, and customer workflow readiness for QSentia.",
    biography: [
      "Nidhish Gautam contributes to QSentia's software development function across product implementation, system interfaces, and customer workflow readiness.",
      "His work supports the software layer needed for model access, operational dashboards, and platform delivery.",
    ],
    focus:
      "Product implementation, system interfaces, and software workflow delivery.",
  },
  {
    slug: "shlok-chauhan",
    fullName: "Shlok Pratap Chauhan",
    designation: "Software Development",
    role: "Software Development",
    initials: "SC",
    summary:
      "Shlok works across software development, machine learning, data science, research workflows, and QSentia's investor-facing product surfaces.",
    biography: [
      "Shlok Pratap Chauhan contributes to QSentia's software development and product execution across the public website, dashboard experience, customer workflows, and operational tooling.",
      "His work combines machine learning, data science, and software engineering, with experience across Python, C++, C#, SQL, HTML, CSS, .NET, MS SQL Server, Git, Scikit-learn, XGBoost, Pandas, and NumPy.",
      "Shlok's research work includes a student dropout prediction project using machine learning on large-scale behavioural learning analytics data, with Random Forest and XGBoost models presented at the Ignite Pune 2025 IEEE Conference.",
      "At QSentia, Shlok focuses on making the platform experience clearer for investors, customers, and internal operators as the company expands its model access, dashboard, and API workflow surfaces.",
    ],
    qualifications:
      "B.Sc. Computer Science, Somaiya School of Basic and Applied Sciences, Somaiya Vidyavihar University.",
    focus:
      "Machine learning, data science, software development, frontend implementation, dashboard workflows, customer portal experience, and product operations.",
    emailAddress: "shlokpratap.c@somaiya.edu",
    imageSrc: "/team/shlok-chauhan-v2.png",
    imageAlt: "Shlok Pratap Chauhan",
    imagePosition: "center 30%",
  },
  {
    slug: "priyansh-kumar",
    fullName: "Priyansh Kumar",
    designation: "Software Development",
    role: "Software Development",
    initials: "PK",
    summary:
      "Priyansh focuses on frontend architecture, cross-platform application development, performance optimization, and product-focused software delivery.",
    biography: [
      "Priyansh Kumar is a software developer with strong interests in cross-platform application development, algorithmic problem-solving, and business strategy.",
      "He focuses on frontend architecture and continuous performance optimization for mobile and web platforms, helping improve the product surfaces that customers and internal operators use to manage model access, workflows, and account operations.",
      "Priyansh has a strong technical foundation in competitive programming and product development. He has built and deployed complete cross-platform applications for iOS and Android, and he actively participates in regional engineering competitions, hackathons, problem-solving contests, and analysis competitions.",
    ],
    qualifications:
      "Bachelor of Technology, National Institute of Technology Jalandhar. Major: Information Technology.",
    focus:
      "Software engineering, Flutter, frontend development, C++, NodeJS, Python, competitive programming, application architecture, and business strategy analysis.",
    emailAddress: "pkd09052006@gmail.com",
    imageSrc: "/team/priyansh-kumar.png",
    imageAlt: "Priyansh Kumar",
    imagePosition: "center 24%",
  },
  {
    slug: "deepanshu-yadav",
    fullName: "Deepanshu Yadav",
    designation: "Software Development",
    role: "Software Development",
    initials: "DY",
    summary:
      "Deepanshu supports implementation, product workflows, platform delivery, and operational controls.",
    biography: [
      "Deepanshu Yadav contributes to QSentia's software development work across implementation support, product workflows, and platform delivery.",
      "His work supports the engineering processes behind customer dashboards, operational controls, and internal workflow surfaces.",
    ],
    focus:
      "Implementation support, product workflows, and platform delivery.",
  },
  {
  slug: "ashutosh-pathak",
  fullName: "Ashutosh Pathak",
  designation: "Software Development",
  role: "Software Development",
  initials: "AP",
  summary:
    "Ashutosh Pathak contributes to platform implementation, product support, and engineering delivery.",
  biography: [
    "Ashutosh Pathak contributes to QSentia's software development work across platform implementation, product support, and engineering delivery.",
    "His work supports the technical execution needed to maintain and improve QSentia's website, dashboard, and platform workflows.",
  ],
  qualifications:
    "B.E. in Computer Engineering (Expected 2028), University of Mumbai.",
  focus:
    "Platform implementation, product support, and engineering delivery.", // ← Keep ONLY this one
  emailAddress: "luckypathak527@gmail.com",
  imageSrc: "/team/Ashutosh_pathak1.png",
  imageAlt: "Ashutosh Pathak",
  imagePosition: "center 24%",
},
];

export function getTeamMember(slug: string) {
  return teamMembers.find((member) => member.slug === slug);
}
