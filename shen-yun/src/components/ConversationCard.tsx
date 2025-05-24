import { useRouter } from "next/navigation";

interface ConversationCardProps {
    id: string;
    title: string;
    description: string;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ id, title, description }) => {
    const router = useRouter();

    const handleClick = () => {
        console.log(`Navigating to /Console/Chat/${id}`); // Debugging
        router.push(`/console/chat/${id}`); // 🔹 Updated path
    };

    return (
        <div onClick={handleClick} className="cursor-pointer p-4 bg-[#1E2A38] rounded-md shadow-md hover:bg-[#68B3DF]">
            <h2 className="text-lg font-bold text-[#FAFFEB]">{title || "Untitled Chat"}</h2>
            <p className="text-sm text-[#FAFFEB]">{description || "No description available."}</p>
        </div>
    );
};

export default ConversationCard;
