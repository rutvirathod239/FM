"use client"
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

interface ConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({isOpen, onClose, onConfirm}) => {
    return (<>
        <AlertDialog open={isOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Do you want to update Flight status?</AlertDialogTitle>            
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </>)
}
export default ConfirmationDialog;
