import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityShare } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface RoleCellProps {
    endpoint: string;
    queryKey: (string | number | boolean)[];
    id: string;
    role: string;
}

export default function RoleCell({ endpoint, queryKey, id, role }: RoleCellProps) {
    const queryClient = useQueryClient();
    const updateRole = useMutation({
        mutationFn: async (data: OpportunityShare) => {
            return await axios
                .put(endpoint + '/' + data.id, {
                    role: data.role,
                })
                .then((response) => response.data);
        },
        onSuccess: async (data) => {
            if (data.success) {
                await queryClient.invalidateQueries({ queryKey });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });

    return (
        <Select
            value={role}
            onValueChange={(newRole) => {
                updateRole.mutate({
                    id: id,
                    role: newRole,
                });
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a permission..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
        </Select>
    );
}
