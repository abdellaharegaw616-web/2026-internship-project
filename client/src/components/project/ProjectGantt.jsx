import { useMemo } from 'react';
import { formatDate } from '../../utils/helpers';

const STATUS_COLORS = {
  Todo: '#94A3B8',
  'In Progress': '#2563EB',
  Review: '#7C3AED',
  Done: '#22C55E',
};

function getTimelineRange(startDate, endDate, items) {
  const dates = [];
  if (startDate) dates.push(new Date(startDate));
  if (endDate) dates.push(new Date(endDate));
  items.forEach((item) => {
    if (item.start) dates.push(new Date(item.start));
    if (item.end) dates.push(new Date(item.end));
    if (item.dueDate) dates.push(new Date(item.dueDate));
  });
  if (dates.length === 0) {
    const now = new Date();
    return { start: now, end: new Date(now.getTime() + 30 * 86400000) };
  }
  const start = new Date(Math.min(...dates.map((d) => d.getTime())));
  const end = new Date(Math.max(...dates.map((d) => d.getTime())));
  start.setDate(start.getDate() - 2);
  end.setDate(end.getDate() + 2);
  return { start, end };
}

function pct(date, rangeStart, totalMs) {
  return Math.max(0, Math.min(100, ((new Date(date) - rangeStart) / totalMs) * 100));
}

export default function ProjectGantt({ project, tasks, milestones }) {
  const range = useMemo(
    () => getTimelineRange(project.startDate, project.endDate, [
      ...tasks.map((t) => ({ dueDate: t.dueDate })),
      ...(milestones || []).map((m) => ({ dueDate: m.dueDate })),
    ]),
    [project, tasks, milestones]
  );

  const totalMs = range.end - range.start;
  const weeks = Math.max(1, Math.ceil(totalMs / (7 * 86400000)));

  const weekLabels = useMemo(() => {
    const labels = [];
    for (let i = 0; i <= weeks; i++) {
      const d = new Date(range.start.getTime() + i * 7 * 86400000);
      labels.push(d);
    }
    return labels;
  }, [range, weeks]);

  const projectLeft = project.startDate ? pct(project.startDate, range.start, totalMs) : 0;
  const projectWidth = project.startDate && project.endDate
    ? Math.max(2, pct(project.endDate, range.start, totalMs) - projectLeft)
    : 20;

  const rows = [
    {
      label: project.title,
      type: 'project',
      left: projectLeft,
      width: projectWidth,
      color: '#2563EB',
    },
    ...(milestones || []).map((m) => ({
      label: m.title,
      type: 'milestone',
      left: m.dueDate ? pct(m.dueDate, range.start, totalMs) : 0,
      completed: m.completed,
    })),
    ...tasks.filter((t) => t.dueDate).map((t) => {
      const end = new Date(t.dueDate);
      const start = new Date(end);
      start.setDate(start.getDate() - 3);
      return {
        label: t.title,
        type: 'task',
        status: t.status,
        left: pct(start, range.start, totalMs),
        width: Math.max(2, pct(end, range.start, totalMs) - pct(start, range.start, totalMs)),
      };
    }),
  ];

  if (!project.startDate && !project.endDate && tasks.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        Set project start and end dates to view the timeline.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Week headers */}
        <div className="flex border-b border-slate-100 mb-2">
          <div className="w-44 flex-shrink-0" />
          <div className="flex-1 relative h-8">
            {weekLabels.map((d, i) => (
              <div
                key={i}
                className="absolute text-[10px] text-slate-400 top-1"
                style={{ left: `${(i / weeks) * 100}%` }}
              >
                {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-44 flex-shrink-0 text-xs text-slate-600 truncate pr-2" title={row.label}>
                {row.type === 'milestone' && (
                  <span className={`inline-block w-2 h-2 rotate-45 mr-1.5 ${row.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                )}
                {row.label}
              </div>
              <div className="flex-1 relative h-7 bg-slate-50 rounded-lg">
                {row.type === 'milestone' ? (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-2 ${row.completed ? 'bg-green-500 border-green-600' : 'bg-amber-400 border-amber-500'}`}
                    style={{ left: `calc(${row.left}% - 6px)` }}
                    title={row.label}
                  />
                ) : (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-4 rounded-md opacity-90"
                    style={{
                      left: `${row.left}%`,
                      width: `${row.width}%`,
                      backgroundColor: row.type === 'project' ? row.color : (STATUS_COLORS[row.status] || '#94A3B8'),
                    }}
                    title={row.label}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-4 h-2 rounded bg-blue-600" /> Project
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-2 h-2 rotate-45 bg-amber-400" /> Milestone
          </div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-4 h-2 rounded" style={{ backgroundColor: color }} /> {status}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-2 text-xs text-slate-400">
          <span>Start: {formatDate(project.startDate)}</span>
          <span>End: {formatDate(project.endDate)}</span>
        </div>
      </div>
    </div>
  );
}
