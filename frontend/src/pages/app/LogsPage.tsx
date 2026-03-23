// src/pages/app/LogsPage.tsx
import { useState } from "react";
import { useLogs } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LogsPage() {
  const [limit, setLimit] = useState(50);
  const [filterUser, setFilterUser] = useState("");
  const { logs, isLoading, refetch } = useLogs({
    limit,
    userId: filterUser || undefined,
  });

  const decisionVariant = (d: string): "default" | "secondary" | "destructive" | "outline" => {
    if (d === "ALLOW") return "default";
    if (d === "BLOCK") return "destructive";
    if (d === "OTP") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Login Evaluation Logs</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Filter by user..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-64"
            onKeyDown={(e) => e.key === "Enter" && refetch()}
          />
          <Select value={limit.toString()} onValueChange={(v) => { setLimit(parseInt(v)); }}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead className="hidden lg:table-cell">Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.user_id}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>{log.country || "—"}</TableCell>
                    <TableCell className="font-mono font-bold">{log.score}</TableCell>
                    <TableCell>
                      <Badge variant={decisionVariant(log.decision)}>{log.decision}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-xs truncate">
                      {log.explanation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-12">No logs found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}