import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { easeInOut, motion } from 'framer-motion';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (event) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = event
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <motion.text
            x={x}
            y={y}
            fill="black"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2, ease: easeInOut }}
            style={{ pointerEvents: 'none' }}
        >
            {Math.round(percent * 100) > 0 ? `${Math.round(percent * 100)}%` : ''}
        </motion.text>)
}

const CustomTooltip = (event, totalPoints) => {
    const { active, payload, label } = event
    if (active) {
        return (
            <div
                className="custom-tooltip"
                style={{
                    backgroundColor: "#ffff",
                    padding: "5px",
                    border: "1px solid #cccc",
                }}
            >
                <label>{`${payload[0].name} : ${Math.round((payload[0].value / totalPoints) * 100)}%`}</label>
            </div>
        );
    }
    return null;
}


export default class ChartPie extends PureComponent {

    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ outline: 'none' }} width={400} height={400}>
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                    <Pie
                        stroke={'white'}
                        strokeWidth={2}
                        data={this.props.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="points"
                        style={{ outline: 'none' }}
                    >
                        {this.props.data.map((result, i) => (
                            <Cell key={`Cell: ${i}`} fill={result.color} />
                        ))}
                    </Pie>
                    <Tooltip content={(event) => CustomTooltip(event, this.props.totalPoints)} />
                </PieChart>
            </ResponsiveContainer>
        );
    }
}
