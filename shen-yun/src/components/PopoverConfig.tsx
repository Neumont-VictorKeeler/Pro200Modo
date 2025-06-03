import React, { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Settings } from 'lucide-react';
import axios from 'axios';
import { useLocalStorage } from '@uidotdev/usehooks';

export default function PopoverConfig({ isHidden }: { isHidden: boolean }) {
    const [personality, setPersonality] = useLocalStorage<string | undefined>("personality", undefined);
    const [language, setLanguage] = useLocalStorage<string | undefined>("language", undefined);
    const [personalityStrength, setPersonalityStrength] = useLocalStorage<number>("personalityStrength", 33);
    const [yapness, setYapness] = useLocalStorage<number>("yapness", 33);
    const [slangUsage, setSlangUsage] = useLocalStorage<number>("slangUsage", 33);

    const sendMessageToChatbot = async (message: string) => {
        try {
            await axios.post("/api/chat", { prompt: message });
        } catch (error) {
            console.error("Error sending message to chatbot:", error);
        }
    };

    const handleSliderChange = (setter: (val: number) => void, label: string) => (val: number[]) => {
        setter(val[0]);
        sendMessageToChatbot(`${label} set to ${val[0]}`);
    };

    return (
        <div className={`flex ${isHidden ? "hidden" : ""}`}>
            <Popover>
                <PopoverTrigger>
                    <Settings className="text-white cursor-pointer hover:text-orange-400" size={24} />
                </PopoverTrigger>
                <PopoverContent className="bg-white text-gray-900 mt-4 rounded-xl border shadow-xl w-72 p-4 space-y-4">
                    <div className="text-lg font-semibold text-center text-blue-700">MODO Config</div>

                    <Select value={personality} onValueChange={setPersonality}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Personality" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Personality</SelectLabel>
                                <SelectItem value="freaky">Freaky</SelectItem>
                                <SelectItem value="silly">Silly</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Language</SelectLabel>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="chinese">Chinese</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div>
                        <label className="text-sm font-medium">Personality Strength</label>
                        <Slider
                            value={[personalityStrength]}
                            max={100}
                            step={1}
                            onValueChange={handleSliderChange(setPersonalityStrength, "Personality Strength")}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Yapness</label>
                        <Slider
                            value={[yapness]}
                            max={100}
                            step={1}
                            onValueChange={handleSliderChange(setYapness, "Yapness")}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Slang Usage</label>
                        <Slider
                            value={[slangUsage]}
                            max={100}
                            step={1}
                            onValueChange={handleSliderChange(setSlangUsage, "Slang Usage")}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
