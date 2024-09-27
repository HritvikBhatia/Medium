import { Circle } from "./BlogCard"

export const BlogSkeleton = () => {
    return <div>
            <div role="status" className="animate-pulse">
                
                    <div className="p-4 border-b border-slate-200 pb-4  w-screen max-w-screen-md">
                        <div className="flex">
                            <div className="h-4 w-4 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
                            
                            <div className="flex justify-center flex-col pl-2"> <Circle/> </div>
                            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
                        </div>
                        <div className="text-xl font-semibold">
                            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>

                        </div>
                        <div className="text-md font-thin">
                            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
                        </div>
                        <div className="text-sm font-thin text-slate-500 pt-4">
                            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
                        </div>
                    </div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
}