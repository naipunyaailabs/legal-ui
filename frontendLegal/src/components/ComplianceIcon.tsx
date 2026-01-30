// Compliance Badge Icons Component
import { Shield, Lock, FileText, Building2, Award } from "lucide-react";

interface ComplianceIconProps {
    iconType: string;
    className?: string;
}

export const ComplianceIcon = ({ iconType, className = "h-8 w-8" }: ComplianceIconProps) => {
    const iconMap: Record<string, React.ReactNode> = {
        "shield-network": (
            <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M12 8V11M12 11L14 13M12 11L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        "privacy-shield": (
            <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M9 11L11 13L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        "document-lock": (
            <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="12" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M10.5 12V10.5C10.5 10.1022 10.658 9.72064 10.9393 9.43934C11.2206 9.15804 11.6022 9 12 9C12.3978 9 12.7794 9.15804 13.0607 9.43934C13.342 9.72064 13.5 10.1022 13.5 10.5V12"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        "bank-security": (
            <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 21V7L12 3L19 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        "iso-standard": (
            <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
        )
    };

    return (
        <div className="text-primary">
            {iconMap[iconType] || <Shield className={className} />}
        </div>
    );
};
