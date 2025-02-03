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
import { addProfile, updateScholar, uploadFileToBucket } from '@/app/lib/actions';
import { createBrowserClient } from '@/app/utils/supabase/client';
import { Scholar } from '@/app/types/scholar';
import { SCHOLAR_STATUS } from '@/app/lib/utils';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useToast } from '@/app/hooks/use-toast';
import { useUser } from '@/app/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 20000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    first: z.string().min(2, {
        message: 'First name must be at least 2 characters'
    }).max(50),
    last: z.string().min(2, {
        message: 'Last name must be at least 2 characters'
    }).max(50),
    email: z.string().max(50).optional(),
    school: z.string().max(50).optional(),
    currentCity: z.string().min(2).max(50),
    currentState: z.string().min(2).optional(),
    major: z.string().min(2).max(50).optional(),
    bio: z.string().max(1000).optional(),
    company: z.string().max(50),
    description: z.string().max(50).optional(),
    cellPhone: z.string().max(13).optional(),
    profilePic: z.any().refine((file) => {
        if (file && file.length > 0)
            return file[0].size <= MAX_FILE_SIZE
    }, 'Max image size is 2MB').refine((file) => {
        if (file.length > 0)
            return ACCEPTED_IMAGE_TYPES.includes(file[0].type)
    }, "Please upload .jpg, .jpeg, and .png formats only.").optional(),
});

const enum SECTION {
    ROLE = 'Role',
    GRAD = 'Grad',
    UNDERGRAD = 'UNDERGRAD'
}

const initialUserInfoState: Scholar = {
    id: 0,
    email: '',
    first: '',
    last: '',
    description: '',
    status: SCHOLAR_STATUS.GRADUATED,
    year: '',
    school: '',
    currentCity: '',
    currentState: ''
}

export function ProfileForm() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [preview, setPreview] = React.useState('');
    const [userInfo, setUserInfo] = React.useState<Scholar>(initialUserInfoState);
    const [response, setResponse] = React.useState<PostgrestSingleResponse<any>| undefined>(undefined);
    const [isLoadingSubmission, setIsLoadingSubmission] = React.useState(false);
    const { toast } = useToast();
    const userContext = useUser();
    const { supabaseResponseUser, scholarProfile } = userContext;
    const user = supabaseResponseUser?.user;

    React.useEffect(() => {
        if (scholarProfile) {
            setUserInfo(scholarProfile as Scholar);
            setPreview(scholarProfile.imageUrl ? `${scholarProfile?.imageUrl}?t=${new Date().getTime()}` :'');
        }
        setIsLoading(false);
    }, [user]);

    React.useEffect(() => {
        if (response) {
            const { statusText, error} = response;
            toast({
                variant: error ? 'destructive' : 'default',
                description: error ? statusText : 'Updated profile'
            });
        }
    }, [response])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            first: userInfo ? userInfo.first : '',
            last: userInfo ? userInfo.last : '',
            currentCity: userInfo ? userInfo.currentCity : '',
            currentState: userInfo ? userInfo.currentState : '',
            description: userInfo ? userInfo.description : '',
            company: userInfo ? userInfo.company : '',
            profilePic: userInfo ? userInfo.profilePic : '',
            school: userInfo ? userInfo.school : '',
            bio: userInfo ? userInfo.bio : '',
            major: userInfo ? userInfo.major : '',
            cellPhone: userInfo ? userInfo.cellPhone : '',
            email: userInfo ? userInfo.email : ''
        },
        defaultValues: {
            currentCity: '',
            currentState: ''
        }   
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();

        Object.entries(values).forEach((entry) => {
            const [key, val] = entry;

            if (key === 'profilePic' && val?.length > 0) {
                const file = val[0];
                formData.append('profilePic', file);
                formData.append('imageUrl', `https://hisjorhwwdqudqtqzidc.supabase.co/storage/v1/object/public/profile_pictures/${user.id}/profile.jpg`);
            } else {
                formData.append(key, val);
            }
        });

        if (formData.get('profilePic') && supabaseResponseUser?.user?.id) {
            await uploadFileToBucket(formData, supabaseResponseUser?.user.id);
        }

        let submitResponse;
        if (userInfo) {
            submitResponse = await updateScholar(userInfo.id, formData);
        } else {
            submitResponse = await addProfile(formData);
        }
        
        setResponse(submitResponse);
    }

    function onReset() {
        form.reset();
    }

    async function getPhotoInfo(ev: any) {
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
                {isLoading ? renderSkeleton() : renderFormContent()}
            </form>
        </Form>
    )

    function renderFormContent() {
        return (
            <><div className="flex flex-row gap-4">
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
                                <Input type="file" {...rest} onChange={async (ev) => {
                                    const { files, previewUrl } = await getPhotoInfo(ev);

                                    setPreview(previewUrl);
                                    onChange(files);
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="w-full basis-3/4">
                <div className='grid grid-cols-2 gap-3'><FormField
                    control={form.control}
                    name="first"
                    render={({ field }) => (
                        <FormItem className="my-2">
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input placeholder={userInfo?.first ?? 'Rey'} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                        control={form.control}
                        name="last"
                        render={({ field }) => (
                            <FormItem className="my-2">
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input placeholder={userInfo?.last ?? 'Banatao'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /></div>


                {renderSchoolInformation()}
                {renderCurrentInformation()}
                {renderContacts()}
                {renderBio()}
            </div>
        </div>
        <div className="flex mt-4 gap-1 justify-end">
            <Button type="submit">Save</Button>
            <Button variant="outline" type="reset" onClick={onReset}>Cancel</Button>
        </div></>
        )
    }
    function renderSchoolInformation() {
        return (
            <div className='mt-2'>
                <Label className='mt-2'>School Information</Label>
                <div className='grid grid-cols-2 gap-3'>
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
                        name="school"
                        render={({ field }) => (
                            <FormItem className="my-2">
                                <FormLabel>School</FormLabel>
                                <FormControl>
                                    <Input placeholder={userInfo?.school ?? 'UC Berkeley'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )
    }

    function renderCurrentInformation() {
        return (
            <div className='mt-2'>
                <Label className='mt-2'>Where are you now?</Label>
                <div className='grid grid-cols-4 gap-3'>
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
                        name="currentCity"
                        render={({ field }) => (
                            <FormItem className="my-2">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder={userInfo?.currentCity ?? 'San Francisco'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currentState"
                        render={({ field }) => (
                            <FormItem className="my-2">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder={userInfo?.currentState ?? 'CA'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )
    }

    function renderContacts() {
        return (
            <div className='mt-2'>
                <Label className='mt-2'>How can people contact you?</Label>
                <div className='grid grid-cols-2 gap-3'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="my-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder={userInfo?.email ?? "hello@gmail.com"} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cellPhone"
                        render={({ field }) => (
                            <FormItem className="my-2">
                                <FormLabel>Cell</FormLabel>
                                <FormControl>
                                    <Input placeholder={userInfo?.cellPhone ?? "(909) 333-2222"} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )
    }

    function renderBio() {
        return (
            <div className='mt-2'>
                <Label className='mt-2'>Tell people a little bit about you</Label>

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
        )
    }

    function renderSkeleton() {
        return (
          <div className="flex flex-col space-y-3 h-full">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        )
      }
}