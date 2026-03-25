import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/hooks/use-dashboard';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const { users, loading, error } = useUsers();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Behavioral Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && users.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">No user profiles yet</p>
          )}
          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Logins</th>
                    <th className="py-3 px-2">Devices</th>
                    <th className="py-3 px-2">Locations</th>
                    <th className="py-3 px-2">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/app/users/${encodeURIComponent(u.user_id)}`)}>
                      <td className="py-3 px-2 font-medium">{u.user_id}</td>
                      <td className="py-3 px-2">{u.login_count}</td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {u.devices.slice(0, 2).map((d, j) => (
                            <Badge key={j} variant="outline" className="text-xs">{d.substring(0, 20)}</Badge>
                          ))}
                          {u.devices.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{u.devices.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">{u.locations.join(', ') || 'Unknown'}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">
                        {u.last_seen ? new Date(u.last_seen).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}