"use client"

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/app/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Label } from '@/app/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { addProfile, updateProfile } from '@/app/lib/actions';
import { createBrowserClient } from '@/app/utils/supabase/client';
import { Scholar } from '@/app/types/scholar';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 20000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: 'First name must be at least 2 characters'
    }).max(50),
    lastName: z.string().min(2, {
        message: 'Last name must be at least 2 characters'
    }).max(50),
    undergrad: z.string().max(50).optional(),
    grad: z.string().max(50).optional(),
    undergradGraduationYear: z.number().optional(),
    gradGraduationYear: z.number().optional(),
    location: z.string().min(2).max(50).optional(),
    major: z.string().min(2).max(50).optional(),
    bio: z.string().max(1000).optional(),
    company: z.string().max(50).optional(),
    description: z.string().max(50).optional(),
    // TODO: Fix photo upload
    // profilePic: z.any().refine((file) => {
    //     if (file && file.length > 0)
    //     return file[0].size <= MAX_FILE_SIZE}, 'Max image size is 2MB').refine((file) => {
    // if (file.length > 0) 
    // return ACCEPTED_IMAGE_TYPES.includes(file[0].type)}, "Please upload .jpg, .jpeg, and .png formats only.")
});

const enum SECTION {
    ROLE = 'Role',
    GRAD = 'Grad',
    UNDERGRAD = 'UNDERGRAD'
}

const initialUserInfoState: Scholar = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    description: ''
}

export function ProfileForm() {
    const [preview, setPreview] = React.useState('');
    const [showRole, setShowRole] = React.useState(false);
    const [showGrad, setShowGrad] = React.useState(false);
    const [showUnderGrad, setShowUndergrad] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState<Scholar>(initialUserInfoState);

    React.useEffect(() => {
        const checkUser = async () => {
            const supabase = createBrowserClient();
            const { data, error } = await supabase.auth.getSession();
            if (!data.session || error) {
                
            }
            console.log('checkUser', data)
            const user = data.session?.user;

            const { data: scholarProfile } = await supabase.from('profile').select().eq('email', user?.email);
            if (scholarProfile) {
                setUserInfo(scholarProfile[0] as Scholar);
            }
        }

        checkUser();
    }, []);

    React.useEffect(() => {
        setShowGrad(!!userInfo?.grad || !!userInfo?.gradGraduationYear);
        setShowRole(!!userInfo?.description || !!userInfo?.company);
        setShowUndergrad(!!userInfo?.undergrad || !!userInfo?.undergradGraduationYear);
    }, [userInfo])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            firstName: userInfo ? userInfo.firstName : '',
            lastName: userInfo ? userInfo.lastName : '',
            location: userInfo ? userInfo.location  : '',
            description: userInfo ? userInfo.description : '',
            gradGraduationYear: userInfo ? userInfo.gradGraduationYear : undefined,
            undergradGraduationYear: userInfo ? userInfo.undergradGraduationYear : undefined,
            company: userInfo ? userInfo.company : undefined,
            // profilePic: userInfo.imageUrl || undefined,
            undergrad: userInfo ? userInfo.undergrad : undefined,
            bio: userInfo ? userInfo.bio : undefined,
            grad: userInfo ? userInfo.grad : undefined,
            major: userInfo ? userInfo.major : undefined
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (userInfo && values !== userInfo) {
            updateProfile(userInfo.id, values);
        } else {
            addProfile(values);
        }
    }

    function onReset() {
        form.reset();
        setPreview('');
    }

    function getPhotoInfo(ev: any) {
        const dataTransfer = new DataTransfer();
        const file = ev.target?.files ? ev.target?.files[0] : null;

        dataTransfer.items.add(file);
        const previewUrl = URL.createObjectURL(file);
        const files = dataTransfer.files;

        return { files, previewUrl };
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
                        {/* <FormField
                            control={form.control}
                            name="profilePic"
                            render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Upload profile photo</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...rest} onChange={(ev) => {
                                            const { files, previewUrl } = getPhotoInfo(ev);

                                            setPreview(previewUrl);
                                            onChange(files);
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} */}
                        {/* /> */}
                    </div>
                    <div className="flex flex-col w-full basis-3/4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder={userInfo?.firstName ?? 'Rey'} {...field} />
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
                                        <Input placeholder={userInfo?.lastName ?? 'Banatao'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showRole ? <div>
                            <Label>Current</Label>
                            <div className='grid grid-cols-3 gap-3'>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Role</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.description ?? 'Engineer'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Organization</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.company ?? 'CITRIS'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.location ?? 'San Francisco, CA'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                            :
                            renderAddButton(SECTION.ROLE)
                        }
                        {showUnderGrad ? <div>
                            <Label>Undergrad</Label>
                            <div className='grid grid-cols-3 gap-3'>
                                <FormField
                                    control={form.control}
                                    name="major"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Major</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.major ?? 'Computer Science'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="undergrad"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>School</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.undergrad ?? 'UC Berkeley'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="undergradGraduationYear"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Graduation</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.undergradGraduationYear?.toString() ?? '2024'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>
                            : renderAddButton(SECTION.UNDERGRAD)}
                        {showGrad ? <div>
                            <Label>Grad</Label>
                            <div className='grid grid-cols-3 gap-3'>
                                <FormField
                                    control={form.control}
                                    name="major"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Major</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.major ?? 'Computer science'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="grad"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>School</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.grad ?? 'Stanford'}{...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gradGraduationYear"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormLabel>Graduation</FormLabel>
                                            <FormControl>
                                                <Input placeholder={userInfo?.gradGraduationYear?.toString() ?? '2023'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>
                            :
                            renderAddButton(SECTION.GRAD)}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={userInfo?.bio ?? "I drink way too much coffee"} {...field} />
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

    function renderAddButton(section: SECTION) {
        let buttonString = '';
        let onClick;

        switch (section) {
            case SECTION.ROLE:
                buttonString = 'Add Current Role'
                onClick = () => setShowRole(true);
                break;
            case SECTION.GRAD:
                buttonString = 'Add Grad'
                onClick = () => setShowGrad(true);
                break;
            case SECTION.UNDERGRAD:
                buttonString = 'Add Undergrad'
                onClick = () => setShowUndergrad(true);
                break;
        }

        return (
            <Button onClick={onClick} variant='ghost'>
                <PlusCircle /> {buttonString}
            </Button>
        )
    }
}