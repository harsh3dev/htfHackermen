"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bounce, ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const formSchema = z.object({
  walletAddress: z.string().min(42, "Invalid wallet address").max(42),
  amount: z.string().min(1, "Amount is required"),
  network: z.string().min(1, "Please select a network"),
  date: z.string().min(1, "Date is required"),
});

export function ReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: "",
      amount: "",
      network: "",
      date: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Report submitted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        })
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-violet-400">Wallet Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x..."
                  className="bg-black/20 border-violet-800 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-violet-400">
                Scam Transaction Amount
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="0.00"
                  className="bg-black/20 border-violet-800 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-violet-400">Chain/Network</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-black/20 border-violet-800 text-white">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black border-violet-800">
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-violet-400">
                Date of Transaction
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="bg-black/20 border-violet-800 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-violet-700 hover:bg-violet-600 text-white"
        >
          Submit Report
        </Button>
      </form>
      <ToastContainer />
    </Form>
  );
}