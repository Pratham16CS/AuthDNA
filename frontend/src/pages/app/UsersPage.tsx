// src/pages/app/UsersPage.tsx
import { useUsers } from "@/hooks/use-dashboard";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UsersPage() {
  const { users, isLoading } = useUsers();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Behavioral Profiles</h2>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Logins</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.user_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/app/users/${encodeURIComponent(user.user_id)}`)}
                  >
                    <TableCell className="font-mono text-sm font-medium">{user.user_id}</TableCell>
                    <TableCell>{user.login_count}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.common_devices.slice(0, 2).map((d, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                        ))}
                        {user.common_devices.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{user.common_devices.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.common_locations.join(", ") || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.last_seen ? new Date(user.last_seen).toLocaleString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No user profiles yet. Profiles are created after login evaluations.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}