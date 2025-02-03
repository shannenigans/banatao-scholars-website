'use client'

import React from 'react';
import { getMediaFromBucket } from '@/app/lib/actions';
import Image from "next/image";
import { Loader2 } from 'lucide-react';

type Media = {
    id: string,
    name: string,
    data: any[]
    error: any
}

const IGNORED_NAMES = ['.emptyFolderPlaceholder']

export default function GalleryPage() {
    const [mediaQuery, setMediaQuery] = React.useState<Media[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const getMedia = async () => {
            const mediaFromBucket = await getMediaFromBucket();
            setMediaQuery(mediaFromBucket.data)
            setIsLoading(false);
        }

        getMedia();
    }, [])

    return (
        <div className='flex w-full h-full items-center'>
            <div className='w-full p-6 flex gap-4' style={{ overflowX: 'scroll' }}>
                {
                    isLoading ? <div className='flex gap-2 justify-center w-full'><Loader2 className='animate-spin'/>Loading...</div>: mediaQuery.map((media: Media) => {
                        return (
                            !IGNORED_NAMES.includes(media.name) &&
                            <Image
                                src={`https://hisjorhwwdqudqtqzidc.supabase.co/storage/v1/object/public/media/retreat_2024/${media.name}`}
                                height={350}
                                width={250}
                                alt={`${media.name}`}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}