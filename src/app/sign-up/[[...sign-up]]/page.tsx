import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-[#1c1c1e] border border-white/10",
                    }
                }}
            />
        </div>
    );
}
