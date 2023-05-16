import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";

const data = [
    {
        subject: "Math",
        A: 120,
        B: 110,
        fullMark: 150
    },
    {
        subject: "Chinese",
        A: 98,
        B: 130,
        fullMark: 150
    },
    {
        subject: "English",
        A: 86,
        B: 130,
        fullMark: 150
    },
    {
        subject: "Geography",
        A: 99,
        B: 100,
        fullMark: 150
    },
    {
        subject: "Physics",
        A: 85,
        B: 90,
        fullMark: 150
    },
    {
        subject: "History",
        A: 65,
        B: 85,
        fullMark: 150
    }
];

export default function ChartRadar(props) {
    const { data, max } = props

    return (
        <RadarChart
            cx={300}
            cy={250}
            outerRadius={120}
            width={600}
            height={600}
            data={data}
        >
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <Radar
                name="Mike"
                dataKey="points"
                stroke="#009fda"
                fill="#009fda"
                fillOpacity={0.6}
            />
        </RadarChart>
    )
}
