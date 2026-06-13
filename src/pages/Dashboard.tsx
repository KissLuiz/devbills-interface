import { ArrowUp, CalendarIcon, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card, { CardEffect } from "../components/Card";
import MonthYearSelector from "../components/MonthYearSelector";
import {
  getTransactionMonthly,
  getTransactionSummary,
} from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import { formatCurrency } from "../utils/formaters";

const initialSummary: TransactionSummary = {
  totalExpenses: 0,
  totalIncome: 0,
  balance: 0,
  expensesByCategory: [],
};

interface ChartLabelProps {
  categoryName: string;
  percent: number;
}

const Dashboard = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionSummary() {
      const response = await getTransactionSummary(month, year);
      setSummary(response);

      console.log(response);
    }

    loadTransactionSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionMonthly() {
      const response = await getTransactionMonthly(month, year);

      console.log(response);
      setMonthlyItemsData(response.history);
    }

    loadTransactionMonthly();
  }, [month, year]);

  const renderPieChartLabel = ({
    categoryName,
    percent,
  }: ChartLabelProps): string => {
    return `${categoryName}: ${(percent * 100).toFixed(1)}%`;
  };

  const formatToolTipValue = (value: number | string): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard:</h1>
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          icon={
            <Wallet
              size={24}
              className={`${summary.balance >= 0 ? "text-green-500" : "text-red-600 "}`}
            />
          }
          title="Saldo"
          hover
          glowEffect={
            summary.balance >= 0 ? CardEffect.GLOWUP : CardEffect.GLOWDOWN
          }
        >
          <p
            className={`text-2xl font-semibold mt-2
        ${summary.balance >= 0 ? "text-green-500" : "text-red-600"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card
          icon={<ArrowUp size={24} className="text-green-500" />}
          title="Receitas"
          hover
          greencard
        >
          <p className={`text-2xl font-semibold mt-2 text-green-500`}>
            {formatCurrency(summary.totalIncome)}
          </p>
        </Card>

        <Card
          icon={<Wallet size={24} className={`text-red-600`} />}
          title="Despesas"
          hover
          redcard
        >
          <p className={`text-2xl font-semibold mt-2 text-red-600`}>
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por Categoria"
          className="min-h-80"
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer className="h-full w-full">
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChartLabel}
                  >
                    {summary.expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatToolTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>Nenhuma despesa registrada no período.</p>
            </div>
          )}
        </Card>
        <Card
          icon={<CalendarIcon size={24} className="text-primary-500" />}
          title="Histórico Mensal"
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    tick={{ style: { textTransform: "capitalize" } }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 14 } }}
                  />
                  <Tooltip
                    formatter={formatCurrency}
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      borderColor: "#2A2a2a",
                    }}
                    labelStyle={{
                      color: "#f8f8f8",
                      textTransform: "capitalize",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="expense" name="Despesas" fill="#FF6384"></Bar>
                  <Bar dataKey="income" name="Receitas" fill="#37E359"></Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Nenhuma despesa registrada no período.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
