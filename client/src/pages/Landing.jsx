import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckSquare, 
  ArrowRight, 
  Users, 
  BarChart3, 
  Shield, 
  Bell, 
  LayoutDashboard, 
  Check,
  Calendar,
  Award,
  GraduationCap,
  Code,
  Database,
  FileText
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';

export default function Landing() {
  const features = [
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Track project progress automatically, set budgets, create milestones, and attach important files to keep everything organized.'
    },
    {
      icon: CheckSquare,
      title: 'Task Workflows',
      description: 'Break work down with 4-stage workflows, set dependencies, track time spent, and collaborate through real-time comments.'
    },
    {
      icon: Users,
      title: 'Team & Culture',
      description: 'Organize people by departments, track performance, and build team culture by sharing fun facts and superpowers.'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analytics',
      description: 'Visualize your team\'s workload, monitor task completion rates, and get a clear view of your entire organization\'s progress.'
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Keep your workspace organized with distinct permission levels tailored for Admins, Project Managers, and Team Members.'
    },
    {
      icon: Bell,
      title: 'Smart Onboarding',
      description: 'Enjoy a personalized experience with custom theme preferences, warm welcome messages, and time-based greetings.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Project',
      description: 'Set up your project and define its goals.'
    },
    {
      number: '02',
      title: 'Build Your Team',
      description: 'Assign team members and responsibilities.'
    },
    {
      number: '03',
      title: 'Organize Your Tasks',
      description: 'Create tasks, priorities, deadlines, and assignments.'
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor progress and keep your project moving.'
    }
  ];

  const benefits = [
    'Centralized project information',
    'Clear task ownership',
    'Real-time team collaboration',
    'Detailed budget tracking',
    'Built-in time tracking',
    'Data-driven performance insights'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 text-sm text-[#2563EB] dark:text-blue-400 mb-6">
              <span>Modern Project Management for Teams</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight">
              Manage Projects. Empower Teams. Track Performance.
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-8 max-w-xl">
              TaskFlow is a complete workspace that brings project management and human resources together. Manage tasks, coordinate departments, track leave requests, and conduct performance reviews all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              <a 
                href="#features" 
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 transition-colors flex items-center justify-center gap-2"
              >
                Explore Features
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600"></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-start shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mb-4">
                    <FolderKanban size={20} className="text-[#2563EB] dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-slate-400">Projects</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-start shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center mb-4">
                    <CheckSquare size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">29</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-slate-400">Tasks</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-start shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 flex items-center justify-center mb-4">
                    <Check size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-slate-400">Completed</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                      <Code size={16} className="text-[#2563EB] dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Frontend React Migration</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">In Progress</div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#2563EB] rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                      <Database size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Database Optimization</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">Completed</div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-green-50 dark:bg-green-900/200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">API Documentation Update</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">Pending Review</div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-amber-50 dark:bg-amber-900/200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Everything Your Team Needs in One Workspace</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FolderKanban size={24} className="text-[#2563EB] dark:text-blue-400" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">Projects</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckSquare size={24} className="text-green-600" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">Tasks</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users size={24} className="text-purple-600" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">HR & Teams</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-amber-600" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">Performance</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Powerful Tools for Better Project Management</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to manage projects, tasks, teams, and deadlines in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-gray-300 dark:border-slate-600 transition-colors">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-[#2563EB] dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{feature.description}</p>
                <a href="#" className="text-sm text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 flex items-center gap-1">
                  Learn more
                  <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Workspace Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">One Workspace. Complete Visibility.</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600"></div>
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">TaskFlow Dashboard</div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Website Redesign</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Status: Active</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">Priority: High</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Progress</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">72%</div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Tasks Completed</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">17/24</div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Deadline</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">Dec 15, 2026</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#2563EB] border-2 border-[#2563EB] rounded flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white line-through">Design landing page</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Completed by Jane Smith</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded text-xs">Completed</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#2563EB] border-2 border-[#2563EB] rounded flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white line-through">Database setup</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Completed by Mike Johnson</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded text-xs">Completed</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-slate-600 rounded"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Backend API integration</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Assigned to John Doe</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded text-xs">In Progress</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-slate-600 rounded"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Authentication</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Assigned to John Doe</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded text-xs">Todo</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-slate-600 rounded"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Testing</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Unassigned</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded text-xs">Todo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">How TaskFlow Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#2563EB] dark:text-blue-400 mb-4">{step.number}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Keep Everyone on the Same Page</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            TaskFlow gives teams a shared workspace where everyone can understand what needs to be done, who is responsible, and how the project is progressing.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-time Team Visibility</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#2563EB] dark:text-blue-400" />
                  </div>
                  <span className="text-gray-600 dark:text-slate-400">See exactly who is working on what task.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#2563EB] dark:text-blue-400" />
                  </div>
                  <span className="text-gray-600 dark:text-slate-400">Track project progress instantly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#2563EB] dark:text-blue-400" />
                  </div>
                  <span className="text-gray-600 dark:text-slate-400">Keep team activities organized.</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-[#2563EB] dark:text-blue-400 font-bold">A</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Abdellah</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">Project Manager</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold">TM</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Team Member</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">Frontend Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Access Designed Around Responsibilities</h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Secure your workspace with four standard roles tailored to your organization.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Super Admin</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Manages system-level access and administration.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Admin</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Manages users and organizational settings.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={24} className="text-[#2563EB] dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Project Manager</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Creates and manages projects, tasks, and teams.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Team Member</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">Works on assigned tasks and project activities.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Built for Organized Project Work</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Centralized Information',
            'Clear Task Ownership',
            'Better Team Coordination',
            'Project Visibility',
            'Organized Workflows',
            'Progress Monitoring'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-700 dark:text-slate-300">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About & Contact Section Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">About TaskFlow</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              TaskFlow is a web-based project management system designed to help teams organize projects, manage tasks, coordinate team members, and monitor progress from one centralized workspace.
            </p>
            <Link to="/about" className="text-[#2563EB] dark:text-blue-400 font-medium hover:text-[#1D4ED8] dark:hover:text-blue-300 flex items-center gap-1">
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Have Questions?</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Learn more about TaskFlow or get in touch with the project team.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 transition-colors">
                Contact Us
              </Link>
              <Link to="/register" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Ready to Organize Your Projects?</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Bring your projects, tasks, and teams together in one centralized workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 transition-colors flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
