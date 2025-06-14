import { Card, CardContent } from "../components/ui/card";

interface StatusCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  bgColor: string;
  valueColor?: string;
}

export default function StatusCard({ 
  title, 
  value, 
  change, 
  icon, 
  bgColor, 
  valueColor = "text-neutral-800" 
}: StatusCardProps) {
  return (
    <Card className="status-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-500 text-sm font-medium">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            {change && (
              <div className="mt-4 flex items-center text-sm">
                <span className="text-secondary">{change.split(' ')[0]}</span>
                <span className="text-neutral-500 ml-2">
                  {change.split(' ').slice(1).join(' ')}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
