export const SectionHeader = ({ title, onViewAll }: { title: string; onViewAll?: () => void }) => {
  return (
    <div className="flex justify-between mt-11 mb-7">
        <h2 className="text-secondary-300 font-semibold">{title}</h2>
        <button onClick={onViewAll} className="text-primary-500 font-semibold hover:cursor-pointer">View All</button>
    </div>
  )
}
