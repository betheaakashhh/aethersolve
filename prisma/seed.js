// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed Admin
  const hashedPassword = await bcrypt.hash('Admin@AetherSolve2024', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@aethersolve.com' },
    update: {},
    create: {
      email: 'admin@aethersolve.com',
      password: hashedPassword,
      name: 'AetherSolve Admin',
    },
  });

  // Seed Testimonials
  const testimonials = [
    {
      name: 'Rajesh Mehta',
      role: 'CTO',
      company: 'FinEdge Solutions',
      content: 'AetherSolve built our entire fintech platform from scratch. Their team understood our compliance requirements and delivered a solution that handles 50,000+ daily transactions seamlessly. Truly exceptional engineering.',
      badges: ['Fintech', 'Enterprise', 'Verified Client'],
      rating: 5,
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    },
    {
      name: 'Priya Sharma',
      role: 'Founder',
      company: 'EduPath Technologies',
      content: 'The LMS platform AetherSolve designed for us now serves 12,000 students. Their UI/UX expertise made learning genuinely enjoyable. Our student satisfaction scores jumped 40% after launch.',
      badges: ['EdTech', 'SaaS', 'Verified Client'],
      rating: 5,
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    },
    {
      name: 'Arjun Kapoor',
      role: 'Operations Director',
      company: 'LogiTrack India',
      content: 'Our ERP system built by AetherSolve reduced operational overhead by 60%. The real-time fleet tracking and warehouse modules are flawless. They are genuinely embedded in how we run our business now.',
      badges: ['Logistics', 'ERP', 'Verified Client'],
      rating: 5,
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
    },
    {
      name: 'Sneha Reddy',
      role: 'CEO',
      company: 'HealthFirst Clinics',
      content: 'HIPAA-compliant patient portal, telemedicine integration, and appointment systems — AetherSolve delivered everything on time. Their ongoing AMC keeps our systems running perfectly.',
      badges: ['HealthTech', 'Compliance', 'Verified Client'],
      rating: 5,
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
    },
    {
      name: 'Vikram Singh',
      role: 'Head of Digital',
      company: 'RetailPlus Chain',
      content: 'The e-commerce platform and loyalty app AetherSolve built drove a 3x increase in online revenue. Their AI-powered recommendation engine alone generated 28% more average order value.',
      badges: ['Retail', 'AI/ML', 'Verified Client'],
      rating: 5,
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    },
    {
      name: 'Anita Joshi',
      role: 'Product Manager',
      company: 'PropDeal Realty',
      content: 'Virtual tour platforms and broker CRM — AetherSolve understood real estate inside out. Our agents close deals 35% faster with the tools they built for us.',
      badges: ['Real Estate', 'CRM', 'Verified Client'],
      rating: 4,
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anita',
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // Seed Job Postings
  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'full-time',
      isInternship: false,
      description: 'Lead development of enterprise-grade web applications using React, Node.js, and cloud infrastructure. Work directly with clients to architect scalable solutions.',
      requirements: ['5+ years experience', 'React & Node.js expertise', 'Cloud platform experience (AWS/GCP)', 'Strong system design skills'],
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Hybrid',
      type: 'full-time',
      isInternship: false,
      description: 'Create stunning, user-centered designs for web and mobile applications. Collaborate with engineering and clients to transform ideas into exceptional products.',
      requirements: ['3+ years in product design', 'Proficiency in Figma', 'Strong portfolio required', 'Experience with design systems'],
      skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Adobe Creative Suite'],
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'full-time',
      isInternship: false,
      description: 'Build and deploy machine learning models and AI-powered features for client products. Work on LLM integrations, automation pipelines, and data analytics solutions.',
      requirements: ['3+ years ML/AI experience', 'Python & TensorFlow/PyTorch', 'LLM API integration experience', 'MLOps knowledge'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'FastAPI', 'MLflow'],
    },
    {
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'full-time',
      isInternship: false,
      description: 'Manage cloud infrastructure, CI/CD pipelines, and ensure high availability of client systems. Drive our managed hosting product.',
      requirements: ['4+ years DevOps experience', 'Kubernetes & Docker', 'Terraform/IaC expertise', 'Security hardening experience'],
      skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus'],
    },
    {
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'On-site',
      type: 'full-time',
      isInternship: false,
      description: 'Drive new client acquisition and manage strategic partnerships. Own the full sales cycle from prospecting to closing enterprise contracts.',
      requirements: ['5+ years B2B sales', 'IT services background preferred', 'Proven track record of closing enterprise deals'],
      skills: ['Sales Strategy', 'CRM', 'Negotiation', 'Proposal Writing', 'Client Management'],
    },
    {
      title: 'Software Engineering Intern',
      department: 'Engineering',
      location: 'Hybrid',
      type: 'internship',
      isInternship: true,
      description: 'Join our engineering team and contribute to real client projects. Learn from senior engineers while building production-grade features in a collaborative environment.',
      requirements: ['Currently pursuing B.Tech/MCA/BCA', 'Basic web development knowledge', 'Strong problem-solving aptitude', 'Available for 3-6 months'],
      skills: ['JavaScript', 'React or Node.js (basic)', 'HTML/CSS', 'Git'],
    },
    {
      title: 'UI/UX Design Intern',
      department: 'Design',
      location: 'Hybrid',
      type: 'internship',
      isInternship: true,
      description: 'Work alongside our design team on real client projects. Develop your design thinking and build a professional portfolio during your internship.',
      requirements: ['Pursuing design/CS degree', 'Basic Figma knowledge', 'Portfolio of personal projects', 'Available for 3-6 months'],
      skills: ['Figma', 'Wireframing', 'Basic UI Principles', 'Canva'],
    },
    {
      title: 'Digital Marketing Intern',
      department: 'Marketing',
      location: 'Remote',
      type: 'internship',
      isInternship: true,
      description: 'Support our marketing team with content creation, SEO, and social media campaigns for AetherSolve and client projects.',
      requirements: ['Pursuing MBA/Marketing degree', 'Passion for digital marketing', 'Strong writing skills', 'Available for 3-6 months'],
      skills: ['Content Writing', 'SEO Basics', 'Social Media', 'Google Analytics', 'Canva'],
    },
  ];

  for (const job of jobs) {
    await prisma.jobPosting.create({ data: job });
  }

  // Seed Announcements
  await prisma.announcement.create({
    data: {
      title: '🚀 New Service Launched',
      content: 'AetherSolve now offers AI & Automation Integration services — helping businesses automate workflows with LLM-powered tools.',
      link: '#services',
      linkText: 'Explore AI Services',
      isActive: true,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
