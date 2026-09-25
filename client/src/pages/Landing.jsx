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
      description: 'Create, organize, monitor, and manage projects from one workspace.'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Create tasks, assign team members, track priorities, deadlines, and status.'
    },
    {
      icon: Users,
      title: 'Team & Departments',
      description: 'Manage team members, roles, responsibilities, and organize your company into departments.'
    },
    {
      icon: Calendar,
      title: 'Leave Management',
      description: 'Easily track, approve, and manage employee time-off requests and leave balances.'
    },
    {
      icon: Award,
      title: 'Performance Reviews',
      description: 'Conduct and document employee performance reviews and structured feedback cycles.'
    },
    {
      icon: GraduationCap,
      title: 'Skills Tracking',
      description: 'Monitor employee skills and capabilities to build perfectly balanced project teams.'
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
    'Seamless leave management',
    'Performance tracking',
    'Skills directory',
    'Improved team productivity'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm text-[#2563EB] mb-6">
              <span>Modern Project Management for Teams</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
              Manage Projects. Empower Teams. Track Performance.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
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
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Explore Features
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Projects</div>
                  <div className="text-2xl font-semibold text-gray-900">4</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Tasks</div>
                  <div className="text-2xl font-semibold text-gray-900">29</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Completed</div>
                  <div className="text-2xl font-semibold text-gray-900">4</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code size={16} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Frontend React Migration</div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#2563EB] rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Database Optimization</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">API Documentation Update</div>
                      <div className="text-xs text-gray-500">Pending Review</div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-amber-500 rounded-full"></div>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Everything Your Team Needs in One Workspace</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FolderKanban size={24} className="text-[#2563EB]" />
            </div>
            <div className="font-medium text-gray-900">Projects</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckSquare size={24} className="text-green-600" />
            </div>
            <div className="font-medium text-gray-900">Tasks</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users size={24} className="text-purple-600" />
            </div>
            <div className="font-medium text-gray-900">HR & Teams</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-amber-600" />
            </div>
            <div className="font-medium text-gray-900">Performance</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Powerful Tools for Better Project Management</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage projects, tasks, teams, and deadlines in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <a href="#" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">
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
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">One Workspace. Complete Visibility.</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="text-sm text-gray-500">TaskFlow Dashboard</div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Website Redesign</h3>
                <p className="text-sm text-gray-500">Status: Active</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Priority: High</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Progress</div>
                <div className="text-2xl font-semibold text-gray-900">72%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Tasks Completed</div>
                <div className="text-2xl font-semibold text-gray-900">17/24</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Deadline</div>
                <div className="text-2xl font-semibold text-gray-900">Dec 15, 2026</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#2563EB] border-2 border-[#2563EB] rounded flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 line-through">Design landing page</div>
                    <div className="text-xs text-gray-500">Completed by Jane Smith</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Completed</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#2563EB] border-2 border-[#2563EB] rounded flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 line-through">Database setup</div>
                    <div className="text-xs text-gray-500">Completed by Mike Johnson</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Completed</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Backend API integration</div>
                    <div className="text-xs text-gray-500">Assigned to John Doe</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">In Progress</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Authentication</div>
                    <div className="text-xs text-gray-500">Assigned to John Doe</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Todo</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Testing</div>
                    <div className="text-xs text-gray-500">Unassigned</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Todo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">How TaskFlow Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#2563EB] mb-4">{step.number}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Keep Everyone on the Same Page</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            TaskFlow gives teams a shared workspace where everyone can understand what needs to be done, who is responsible, and how the project is progressing.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Team Visibility</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#2563EB]" />
                  </div>
                  <span className="text-gray-600">See exactly who is working on what task.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#2563EB]" />
                  </div>
                  <span className="text-gray-600">Track project progress instantly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#2563EB]" />
                  </div>
                  <span className="text-gray-600">Keep team activities organized.</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#2563EB] font-bold">A</div>
                <div>
                  <div className="font-medium text-gray-900">Abdellah</div>
                  <div className="text-xs text-gray-500">Project Manager</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">TM</div>
                <div>
                  <div className="font-medium text-gray-900">Team Member</div>
                  <div className="text-xs text-gray-500">Frontend Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Access Designed Around Responsibilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Secure your workspace with four standard roles tailored to your organization.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Super Admin</h3>
            <p className="text-sm text-gray-600">Manages system-level access and administration.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Admin</h3>
            <p className="text-sm text-gray-600">Manages users and organizational settings.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={24} className="text-[#2563EB]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Project Manager</h3>
            <p className="text-sm text-gray-600">Creates and manages projects, tasks, and teams.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Team Member</h3>
            <p className="text-sm text-gray-600">Works on assigned tasks and project activities.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Built for Organized Project Work</h2>
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
            <div key={index} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About & Contact Section Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About TaskFlow</h2>
            <p className="text-gray-600 mb-6">
              TaskFlow is a web-based project management system designed to help teams organize projects, manage tasks, coordinate team members, and monitor progress from one centralized workspace.
            </p>
            <Link to="/about" className="text-[#2563EB] font-medium hover:text-[#1D4ED8] flex items-center gap-1">
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              Learn more about TaskFlow or get in touch with the project team.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
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
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Ready to Organize Your Projects?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
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
              className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
