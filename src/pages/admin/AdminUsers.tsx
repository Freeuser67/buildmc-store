import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { UserPlus, Shield, User, Trash2, Crown, Hash, Edit, Save, X, Copy } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  full_name?: string;
}

const AdminUsers = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [newUserId, setNewUserId] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('admin');
  
  // Edit states
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role')
        .order('role', { ascending: true });

      if (rolesError) throw rolesError;

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name');

      const mergedUsers = rolesData?.map(role => {
        const profile = profilesData?.find(p => p.id === role.user_id);
        return {
          ...role,
          full_name: profile?.full_name || 'Unknown User'
        };
      }) || [];

      setUsers(mergedUsers);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserRole = async () => {
    if (!newUserId.trim()) {
      toast.error('Please enter a User ID');
      return;
    }

    try {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', newUserId.trim())
        .maybeSingle();

      if (existingRole) {
        toast.error('This user already has a role assigned');
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUserId.trim(),
          role: newUserRole
        });

      if (error) throw error;
      
      toast.success(`User role added successfully as ${newUserRole}`);
      setDialogOpen(false);
      setNewUserId('');
      setNewUserRole('admin');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add user role');
    }
  };

  const startEditing = (user: UserRole) => {
    setEditingId(user.id);
    setEditRole(user.role);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRole('user');
  };

  const saveEdit = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: editRole })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success(`Role updated to ${editRole}`);
      setEditingId(null);
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update role');
    }
  };

  const deleteUserRole = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('User role deleted');
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to delete user role');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('User ID copied to clipboard');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">Admin</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage user roles and permissions
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <UserPlus className="h-4 w-4" />
                Add New Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID (UUID)</Label>
                  <Input
                    id="userId"
                    placeholder="e.g., 9297fb06-bb85-4245-881c-21561bd900f5"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the user's UUID from the authentication system
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUserRole} onValueChange={(value: 'admin' | 'user') => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          Admin
                        </div>
                      </SelectItem>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          User
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUserRole} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save User Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current User Info */}
        {user && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Your User ID:</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{user.id}</code>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(user.id)} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy ID
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Admins</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Crown className="h-10 w-10 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-blue-500">
                    {users.filter(u => u.role === 'user').length}
                  </p>
                </div>
                <User className="h-10 w-10 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Roles</p>
                  <p className="text-3xl font-bold text-primary">
                    {users.length}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users with Roles</CardTitle>
            <CardDescription>
              Click edit to change roles, or add new admins with their User ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No users with roles found. Add your first admin above!
                </p>
              ) : (
                users.map((userRole) => (
                  <Card key={userRole.id} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            {getRoleIcon(userRole.role)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{userRole.full_name}</p>
                              {editingId === userRole.id ? (
                                <Select value={editRole} onValueChange={(value: 'admin' | 'user') => setEditRole(value)}>
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                getRoleBadge(userRole.role)
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Hash className="h-3 w-3" />
                              <code className="font-mono text-xs bg-muted px-1 rounded">{userRole.user_id}</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(userRole.user_id)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {editingId === userRole.id ? (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => saveEdit(userRole.user_id)}
                                className="gap-1"
                              >
                                <Save className="h-4 w-4" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                className="gap-1"
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(userRole)}
                                className="gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User Role?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will remove the role from this user. They will lose access to role-specific features.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteUserRole(userRole.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
