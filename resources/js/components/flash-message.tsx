import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SharedData } from '@/types';

interface FlashMessageProps {
    className?: string;
}

export default function FlashMessage({ className }: FlashMessageProps) {
    const { flash } = usePage<SharedData>().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Réinitialiser la visibilité quand les flash messages changent
        setVisible(true);
        
        // Auto-dismiss après 5 secondes
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [flash?.success, flash?.error]);

    if (!flash || (!flash.success && !flash.error) || !visible) {
        return null;
    }

    return (
        <div className={`fixed top-4 right-4 z-50 w-full max-w-md ${className || ''}`}>
            {flash.success && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                        <AlertTitle className="text-green-800 dark:text-green-200">
                            Succès
                        </AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-300">
                            {flash.success}
                        </AlertDescription>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="ml-auto text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                        aria-label="Fermer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </Alert>
            )}

            {flash.error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <div className="flex-1">
                        <AlertTitle className="text-red-800 dark:text-red-200">
                            Erreur
                        </AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-300">
                            {flash.error}
                        </AlertDescription>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                        aria-label="Fermer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </Alert>
            )}
        </div>
    );
}

