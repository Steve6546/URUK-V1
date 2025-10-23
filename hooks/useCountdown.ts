import { useEffect, useState } from 'react';

interface Countdown {
    hours: number;
    minutes: number;
    seconds: number;
    isTimeUp: boolean;
}

export const useCountdown = (targetTimestamp: number | null): Countdown => {
    const calculateTimeLeft = () => {
        if (!targetTimestamp) return 0;
        const left = targetTimestamp - Date.now();
        return left > 0 ? left : 0;
    };
    
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        if (!targetTimestamp) {
            setTimeLeft(0);
            return;
        }

        // Set initial time left immediately upon target change
        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft <= 0) {
                setTimeLeft(0);
                clearInterval(intervalId);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetTimestamp]);

    const isTimeUp = timeLeft <= 0;

    return {
        hours: Math.floor(timeLeft / (1000 * 60 * 60)),
        minutes: Math.floor((timeLeft / 1000 / 60) % 60),
        seconds: Math.floor((timeLeft / 1000) % 60),
        isTimeUp
    };
};