import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import {
  Menu,
  X,
  ArrowRight,
  FolderKanban,
  CheckSquare,
  Users,
  LayoutDashboard,
  Shield,
  Bell,
  FileBarChart,
  Boxes,
  Target,
  UserCheck,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import LogoMark from '../components/LogoMark';
import { COMPANY_INFO, CONTACT_INFO } from '../constants/contactInfo';

export default function About() {
  
  const valueCards = [
    {
      icon: Boxes,
      title: 'Centralized Management',
      description: 'Keep projects, tasks, teams, and important information in one place.',
    },
    {
      icon: UserCheck,
      title: 'Better Collaboration',
      description:
        'Help team members understand responsibilities, deadlines, and project progress.',
    },
    {
      icon: TrendingUp,
      title: 'Clear Progress',
      description:
        'Monitor project and task progress through an organized dashboard.',
    },
  ];

  const features = [
    { icon: FolderKanban, label: 'Project Management' },
    { icon: CheckSquare, label: 'Task Management' },
    { icon: Users, label: 'Team Management' },
    { icon: LayoutDashboard, label: 'Dashboard & Progress Tracking' },
    { icon: Shield, label: 'Role-Based Access Control' },
    { icon: Bell, label: 'Notifications' },
    { icon: FileBarChart, label: 'Reports and Monitoring' },
  ];

  const workflowSteps = [
    { label: 'Create Project', icon: FolderKanban },
    { label: 'Build Team', icon: Users },
    { label: 'Assign Tasks', icon: CheckSquare },
    { label: 'Track Progress', icon: TrendingUp },
    { label: 'Complete Work', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <PublicNavbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm text-[#2563EB] mb-6">
            <span>About TaskFlow</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
            Simple Project Management for Modern Teams
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {COMPANY_INFO.description}
          </p>
        </div>
      </section>

      {/* ── A. Why TaskFlow ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              Why TaskFlow?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              TaskFlow brings projects, tasks, teams, and progress management together in one
              organized workspace. It is designed to reduce scattered information across
              spreadsheets, messaging applications, emails, and separate documents.
            </p>
          </div>
        </div>
      </section>

      {/* ── B. Our Purpose — value cards ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            Built to Make Work More Organized
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueCards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#2563EB]" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── C. What TaskFlow Provides ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
            What TaskFlow Provides
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-gray-200 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#2563EB]" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── D. Simple Workflow ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            Simple Workflow
          </h2>
          <p className="text-gray-600 text-sm">Five steps to organized, productive teamwork.</p>
        </div>

        {/* Desktop: horizontal chain */}
        <div className="hidden lg:flex items-center justify-center gap-0">
          {workflowSteps.map(({ icon: Icon, label }, index) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center gap-3 px-4">
                <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center whitespace-nowrap">
                  {label}
                </span>
              </div>
              {index < workflowSteps.length - 1 && (
                <ChevronRight size={20} className="text-gray-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile/tablet: vertical list */}
        <div className="lg:hidden flex flex-col gap-3 max-w-sm mx-auto">
          {workflowSteps.map(({ icon: Icon, label }, index) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 w-full">
                <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className="w-px h-4 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── E. CTA ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-xl p-10 sm:p-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
            Ready to Organize Your Work?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Start managing your projects, tasks, and teams in one centralized workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <PublicFooter />
    </div>
  );
}
