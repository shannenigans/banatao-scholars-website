"use client"

import React from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MAX_FILE_SIZE = 2000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: 'First name must be at least 2 characters'
    }).max(50),
    lastName: z.string().min(2, {
        message: 'Last name must be at least 2 characters'
    }).max(50),
    school: z.string().min(2).max(50),
    graduationYear: z.string().date(),
    major: z.string().min(2).max(50),
    bio: z.string().max(1000),
    profilePic: z.any().refine((file) => file.size <= MAX_FILE_SIZE, 'Max image size is 2MB').refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Please uplaod .jpg, .jpeg, and .png formats only.")
});

export function ProfileForm() {
    const [preview, setPreview] = React.useState('');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            school: '',
            major: '',
            graduationYear: '2010',
            bio: '',
            profilePic: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    function onReset() {
        console.log('reset form')
        form.reset();
    }

    function getPhotoInfo(ev: any) {
        const dataTransfer = new DataTransfer();
        const file = ev.target?.files ? ev.target?.files[0] : null;

        dataTransfer.items.add(file);
        const previewUrl = URL.createObjectURL(file);
        const files = dataTransfer.files;

        return {files, previewUrl};
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full basis-1/4">
                        <Avatar className='flex self-center w-40 h-40 mt-2'>
                            <AvatarImage src={preview} />
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                        <FormField
                            control={form.control}
                            name="profilePic"
                            render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Upload profile photo</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...rest} onChange={(ev) => {
                                            const {files, previewUrl} = getPhotoInfo(ev);
                                            
                                            setPreview(previewUrl);
                                            onChange(files);
                                        }}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col w-full basis-3/4">
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
                            name="school"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>School</FormLabel>
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
                <div className="flex mt-4 gap-1 justify-end">
                    <Button type="submit">Save</Button>
                    <Button variant="outline" type="reset" onClick={onReset}>Cancel</Button>
                </div>
            </form>
        </Form>
    )
}