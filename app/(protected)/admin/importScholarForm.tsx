'use client'

import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { ALLOWED_FILE_TYPES } from "../../lib/utils";
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import XLSX from 'xlsx';
import { parseScholarData } from '../../lib/actions';
import { useToast } from '@/app/hooks/use-toast';

// Create a schema that works in both browser and server environments
const getFormSchema = () => {
    // Check if we're in a browser environment where FileList exists
    const isBrowser = typeof window !== 'undefined' && typeof FileList !== 'undefined';
    
    if (isBrowser) {
        return z.object({
            fileUpload: z.instanceof(FileList)
                .refine((list) => list.length > 0, "Select a file")
                .refine((list) => list.length <= 1, "You can only select one file at a time")
                .transform((list) => Array.from(list))
                .refine((files) => {
                    return files.every((file) => ALLOWED_FILE_TYPES.includes(file.type))
                },
                    { message: "Invalid file type. You can only upload .xslx and .csv." }
                )
        });
    } else {
        // Server-side or during static build: provide a dummy schema
        return z.object({
            fileUpload: z.any()
        });
    }
};

export default function ImportScholarForm() {
    // Use state to store the schema
    const [formSchema, setFormSchema] = React.useState<z.ZodType<any>>(z.object({ fileUpload: z.any() }));
    const [filesToUpload, setFilesToUpload] = React.useState<File[]>();
    const [formError, setFormError] = React.useState('');
    const { toast: errorToast } = useToast();
    
    // Initialize the form with a placeholder schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Update the schema once the component mounts in the browser
    React.useEffect(() => {
        setFormSchema(getFormSchema());
    }, []);

    React.useEffect(() => {
        if(formError) {
            errorToast({
                title: 'Error',
                variant: 'destructive',
                description: formError
            })
        }
    }, [formError])

    const onSubmit = async () => {
        try {
            if (filesToUpload && filesToUpload.length > 0) {
                const file = await filesToUpload[0].arrayBuffer();
                const scholarWorkbook = XLSX.read(file);
                const worksheet = scholarWorkbook.Sheets[scholarWorkbook.SheetNames[0]];
                const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1});
                await parseScholarData(rawData);

                form.reset();
            }
        } catch (ex) {
            console.log('Exception reading xlsx file', ex)
        }
       
    }

    const onReset = () => {
        form.reset();
        setFilesToUpload(undefined);
    }

    const validateFile = (ev: any) => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || typeof FileList === 'undefined') return;
        
        const files: FileList = ev.target.files;
        if (!files) return;

        const browserSchema = getFormSchema();
        const parsedFiles = browserSchema.safeParse({ fileUpload: files });
        if (parsedFiles.success) {
            setFilesToUpload(parsedFiles.data.fileUpload);
        } else {
            setFormError('Looks like there was something wrong with that file.');
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="fileUpload"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem className="my-2">
                            <FormLabel>Import scholar information</FormLabel>
                            <FormControl>
                                <Input type="file" {...rest} onChange={(ev) => {
                                    validateFile(ev);
                                    onChange(ev.target.files);
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex mt-4 gap-1 justify-end">
                    <Button type="submit">Upload file</Button>
                    <Button variant="outline" type="reset" onClick={onReset}>Cancel</Button>
                </div>
            </form>
        </Form>
    )
}