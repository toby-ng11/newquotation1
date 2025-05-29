import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { FormErrorMessage } from '@/components/ui/form-error-message';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    type: z.string().min(1, 'Please select an architect type.'),
    class: z.string().max(1).optional(),
    company: z.string().optional(),
    rep: z.string().optional(),
    date: z.date().optional(),
});

export default function NewArchitectModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            type: '',
            class: '',
            company: '',
            rep: '',
            date: undefined,
        },
    });
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast.success(`Submitted: ${JSON.stringify(data, null, 2)}`);
        setIsOpen(false);
        reset();
    }

    React.useEffect(() => {
        const btn = document.getElementById('widget-btn-add-architect');
        if (btn) {
            btn.addEventListener('click', () => setIsOpen(true));
        }

        return () => {
            if (btn) {
                btn.removeEventListener('click', () => setIsOpen(true));
            }
        };
    }, []);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) reset();
            }}
        >
            <DialogContent className="sm:max-w-lg md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Architect</DialogTitle>
                    <DialogDescription> Fill in basic architect info. You may add addresses and specifiers later. </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="mt-4 grid grid-cols-3 gap-x-8 gap-y-4">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="input-base" />
                                        </FormControl>
                                        <FormErrorMessage message={errors.name?.message} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="input-base truncate">
                                                    <SelectValue placeholder="Select a architect" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Residential</SelectItem>
                                                <SelectItem value="2">Commercial</SelectItem>
                                                <SelectItem value="3">Industrial</SelectItem>
                                            </SelectContent>
                                            <FormErrorMessage message={errors.type?.message} />
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="input-base" />
                                        </FormControl>
                                        <FormErrorMessage message={errors.class?.message} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="input-base" />
                                        </FormControl>
                                        <FormErrorMessage message={errors.company?.message} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="rep"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Architect rep</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="input-base" />
                                        </FormControl>
                                        <FormErrorMessage message={errors.rep?.message} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'input-base w-full pl-3 text-left font-normal',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setCalendarOpen(false);
                                                    }}
                                                    disabled={(date) => date < new Date('1900-01-01')}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormErrorMessage message={errors.date?.message} />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button type="button" className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
