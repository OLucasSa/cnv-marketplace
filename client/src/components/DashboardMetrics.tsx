import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardMetrics() {
  const { data: stats, isLoading } = trpc.products.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-accent" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Total de Produtos",
      value: stats?.total || 0,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Produtos Ativos",
      value: stats?.active || 0,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Sem Estoque",
      value: stats?.outOfStock || 0,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
