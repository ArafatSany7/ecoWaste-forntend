"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

const mockBarData = [
  { name: "Plastic", total: Math.floor(Math.random() * 50) + 10 },
  { name: "Organic", total: Math.floor(Math.random() * 50) + 10 },
  { name: "E-Waste", total: Math.floor(Math.random() * 50) + 10 },
  { name: "Paper", total: Math.floor(Math.random() * 50) + 10 },
  { name: "Metal", total: Math.floor(Math.random() * 50) + 10 },
];

const mockAreaData = [
  { name: "Mon", requests: 12 },
  { name: "Tue", requests: 19 },
  { name: "Wed", requests: 15 },
  { name: "Thu", requests: 22 },
  { name: "Fri", requests: 30 },
  { name: "Sat", requests: 25 },
  { name: "Sun", requests: 18 },
];

export default function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4 shadow-soft">
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAreaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#10b981" fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3 shadow-soft">
        <CardHeader>
          <CardTitle>Waste By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBarData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
