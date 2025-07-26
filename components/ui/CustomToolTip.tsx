export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { question, topic, score } = payload[0].payload
    return (
      <div className="rounded-xl border bg-white/90 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{question}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{topic}</p>
        <p className="font-bold text-indigo-600 dark:text-indigo-400">Score: {score}%</p>
      </div>
    )
  }
  return null
}