"use client"
import React, { useState, useEffect } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/components/ui/button";
import { getFlights, updateFlightStatus, updateStatus } from "@/lib/apiFunctions";
import StatusDropdown from "./StatusDropdown";
import Pusher from 'pusher-js';

export type FlightsColumns = {
    flightNumber: string
    origin: string
    destination: string
    scheduledTime: string
    status: string
    type: string
}
const FlightList = () => {
    const [loading, setLoading] = useState(false);
    const [flights, setFlights] = useState([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [filterText, setFilterText] = useState("");
    const [status, setStatus] = useState([]);
    const userInfo = localStorage.getItem('user');
    const parsedUserInfo = userInfo && JSON.parse(userInfo);

    const handleGenerateFlights = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/generate-flights', { method: 'POST' });
          const data = await response.json();
          console.log("data", data);          
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || '',
        });
    
        const channel = pusher.subscribe('flight-status-channel');
        
        channel.bind('status-update', (data: any) => {
          console.log('Flight Status Update:', data);
          setFlights((prevStatus: any) => {
            const updatedStatus = prevStatus.map((flight: any) => 
              flight._id === data._id ? { ...flight, status: data.status } : flight
            );
            return updatedStatus;
          });
        });
    
        return () => {
          pusher.unsubscribe('flight-status-channel');
        };
    }, []);
    

    useEffect(() => {
        const flightdata = getFlights();
        flightdata.then((data) => setFlights(data));
        updateStatus();
    }, []);

    useEffect(() => {
        if (flights.length < 400) {
            handleGenerateFlights();
        }
    }, [flights])
    
    const statusClasses: { [key: string]: string } = {
        Scheduled: 'blue',
        'In-flight': 'green',
        Cancelled: 'red',
        Delayed: 'yellow',
    };
    
    const columns: ColumnDef<FlightsColumns>[] = [        
        {
          accessorKey: "flightNumber",
          header: "flightNumber",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("flightNumber")}</div>
          ),
        },
        {
          accessorKey: "origin",
          header: () => <div>Origin</div>  
        },
        {
          accessorKey: "destination",
          header: () => <div>Destination</div>          
        },
        {
            accessorKey: "scheduledTime",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    scheduledTime
                    <ArrowUpDown />
                  </Button>
                )
            },
            cell: ({ row }) => {
                const scheduledTime:any = row.getValue("scheduledTime");
                const date: Date = new Date(scheduledTime);
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, 
                };
                const istTime = date.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    ...options,
                });
                const [datePart, timePart] = istTime.split(", ");
                const formattedDate = `${datePart.replace(/\//g, "-")} ${timePart}`;
                return <div className="lowercase">{formattedDate}</div>;
            },
        },
        {
            accessorKey: "departureTime",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Departure Time
                    <ArrowUpDown />
                  </Button>
                )
            },
            cell: ({ row }) => {
                const departureTime:any = row.getValue("departureTime");
                const date: Date = new Date(departureTime);
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, 
                };
                const istTime = date.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    ...options,
                });
                const [datePart, timePart] = istTime.split(", ");
                const formattedDate = `${datePart.replace(/\//g, "-")} ${timePart}`;
                return <div className="lowercase">{formattedDate}</div>;
            },
        },
        {
            accessorKey: "arrivalTime",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Arrival Time
                    <ArrowUpDown />
                  </Button>
                )
            },
            cell: ({ row }) => {
                const arrivalTime:any = row.getValue("arrivalTime");
                const date: Date = new Date(arrivalTime);
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, 
                };
                const istTime = date.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    ...options,
                });
                const [datePart, timePart] = istTime.split(", ");
                const formattedDate = `${datePart.replace(/\//g, "-")} ${timePart}`;
                return <div className="lowercase">{formattedDate}</div>;
            },
        },
        {
            accessorKey: "type",
            header: () => <div>Type</div>          
        },
        {
            accessorKey: "status",
            header: () => <div>Status</div>,
            cell: ({ row }) => {
                const statusOptions = ["Scheduled", "In-flight", "Cancelled", "Delayed"];
                const currentStatus = row.getValue<string>("status");
                const flightId =  row.original?._id;
            
                const handleStatusChange = async (value: string) => {
                  const newStatus = value;
                  try {
                    await updateFlightStatus(flightId, newStatus);
                  } catch (error) {
                    console.error("Error updating status:", error);
                  }
                };
                
                return (
                    <>
                    {parsedUserInfo?.role != 'admin' ? 
                    <div>
                        <span
                        style={{
                            display: 'inline-block',
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",                            
                            marginRight: '10px',
                            backgroundColor: statusClasses[currentStatus]
                        }}                        
                        ></span>
                        {currentStatus}
                    </div> 
                    : <StatusDropdown currentStatus={currentStatus} onChange={handleStatusChange}/> }
                    </>
                );
            },        
        },
    ]

    const table = useReactTable({
        data: flights,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),                
        state: {
          sorting,
          globalFilter: filterText         
        },
        onGlobalFilterChange: setFilterText
    })
    useEffect(() => {
        console.log("Current Page Index: ", table?.getState()?.pagination?.pageIndex);
    }, [table?.getState()?.pagination]);

    const paginationState = table.getState().pagination;
    const currentPage = paginationState.pageIndex + 1; // Pages are 0-based
    const totalPages = Math.ceil(table.getFilteredRowModel().rows.length / paginationState.pageSize);

    return (<>
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search all columns..."
                    value={filterText}
                    onChange={(e)=> table.setGlobalFilter(String(e.target.value))}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        )
                        })}
                    </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                        >
                        No results.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div>
                    Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
                </div>

            </div>
        </div>
    </>)
}
export default FlightList;