import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import ConfirmationDialog from "./ConfirmationDialog";

interface StatusDropdownProps {
    currentStatus: string
    onChange: (newStatus: string) => void;
}

const statusOptions = [
  { value: "Scheduled", label: "Scheduled", color: "#0000FF" }, // Blue
  { value: "In-flight", label: "In-flight", color: "#008000" }, // Green
  { value: "Cancelled", label: "Cancelled", color: "#FF0000" }, // Red
  { value: "Delayed", label: "Delayed", color: "#FFA500" }, // Orange
];

const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, onChange }) => {
    const [selectedStatus, setSelectedStatus] = useState(
        statusOptions.find((option) => option.value === currentStatus)
    );
    const [isOpen, setIsOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const handleSelect = (status: any) => {
        setPendingStatus(status.value);
        setIsOpen(true);
    };

    const confirmChange = () => {
        if (pendingStatus) {
          const newStatus = statusOptions.find(
            (option) => option.value === pendingStatus
          );
          setSelectedStatus(newStatus);
          onChange(pendingStatus);
        }
        setIsOpen(false);
    };
    
    const cancelChange = () => {
        setPendingStatus(null);
        setIsOpen(false);
    };
    

    return (
        <>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 border px-4 py-2 rounded">
            <span
                style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: selectedStatus?.color,
                }}
            ></span>
            {selectedStatus?.label}
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {statusOptions
            .filter((status) => status.value !== currentStatus)
            .map((status) => (
            <DropdownMenuItem
                key={status.value}
                onClick={() => handleSelect(status)}
                className="flex items-center gap-2 cursor-pointer"
            >
                <span
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: status.color,
                }}
                ></span>
                {status.label}
            </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmationDialog  isOpen={isOpen} onClose={cancelChange} onConfirm={confirmChange}/>
        </>
    );
};

export default StatusDropdown;
