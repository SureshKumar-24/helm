'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Brain, 
  Coffee, 
  Cloud, 
  Smartphone, 
  Server, 
  Zap,
  MapPin,
  Calendar,
  Target,
  Mail,
  Linkedin,
  Github,
  Rocket,
  Lightbulb,
  Building,
  Globe,
  ChevronRight
} from 'lucide-react';
import { 
  SiReact, 
  SiNextdotjs, 
  SiPython, 
  SiTensorflow, 
  SiNodedotjs, 
  SiMongodb, 
  SiPostgresql,
  SiAngular,
  SiSpring,
  SiStripe,
  SiDocker,
  SiOpenai,
  SiMysql,
  SiExpress,
  SiFastapi,
  SiNestjs,
  SiRedis,
  SiAmazon,
  SiJenkins,
  SiRabbitmq,
  SiJsonwebtokens,
  SiHibernate,
  SiTwilio
} from 'react-icons/si';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const skillCategories = [
    {
      category: 'Backend & APIs',
      color: 'from-emerald-400 to-teal-400',
      iconColor: 'text-emerald-400',
      bgPattern: 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20',
      skills: [
        { name: 'Node.js', icon: <SiNodedotjs className="w-8 h-8" />, color: 'text-green-400', description: 'Server-side JavaScript runtime' },
        { name: 'Express.js', icon: <SiExpress className="w-8 h-8" />, color: 'text-gray-400', description: 'Fast web framework for Node.js' },
        { name: 'NestJS', icon: <SiNestjs className="w-8 h-8" />, color: 'text-red-400', description: 'Progressive Node.js framework' },
        { name: 'FastAPI', icon: <SiFastapi className="w-8 h-8" />, color: 'text-green-400', description: 'Modern Python web framework' },
      ],
    },
    {
      category: 'Frontend & Mobile',
      color: 'from-cyan-400 to-blue-400',
      iconColor: 'text-cyan-400',
      bgPattern: 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20',
      skills: [
        { name: 'React', icon: <SiReact className="w-8 h-8" />, color: 'text-cyan-400', description: 'Component-based UI library' },
        { name: 'Next.js', icon: <SiNextdotjs className="w-8 h-8" />, color: 'text-white', description: 'Full-stack React framework' },
        { name: 'Angular', icon: <SiAngular className="w-8 h-8" />, color: 'text-red-400', description: 'TypeScript-based framework' },
        { name: 'PWA', icon: <Smartphone className="w-8 h-8" />, color: 'text-purple-400', description: 'Progressive Web Applications' },
      ],
    },
    {
      category: 'AI & Machine Learning',
      color: 'from-purple-400 to-pink-400',
      iconColor: 'text-purple-400',
      bgPattern: 'bg-gradient-to-br from-purple-900/20 to-pink-900/20',
      skills: [
        { name: 'Python', icon: <SiPython className="w-8 h-8" />, color: 'text-yellow-400', description: 'AI/ML programming language' },
        { name: 'TensorFlow', icon: <SiTensorflow className="w-8 h-8" />, color: 'text-orange-400', description: 'Machine learning platform' },
        { name: 'OpenAI API', icon: <SiOpenai className="w-8 h-8" />, color: 'text-emerald-400', description: 'GPT models integration' },
        { name: 'LangChain', icon: <Brain className="w-8 h-8" />, color: 'text-blue-400', description: 'LLM application framework' },
      ],
    },
    {
      category: 'Database & Storage',
      color: 'from-amber-400 to-orange-400',
      iconColor: 'text-amber-400',
      bgPattern: 'bg-gradient-to-br from-amber-900/20 to-orange-900/20',
      skills: [
        { name: 'PostgreSQL', icon: <SiPostgresql className="w-8 h-8" />, color: 'text-blue-400', description: 'Advanced relational database' },
        { name: 'MongoDB', icon: <SiMongodb className="w-8 h-8" />, color: 'text-green-400', description: 'NoSQL document database' },
        { name: 'MySQL', icon: <SiMysql className="w-8 h-8" />, color: 'text-blue-400', description: 'Popular relational database' },
        { name: 'Redis', icon: <SiRedis className="w-8 h-8" />, color: 'text-red-400', description: 'In-memory data structure store' },
      ],
    },
    {
      category: 'DevOps & Cloud',
      color: 'from-blue-400 to-indigo-400',
      iconColor: 'text-blue-400',
      bgPattern: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20',
      skills: [
        { name: 'Docker', icon: <SiDocker className="w-8 h-8" />, color: 'text-blue-400', description: 'Containerization platform' },
        { name: 'AWS', icon: <SiAmazon className="w-8 h-8" />, color: 'text-orange-400', description: 'Amazon Web Services' },
        { name: 'CI/CD', icon: <Zap className="w-8 h-8" />, color: 'text-yellow-400', description: 'Continuous Integration/Deployment' },
        { name: 'Jenkins', icon: <SiJenkins className="w-8 h-8" />, color: 'text-blue-400', description: 'Automation server' },
      ],
    },
    {
      category: 'Enterprise & Tools',
      color: 'from-indigo-400 to-purple-400',
      iconColor: 'text-indigo-400',
      bgPattern: 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20',
      skills: [
        { name: 'Java', icon: <Coffee className="w-8 h-8" />, color: 'text-orange-400', description: 'Enterprise programming language' },
        { name: 'Spring Boot', icon: <SiSpring className="w-8 h-8" />, color: 'text-green-400', description: 'Java application framework' },
        { name: 'Stripe', icon: <SiStripe className="w-8 h-8" />, color: 'text-purple-400', description: 'Payment processing platform' },
        { name: 'WebSocket', icon: <Zap className="w-8 h-8" />, color: 'text-cyan-400', description: 'Real-time communication' },
      ],
    },
  ];

  const experiences = [
    {
      role: 'Software Engineer',
      company: 'DuckMa Srl',
      location: 'Rezzato, Italy',
      period: 'May 2024 - Present',
      description: 'Contributing to full-stack development of intelligent digital products including AI-powered mobile apps and IoT platforms.',
      achievements: [
        'Implementing machine learning models and AI integrations across healthtech, fintech, and IoT domains',
        'Leveraging modern CI/CD practices with Docker, AWS, and AI/ML deployment pipelines',
        'Developing Java-based microservices for backend systems with Spring Boot and PostgreSQL',
      ],
      icon: <Rocket className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      iconColor: 'text-emerald-400',
    },
    {
      role: 'Software Engineer',
      company: 'EnAct e-Services Pvt Ltd',
      location: 'India',
      period: 'Jan 2022 - May 2024',
      description: 'Engineered scalable backend architectures and AI-powered features for enhanced user experience.',
      achievements: [
        'Developed and optimized RESTful APIs using Node.js, Express.js, and NestJS',
        'Integrated secure payment gateways (Stripe) and third-party APIs (Twilio, Google, OpenAI)',
        'Automated deployment pipelines using Docker, Jenkins, and AWS, reducing deployment time',
      ],
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-400',
    },
  ];

  const projects = [
    {
      title: 'AI Content Optimizer',
      description: 'Intelligent content optimization platform integrating OpenAI GPT models for automated content generation. Achieved 35% improved engagement rates with custom ML models.',
      longDescription: 'Built a comprehensive AI-powered platform that analyzes content performance, generates optimized variations, and provides real-time insights. The system uses advanced NLP techniques and machine learning algorithms to understand audience preferences and create compelling content.',
      tech: [
        { name: 'Python', icon: <SiPython className="w-5 h-5" />, color: 'text-yellow-400' },
        { name: 'FastAPI', icon: <SiFastapi className="w-5 h-5" />, color: 'text-green-400' },
        { name: 'OpenAI API', icon: <SiOpenai className="w-5 h-5" />, color: 'text-emerald-400' },
        { name: 'TensorFlow', icon: <SiTensorflow className="w-5 h-5" />, color: 'text-orange-400' },
      ],
      category: 'AI/ML',
      gradient: 'from-purple-500 via-blue-500 to-cyan-500',
      bgPattern: 'bg-gradient-to-br from-purple-900/20 to-blue-900/20',
      size: 'large',
      metrics: { engagement: '+35%', accuracy: '94%', users: '10K+' },
    },
    {
      title: 'Smart Analytics Dashboard',
      description: 'AI-powered analytics dashboard enabling natural language querying and real-time data visualization. Leveraged LangChain and MCP for multi-turn conversation flows.',
      longDescription: 'Developed an intelligent dashboard that transforms complex data into actionable insights through natural language processing. Users can ask questions in plain English and receive comprehensive visualizations and reports.',
      tech: [
        { name: 'React', icon: <SiReact className="w-5 h-5" />, color: 'text-cyan-400' },
        { name: 'PostgreSQL', icon: <SiPostgresql className="w-5 h-5" />, color: 'text-blue-400' },
        { name: 'Python', icon: <SiPython className="w-5 h-5" />, color: 'text-yellow-400' },
      ],
      category: 'Analytics',
      gradient: 'from-emerald-500 to-teal-600',
      bgPattern: 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20',
      size: 'medium',
      metrics: { queries: '50K+', speed: '2.3s', accuracy: '96%' },
    },
    {
      title: 'TransactFlow',
      description: 'Real-time transaction management system with automated session handling. WebSocket for live balance updates and Bull MQ for efficient async processing.',
      longDescription: 'Built a robust financial transaction system handling thousands of concurrent users. Features real-time balance updates, automated reconciliation, and comprehensive audit trails.',
      tech: [
        { name: 'Node.js', icon: <SiNodedotjs className="w-5 h-5" />, color: 'text-green-400' },
        { name: 'React', icon: <SiReact className="w-5 h-5" />, color: 'text-cyan-400' },
        { name: 'MySQL', icon: <SiMysql className="w-5 h-5" />, color: 'text-blue-400' },
      ],
      category: 'FinTech',
      gradient: 'from-orange-500 to-red-600',
      bgPattern: 'bg-gradient-to-br from-orange-900/20 to-red-900/20',
      size: 'medium',
      metrics: { transactions: '1M+', uptime: '99.9%', users: '25K+' },
    },
    {
      title: 'GoCluggo',
      description: 'Progressive web application connecting artists and club managers with AI-powered recommendations and real-time chat system.',
      longDescription: 'Created a comprehensive platform for the entertainment industry, featuring intelligent matching algorithms, real-time communication, and event management tools.',
      tech: [
        { name: 'Angular', icon: <SiAngular className="w-5 h-5" />, color: 'text-red-400' },
        { name: 'MongoDB', icon: <SiMongodb className="w-5 h-5" />, color: 'text-green-400' },
      ],
      category: 'Social Platform',
      gradient: 'from-pink-500 to-rose-600',
      bgPattern: 'bg-gradient-to-br from-pink-900/20 to-rose-900/20',
      size: 'small',
      metrics: { matches: '5K+', events: '500+', satisfaction: '4.8/5' },
    },
    {
      title: 'Hotel-Zone Access Manager',
      description: 'Comprehensive hotel access management with zone-based control and role-based JWT authentication with real-time booking.',
      longDescription: 'Developed a sophisticated access control system for hospitality industry with dynamic permissions, audit trails, and integration with existing hotel management systems.',
      tech: [
        { name: 'Next.js', icon: <SiNextdotjs className="w-5 h-5" />, color: 'text-white' },
        { name: 'PostgreSQL', icon: <SiPostgresql className="w-5 h-5" />, color: 'text-blue-400' },
      ],
      category: 'Enterprise',
      gradient: 'from-blue-500 to-cyan-600',
      bgPattern: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20',
      size: 'small',
      metrics: { hotels: '50+', zones: '1K+', security: '100%' },
    },
    {
      title: 'Skill-Forge',
      description: 'Full-stack learning platform with individual, group, and subscription sessions. Secure Stripe payments and Docker containerization.',
      longDescription: 'Built a comprehensive e-learning platform with advanced course management, payment processing, and scalable infrastructure supporting thousands of concurrent learners.',
      tech: [
        { name: 'Express', icon: <SiExpress className="w-5 h-5" />, color: 'text-gray-400' },
        { name: 'Stripe', icon: <SiStripe className="w-5 h-5" />, color: 'text-purple-400' },
        { name: 'Docker', icon: <SiDocker className="w-5 h-5" />, color: 'text-blue-400' },
      ],
      category: 'EdTech',
      gradient: 'from-amber-500 to-yellow-600',
      bgPattern: 'bg-gradient-to-br from-amber-900/20 to-yellow-900/20',
      size: 'small',
      metrics: { students: '15K+', courses: '200+', revenue: '$50K+' },
    },
    {
      title: 'Enterprise HR Management',
      description: 'Complete HR platform with payroll automation, leave management, and onboarding workflows. Microservices architecture using Spring Boot.',
      longDescription: 'Designed and developed a full-featured HR management system with automated workflows, comprehensive reporting, and seamless integration with existing enterprise systems.',
      tech: [
        { name: 'Java', icon: <Coffee className="w-5 h-5" />, color: 'text-orange-400' },
        { name: 'Spring Boot', icon: <SiSpring className="w-5 h-5" />, color: 'text-green-400' },
        { name: 'Angular', icon: <SiAngular className="w-5 h-5" />, color: 'text-red-400' },
      ],
      category: 'Enterprise',
      gradient: 'from-indigo-500 to-purple-600',
      bgPattern: 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20',
      size: 'small',
      metrics: { employees: '5K+', efficiency: '+40%', satisfaction: '4.7/5' },
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="fixed top-0 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-[128px] opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="fixed bottom-0 -right-40 w-96 h-96 bg-amber-500 rounded-full blur-[128px] opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
          >
            &lt;SK /&gt;
          </motion.div>
          <div className="flex gap-8">
            {['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setActiveSection(item.toLowerCase())}
                className={`relative cursor-pointer transition-colors font-medium ${
                  activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                {activeSection === item.toLowerCase() && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400"
                  />
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          style={{ opacity, scale }}
          className="text-center z-10 max-w-5xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1.5, bounce: 0.5 }}
            className="mb-8"
          >
            <div className="w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 via-teal-500 to-amber-500 p-1 rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full rounded-3xl bg-slate-900 flex items-center justify-center text-7xl">
                👨‍💻
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <span className="text-cyan-400 font-mono text-lg">Hi, my name is</span>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-8xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent"
          >
            Suresh Kumar
          </motion.h1>

          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent"
          >
            I Build Intelligent Digital Solutions
          </motion.h2>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl max-w-3xl mx-auto mb-12 text-slate-400 leading-relaxed"
          >
            I&apos;m a software engineer specializing in <span className="text-cyan-400 font-semibold">full-stack development</span> and{' '}
            <span className="text-amber-400 font-semibold">AI-driven solutions</span>. Currently building innovative products at{' '}
            <span className="text-white font-semibold">DuckMa Srl, Italy</span>.
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-6 justify-center"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-cyan-500 rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-cyan-500/10 transition-colors"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-cyan-400 text-4xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-6xl font-bold mb-4 flex items-center justify-center gap-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">About Me</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
            >
              <div className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-16 h-16" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-emerald-400">Who I Am</h3>
              <p className="text-slate-300 leading-relaxed mb-4 text-lg">
                I&apos;m an innovative software engineer specializing in full-stack development and AI-driven solutions.
                With expertise spanning the <span className="text-amber-400 font-semibold">MERN stack</span>,{' '}
                <span className="text-emerald-400 font-semibold">AI/ML frameworks</span>, and microservices architecture,
                I&apos;ve successfully delivered scalable applications across healthtech, fintech, and IoT domains.
              </p>
              <p className="text-slate-300 leading-relaxed text-lg">
                Currently at <span className="text-white font-semibold">DuckMa Srl in Italy</span>, I&apos;m building intelligent
                digital products powered by cutting-edge technologies including TensorFlow, PyTorch, and OpenAI API.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-amber-500/50 transition-colors group"
            >
              <div className="text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-16 h-16" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-amber-400">What I Do</h3>
              <div className="space-y-4 text-lg">
                {[
                  { icon: <Zap className="w-6 h-6" />, text: 'Build scalable web applications with modern frameworks', color: 'text-yellow-400' },
                  { icon: <Brain className="w-6 h-6" />, text: 'Develop AI-powered features and ML models', color: 'text-purple-400' },
                  { icon: <Cloud className="w-6 h-6" />, text: 'Design cloud-native architectures and microservices', color: 'text-blue-400' },
                  { icon: <Target className="w-6 h-6" />, text: 'Optimize performance and automate workflows', color: 'text-green-400' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.05 }}
                    className="flex items-center gap-3 text-slate-300 cursor-pointer"
                  >
                    <span className={item.color}>{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative py-32 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-6xl font-bold mb-4 flex items-center justify-center gap-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Technical Skills</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.2 }}
                className="relative group"
              >
                <div className="backdrop-blur-xl bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all h-full">
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-slate-950 font-bold text-lg mb-6`}>
                    {category.category}
                  </div>
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIndex * 0.2 + skillIndex * 0.1 }}
                        whileHover={{ x: 10, scale: 1.05 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer group"
                      >
                        <span className={`${category.iconColor} group-hover:scale-110 transition-transform`}>{skill.icon}</span>
                        <span className="text-slate-200 font-medium text-lg group-hover:text-white transition-colors">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity -z-10`}></div>
              </motion.div>
            ))}
          </div>

          {/* Additional Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-slate-400 text-lg mb-6">Also experienced with</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'WebSocket', icon: <Zap className="w-5 h-5" />, color: 'text-cyan-400' },
                { name: 'RabbitMQ', icon: <SiRabbitmq className="w-5 h-5" />, color: 'text-orange-400' },
                { name: 'Bull MQ', icon: <Server className="w-5 h-5" />, color: 'text-red-400' },
                { name: 'JWT', icon: <SiJsonwebtokens className="w-5 h-5" />, color: 'text-purple-400' },
                { name: 'Twilio', icon: <SiTwilio className="w-5 h-5" />, color: 'text-red-400' },
                { name: 'Hibernate', icon: <SiHibernate className="w-5 h-5" />, color: 'text-amber-400' },
                { name: 'JPA', icon: <Database className="w-5 h-5" />, color: 'text-blue-400' },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer group"
                >
                  <span className={`${tech.color} group-hover:scale-110 transition-transform`}>
                    {tech.icon}
                  </span>
                  <span className="group-hover:text-white transition-colors">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section - Roadmap with Milestones */}
      <section id="experience" className="relative py-32 px-6 border-t border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-6xl font-bold mb-4 flex items-center justify-center gap-4">
              <span className="text-cyan-400 font-mono text-2xl">03.</span>
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Career Journey</span>
            </h2>
            <p className="text-slate-400 text-xl">My professional roadmap with key milestones</p>
          </motion.div>

          {/* Roadmap Container */}
          <div className="relative">
            {/* Road Background */}
            <div className="relative w-full h-96 mb-16">
              {/* Road Path - Curved SVG */}
              <svg
                viewBox="0 0 1200 400"
                className="w-full h-full absolute inset-0"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Road Background */}
                <path
                  d="M 50 350 Q 300 50 600 200 Q 900 350 1150 100"
                  stroke="url(#roadGradient)"
                  strokeWidth="60"
                  fill="none"
                  className="drop-shadow-lg"
                />
                {/* Road Center Line */}
                <path
                  d="M 50 350 Q 300 50 600 200 Q 900 350 1150 100"
                  stroke="#475569"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="20,15"
                  className="opacity-60"
                />
                
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="25%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="75%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Milestone Stops */}
              {experiences.map((exp, index) => {
                const positions = [
                  { x: '8%', y: '85%', rotation: '-15deg' }, // First milestone (May 2024, 💡)
                  { x: '92%', y: '20%', rotation: '15deg' }, // Second milestone (Jan 2022, 🏁)
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.5, type: 'spring', bounce: 0.6 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: positions[index].x,
                      top: positions[index].y,
                      transform: `translate(-50%, -50%) rotate(${positions[index].rotation})`,
                    }}
                  >
                    {/* Milestone Marker */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 0 }}
                      className="relative group cursor-pointer"
                    >
                      {/* Milestone Pin */}
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${exp.color} shadow-2xl flex items-center justify-center text-white border-4 border-white relative z-10`}>
                        {exp.icon}
                      </div>

                      {/* Pulsing Ring */}
                      <div className={`absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br ${exp.color} animate-ping opacity-20`}></div>

                      {/* Mile Marker Sign */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${exp.color} text-slate-950 font-bold text-sm whitespace-nowrap shadow-lg`}>
                          {exp.period.split(' - ')[0]}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Milestone Details Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3 + 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="backdrop-blur-xl bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden group"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  
                  <div className="relative z-10">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {exp.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`text-2xl font-bold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                            {exp.role}
                          </h3>
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${exp.color} text-slate-950 font-bold text-sm`}>
                            {exp.period}
                          </div>
                        </div>
                        <p className="text-xl text-white font-semibold">{exp.company}</p>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-400" /> {exp.location}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-lg mb-6 leading-relaxed">{exp.description}</p>
                    
                    {/* Key Achievements */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" /> Key Achievements
                      </h4>
                      {exp.achievements.map((achievement, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.3 + i * 0.1 + 0.7 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                          className="flex items-start gap-3 text-slate-300 cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                          <span className="text-base leading-relaxed">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity -z-10`}></div>
                </motion.div>
              ))}
            </div>

            {/* Journey Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { icon: <Calendar className="w-8 h-8" />, label: 'Years Experience', value: '3+', color: 'text-blue-400' },
                { icon: <Building className="w-8 h-8" />, label: 'Companies', value: '2', color: 'text-purple-400' },
                { icon: <Rocket className="w-8 h-8" />, label: 'Projects Built', value: '15+', color: 'text-emerald-400' },
                { icon: <Globe className="w-8 h-8" />, label: 'Countries', value: '2', color: 'text-amber-400' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center backdrop-blur-xl bg-slate-900/30 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 transition-all group"
                >
                  <div className={`${stat.color} mb-2 flex justify-center group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section - Enhanced Design */}
      <section id="projects" className="relative py-32 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto">
              Showcasing innovative solutions that make a real impact. Each project represents a unique challenge solved with cutting-edge technology.
            </p>
          </motion.div>

          {/* Project Categories Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {['All', 'AI/ML', 'FinTech', 'Enterprise', 'Social Platform', 'Analytics', 'EdTech'].map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  category === 'All' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  project.size === 'large' ? 'md:col-span-2 lg:col-span-2' : 
                  project.size === 'medium' ? 'md:col-span-1 lg:col-span-1' : 
                  'md:col-span-1'
                } group relative overflow-hidden`}
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="h-full backdrop-blur-xl bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Project Header with Gradient Background */}
                  <div className={`relative h-48 ${project.bgPattern} rounded-t-3xl overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`}></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Project Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${project.gradient} text-white shadow-lg`}>
                        {project.category}
                      </span>
                    </div>

                    {/* Project Icon/Visual */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                        <Code2 className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-8">
                    <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Project Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(project.metrics).map(([key, value], metricIndex) => (
                        <div key={metricIndex} className="text-center">
                          <div className={`text-lg font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                            {value}
                          </div>
                          <div className="text-xs text-slate-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.tech.map((tech, techIndex) => (
                        <motion.div
                          key={techIndex}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-all group/tech"
                        >
                          <span className={`${tech.color} group-hover/tech:scale-110 transition-transform`}>
                            {tech.icon}
                          </span>
                          <span className="text-sm text-slate-300 font-medium">{tech.name}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-3 px-4 bg-gradient-to-r ${project.gradient} rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-shadow`}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity -z-10`}></div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* View All Projects Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-semibold text-lg text-white shadow-lg hover:shadow-emerald-500/30 transition-shadow"
            >
              View All Projects
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-center mb-4">
              <span className="text-emerald-400 font-mono text-xl">Ready to collaborate?</span>
            </div>
            <h2 className="text-6xl font-bold mt-4 mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent text-center">
              Let&apos;s Build Something Amazing
            </h2>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <p className="text-slate-300 text-xl leading-relaxed">
                I&apos;m passionate about turning innovative ideas into reality. Whether you&apos;re a startup looking to build your MVP, 
                an enterprise seeking to modernize your systems, or have an exciting AI project in mind.
              </p>
              <p className="text-slate-400 text-lg">
                Let&apos;s discuss how we can work together to create something extraordinary.
              </p>
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { 
                icon: <Mail className="w-8 h-8" />, 
                label: 'Email', 
                text: 'sk20012404@gmail.com', 
                link: 'mailto:sk20012404@gmail.com', 
                color: 'text-red-400',
                description: 'Drop me a line anytime'
              },
              { 
                icon: <Linkedin className="w-8 h-8" />, 
                label: 'LinkedIn', 
                text: 'Let&apos;s Connect', 
                link: 'https://linkedin.com/in/sureshkumar', 
                color: 'text-blue-400',
                description: 'Professional networking'
              },
              { 
                icon: <Github className="w-8 h-8" />, 
                label: 'GitHub', 
                text: 'View My Code', 
                link: 'https://github.com/sureshkumar', 
                color: 'text-purple-400',
                description: 'Check out my projects'
              },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="backdrop-blur-xl bg-slate-900/50 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className={`${item.color} mb-4 flex justify-center group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className={`text-lg ${item.color} font-bold mb-2 text-center`}>{item.label}</div>
                  <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors text-center mb-2">
                    {item.description}
                  </div>
                  <div className="text-sm text-white font-medium text-center group-hover:text-emerald-400 transition-colors">
                    {item.text}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="mailto:sk20012404@gmail.com"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-semibold text-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow group"
              >
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Send Me an Email</span>
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-12 py-5 border-2 border-emerald-500 rounded-xl font-semibold text-xl backdrop-blur-sm hover:bg-emerald-500/10 transition-colors group"
              >
                <Lightbulb className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Schedule a Call</span>
              </motion.button>
            </div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl mx-auto backdrop-blur-xl bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-emerald-500/30 transition-all"
            >
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Quick Message
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-400 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-400 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Project Type</label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white transition-all">
                    <option value="">Select project type</option>
                    <option value="web-app">Web Application</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="ai-ml">AI/ML Project</option>
                    <option value="api">API Development</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-400 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow flex items-center justify-center gap-2 group"
                >
                  <span>Send Message</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>

            {/* Response Time Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                I typically respond within 24 hours
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-lg">
            Built with <span className="text-red-500">❤</span> using{' '}
            <span className="text-cyan-400 font-semibold">Next.js</span> &{' '}
            <span className="text-amber-400 font-semibold">Framer Motion</span>
          </p>
          <p className="text-slate-500 mt-2">© 2025 Suresh Kumar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
