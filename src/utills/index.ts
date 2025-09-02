export const getRandomColors = (count: number): string[] => {
    const colors = [
        '#6366F1',
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#F97316',
        '#EF4444',
        '#EC4899',
        '#8B5CF6',
        '#14B8A6',
        '#D946EF',
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};
