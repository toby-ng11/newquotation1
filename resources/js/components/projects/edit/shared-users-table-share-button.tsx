import { AutoCompleteInput } from '@/components/auto-complete';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityShare, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderCircle, Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

interface ShareButtonProps {
    endpoint: string;
    queryKey: (string | number | boolean)[];
    projectId: string;
}

export default function ShareProjectButton({ endpoint, queryKey, projectId }: ShareButtonProps) {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, processing, reset } = useForm<OpportunityShare>({
        id: '',
        shared_user: '',
        role: '',
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${endpoint}`, {
                project_id: projectId,
                shared_user: data.shared_user,
                role: data.role,
            });

            if (response.data.success) {
                await queryClient.invalidateQueries({ queryKey });
                toast.success(response.data.message);
                setIsDialogOpen(false);
                reset();
            } else {
                toast.error(`Error saving: ${response.data.message}`);
            }
        } catch (err) {
            toast.error(`Error saving: ${err}`);
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            reset();
        }
    };

    return (
        <div className="absolute top-4 right-4 z-10">
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                    <Button title="Add new market segment" variant="outline" className="size-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share</DialogTitle>
                        <DialogDescription>Share this opportunity with a user.</DialogDescription>
                    </DialogHeader>

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="shared_user">User ID</Label>
                                <AutoCompleteInput<User>
                                    fetchUrl="/api/users"
                                    placeholder="Search for a user..."
                                    minLength={2}
                                    queryParamName="pattern"
                                    limitParamName="limit"
                                    limit={10}
                                    renderItem={(item) => (
                                        <div className="flex flex-col">
                                            <strong>{item.name}</strong>
                                            <span className="text-muted-foreground text-sm">{item.name}</span>
                                        </div>
                                    )}
                                    inputId="shared_user"
                                    inputValue={data.shared_user}
                                    onInputValueChange={(val) => setData('shared_user', val)}
                                    onSelect={(item) => {
                                        setData('shared_user', item.id);
                                    }}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">New Role</Label>
                                <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder="Select a permission..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing || !data.shared_user?.trim() || !data.role?.trim()}>
                                Save
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
