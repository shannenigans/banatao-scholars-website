"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: 'First name must be at least 2 characters'
    }).max(50),
    lastName: z.string().min(2, {
        message: 'Last name must be at least 2 characters'
    }).max(50),
    university: z.string().min(2).max(50),
    graduationYear: z.string().date(),
    major: z.string().min(2).max(50),
    bio: z.string().max(1000)
});

export function ProfileForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            university: '',
            major: '',
            graduationYear: '2010',
            bio: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    function onReset() {
        console.log('reset form')
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full basis-1/4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>University</FormLabel>
                                    <FormControl>
                                        <Input placeholder="UC Berkeley" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="graduationYear"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Graduation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="major"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Major</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Computer Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col w-full basis-3/4">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="I drink way too much coffee" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex gap-1 justify-end">
                    <Button type="submit">Save</Button>
                    <Button variant="outline" type="reset" onClick={onReset}>Cancel</Button>
                </div>
            </form>
        </Form>
    )
}