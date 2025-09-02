import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'AAPL', value: 5000 },
    { name: 'GOOGL', value: 3000 },
    { name: 'AMZN', value: 2000 },
    { name: 'TSLA', value: 1000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Holdings = () => {
    return (
        <section className="bg-lightBlack p-6 rounded-xl">
            <div className="grid sm:grid-cols-2">
                <div className="left flex flex-col justify-between h-full">
                    <div>
                        <h3 className="text-[#A1A1AA]  font-medium capitalize mb-5">
                            portfolio total
                        </h3>
                        <h2 className="text-4xl font-medium">$10,275.08</h2>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">
                        Last updated: 3:42:12 PM
                    </p>
                </div>
                <div className="right min-h-[30vh]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-[#A1A1AA]  font-medium capitalize ">
                            portfolio total
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        paddingAngle={0}
                                    >
                                        {data.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Holdings;
