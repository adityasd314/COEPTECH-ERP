"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Spinner } from "@/components/Spinner";
const yearOfStudy: [string, ...string[]] = ["FY", "SY", "TY", "BY"];
const semester: [string, ...string[]] = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
];
const formSchema = z.object({
    // yearOfStudy: z.enum(yearOfStudy),
    // semester: z.enum(semester),
    mis: z.string().min(9).max(9),
});

export function UserForm({ data, setData }: any) {
    // ...
    const [year, setYear] = useState("");
    const [sem, setSem] = useState("");
    const [MIS, setMIS] = useState("");
    const [loading, setLoading] = useState(false);
    const handleMISChange = (e: any) => {
        console.log(e);
        setMIS(e.target.value);
    };
    const handleSemesterChange = (value: string) => {
        setSem(value);
    };
    const handleYearChange = (value: string) => {
        setYear(value);
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const predictByMIS = function(mis: String){
        const possibleYearOfStudy = ["FY", "SY", "TY", "BY"];
        const year = 2023 - (2000+Number (mis.slice(2,4)));
        const isDSY = mis.indexOf("6423") != -1;
        console.log({year})
        console.log(possibleYearOfStudy[year])
        const semester = isDSY?3:(year * 2 + 1) // will change this later
        console.log({semester, yearOfStudy:(isDSY?possibleYearOfStudy[1]: possibleYearOfStudy[year])})
        return {semester, yearOfStudy:(isDSY?possibleYearOfStudy[1]: possibleYearOfStudy[year])};
    }
    function onSubmit(values: z.infer<typeof formSchema>) { 
        console.log("Asdf")
        console.log({ semester: sem, mis: MIS, yearOfStudy: year });
        const data = {...predictByMIS(MIS), mis: MIS};
        console.log(data)
        setLoading(true);
        axios
            .post("/api/data", data)
            .then((res) => {
                console.log(res);
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setData({ status: "error", result: {} });
                toast.error("Something went wrong");
                setLoading(false);
            });
        console.log(Object(values));
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* <FormField
                    control={form.control}
                    name="yearOfStudy"
                    defaultValue="FY"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year Of Study</FormLabel>
                            <FormControl>
                                <Select onValueChange={handleYearChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {yearOfStudy.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="semester"
                    defaultValue="I"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Semester</FormLabel>
                            <FormControl>
                                <Select onValueChange={handleSemesterChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {semester.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <FormField
                    control={form.control}
                    name="mis"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>MIS</FormLabel>
                            <FormControl>
                                <Input onInput={handleMISChange} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    {loading ? <Spinner /> : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
